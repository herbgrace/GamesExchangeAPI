const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'host.docker.internal',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'dev123',
    database: process.env.DB_NAME || 'GamesExchangeDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ABOUT AI USAGE IN THIS PROJECT:
// Most of this file was written with the help of inline suggestions from VSC Copilot.
// It's almost exactly what I would have done, just faster.
// The only part I specifically asked it for help with was the partiallyUpdateGame/User functions
// (This was the main file I worked on, the only other one I edited was DefaultService.js and openapi.yaml of course)

exports.DAL = {
    getAllGames : async function() {
        try {
            const [rows, fields] = await pool.promise().query('SELECT * FROM Games');
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getGameById : async function(id) {
        if (!id) {
            throw new Error('ID is required');
        }
        try {
            const [rows, fields] = await pool.promise().query(
                'SELECT * FROM Games WHERE id = ?',
                [id]
            );
            if (rows.length === 0) {
                throw new Error('Game not found');
            }
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    getGameByName : async function(name) {
        if (!name) {
            throw new Error('Name is required');
        }
        try {
            const [rows, fields] = await pool.promise().query(
                'SELECT * FROM Games WHERE name = ?',
                [name]
            );
            if (rows.length === 0) {
                throw new Error('Game not found');
            }
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    partiallyUpdateGame : async function(id, game) {
        try {
            if (!game || !id) {
                throw new Error('Game data and ID are required');
            }
            
            // Build updates object with only provided fields
            const updates = {};
            if (game.name !== undefined) updates.name = game.name;
            if (game.publisher !== undefined) updates.publisher = game.publisher;
            if (game.releaseYear !== undefined) updates.releaseYear = game.releaseYear;
            if (game.releaseSystem !== undefined) updates.releaseSystem = game.releaseSystem;
            if (game.condition !== undefined) updates.condition = game.condition;

            // Validate previousOwner if provided
            if (game.previousOwner !== undefined) {
                const [users] = await pool.promise().query(
                    'SELECT id FROM Users WHERE id = ?',
                    [game.previousOwner]
                );
                if (users.length === 0) {
                    throw new Error('Invalid previousOwner: User ID does not exist');
                }
                updates.previousOwner = game.previousOwner;
            }

            if (game.previousOwner !== undefined) updates.previousOwner = game.previousOwner;
            
            if (Object.keys(updates).length === 0) {
                throw new Error('At least one field (name, publisher, releaseYear, releaseSystem, condition, previousOwner) must be provided for update');
            }
            
            // Dynamically build the UPDATE query
            const fields = Object.keys(updates);
            const values = Object.values(updates);
            values.push(id);
            
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            
            
            const result = await pool.promise().execute(
                `UPDATE Games SET ${setClause} WHERE id = ?`,
                values
            );

            if (result.affectedRows === 0) {
                throw new Error('Game not found');
            }
            
            // Fetch and return the updated game
            const [rows] = await pool.promise().query(
                'SELECT * FROM Games WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    fullyUpdateGame : async function(id, game) {
        try {
            if (!game || !id) {
                throw new Error('Game data and ID are required');
            }
            let { name, publisher, releaseYear, releaseSystem, condition, previousOwner } = game;
            if (!name || !publisher || !releaseYear || !releaseSystem || !condition) {
                throw new Error('name, publisher, releaseYear, releaseSystem, and condition are required');
            }

            // Validate previousOwner if provided
            if (previousOwner) {
                const [users] = await pool.promise().query(
                    'SELECT id FROM Users WHERE id = ?',
                    [previousOwner]
                );
                if (users.length === 0) {
                    throw new Error('Invalid previousOwner: User ID does not exist');
                }
            } else {
                previousOwner = null;
            }

            const [result] = await pool.promise().execute(
                'UPDATE Games SET name = ?, publisher = ?, releaseYear = ?, releaseSystem = ?, `condition` = ?, previousOwner = ? WHERE id = ?',
                [name, publisher, releaseYear, releaseSystem, condition, previousOwner, id]
            );
            if (result.affectedRows === 0) {
                throw new Error('Game not found');
            }
            // Fetch the updated game to include the email in response
            const [rows] = await pool.promise().query(
                'SELECT * FROM Games WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    addNewGame : async function(game) {
        try {
            if (!game) {
                throw new Error('Game data is required');
            }
            let { name, publisher, releaseYear, releaseSystem, condition, previousOwner } = game;
            if (!name || !publisher || !releaseYear || !releaseSystem || !condition) {
                throw new Error('name, publisher, releaseYear, releaseSystem, and condition are required');
            }
            
            // Validate previousOwner if provided
            if (previousOwner) {
                const [users] = await pool.promise().query(
                    'SELECT id FROM Users WHERE id = ?',
                    [previousOwner]
                );
                if (users.length === 0) {
                    throw new Error('Invalid previousOwner: User ID does not exist');
                }
            } else {
                previousOwner = null;
            }
            
            const [result] = await pool.promise().execute(
                'INSERT INTO Games (name, publisher, releaseYear, releaseSystem, `condition`, previousOwner) VALUES (?, ?, ?, ?, ?, ?)',
                [name, publisher, releaseYear, releaseSystem, condition, previousOwner]
            );
            // Return the newly inserted game with the generated ID
            return {
                id: result.insertId,
                name,
                publisher,
                releaseYear,
                releaseSystem,
                condition,
                previousOwner
            };
        } catch (error) {
            throw error;
        }
    },

    deleteGameById : async function(id) {
        if (!id) {
            throw new Error('ID is required');
        }
        try {
            const [result] = await pool.promise().execute(
                'DELETE FROM Games WHERE id = ?',
                [id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    getAllUsers : async function() {
        try {
            const [rows, fields] = await pool.promise().query('SELECT * FROM Users');
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getUserById : async function(id) {
        if (!id) {
            throw new Error('ID is required');
        }
        try {
            const [rows, fields] = await pool.promise().query(
                'SELECT * FROM Users WHERE id = ?',
                [id]
            );
            if (rows.length === 0) {
                throw new Error('User not found');
            }
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    addNewUser : async function(user) {
        try {
            if (!user) {
                throw new Error('User data is required');
            }
            const { username, email, password, address } = user;
            if (!username || !email || !password || !address) {
                throw new Error('username, email, password, and address are required');
            }
            const [result] = await pool.promise().execute(
                'INSERT INTO Users (username, email, password, address) VALUES (?, ?, ?, ?)',
                [username, email, password, address]
            );
            // Return the newly inserted user with the generated ID
            return {
                id: result.insertId,
                username,
                email,
                password,
                address
            };
        } catch (error) {
            throw error;
        }
    },

    fullyUpdateUser : async function(id, user) {
        try {
            if (!user || !id) {
                throw new Error('User data and ID are required');
            }
            const { username, password, address } = user;
            if (!username || !password || !address) {
                throw new Error('username, password and address are required');
            }
            const [result] = await pool.promise().execute(
                'UPDATE Users SET username = ?, password = ?, address = ? WHERE id = ?',
                [username, password, address, id]
            );
            if (result.affectedRows === 0) {
                throw new Error('User not found');
            }
            // Fetch the updated user to include the email in response
            const [rows] = await pool.promise().query(
                'SELECT * FROM Users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    partiallyUpdateUser : async function(id, user) {
        try {
            if (!user || !id) {
                throw new Error('User data and ID are required');
            }
            
            // Build updates object with only provided fields
            const updates = {};
            if (user.username !== undefined) updates.username = user.username;
            if (user.password !== undefined) updates.password = user.password;
            if (user.address !== undefined) updates.address = user.address;
            
            if (Object.keys(updates).length === 0) {
                throw new Error('At least one field (username, password, or address) must be provided for update');
            }
            
            // Dynamically build the UPDATE query
            const fields = Object.keys(updates);
            const values = Object.values(updates);
            values.push(id);
            
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            
            const result = await pool.promise().execute(
                `UPDATE Users SET ${setClause} WHERE id = ?`,
                values
            );

            if (result.affectedRows === 0) {
                throw new Error('User not found');
            }
            
            // Fetch and return the updated user
            const [rows] = await pool.promise().query(
                'SELECT * FROM Users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    deleteUser : async function(id) {
        try {
            if (!id) {
                throw new Error('ID is required');
            }
            await pool.promise().execute(
                'DELETE FROM Users WHERE id = ?',
                [id]
            );
            return { message: "User deleted successfully" };
        } catch (error) {
            throw error;
        }
    },

    getOfferById : async function(id) {
        try {
            if (!id) {
                throw new Error('ID is required');
            }
            const [rows] = await pool.promise().query(
                'SELECT * FROM Offers WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    addNewOffer : async function(offer) {
        try {
            if (!offer) {
                throw new Error('Offer data is required');
            }
            const { gameRequested, gameOffered, requestedOwnerId, offeredOwnerId } = offer;
            if (!gameRequested || !gameOffered || !requestedOwnerId || !offeredOwnerId) {
                throw new Error('gameRequested, gameOffered, requestedOwnerId, and offeredOwnerId are required');
            }
            const [result] = await pool.promise().execute(
                'INSERT INTO Offers (gameRequested, gameOffered, requestedOwner, offeredOwner, status) VALUES (?, ?, ?, ?, ?)',
                [gameRequested, gameOffered, requestedOwnerId, offeredOwnerId, 'Pending']
            );
            // Return the newly inserted user with the generated ID
            return {
                id: result.insertId,
                gameRequested,
                requestedOwner: requestedOwnerId,
                gameOffered,
                offeredOwner: offeredOwnerId,
                status: 'Pending'
            };
        } catch (error) {
            throw error;
        }
    },

    updateOffer : async function(id, offer) {
        try {
            if (!offer || !id || !offer.status) {
                throw new Error('Offer data and ID are required');
            }
            const { status } = offer;
            const currentOffer = await this.getOfferById(id);
            if (currentOffer.status !== "Pending") {
                throw new Error('Only pending offers can be updated');
            }

            const [result] = await pool.promise().execute(
                'UPDATE Offers SET status = ? WHERE id = ?',
                [status, id]
            );
            if (result.affectedRows === 0) {
                throw new Error('Offer not found');
            }
            // Fetch the updated offer to include in response
            const [rows] = await pool.promise().query(
                'SELECT * FROM Offers WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}
