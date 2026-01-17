/* eslint-disable no-unused-vars */
const Service = require('./Service');
const { DAL } = require('./DAL');

/**
* Retrieve a list of all games in the exchange
*
* returns List
* */
const gamesGET = () => new Promise(
  async (resolve, reject) => {
    try {
      const games = await DAL.getAllGames();
      resolve(Service.successResponse(games));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Remove a game from the exchange list by ID
*
* id Long 
* no response value expected for this operation
* */
const gamesIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = await DAL.deleteGameById(id);
      resolve({
        code: 204,
        payload: result
      });
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Retrieve a game by ID
*
* id Long 
* returns Game
* */
const gamesIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const game = await DAL.getGameById(id);
      resolve(Service.successResponse(game));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Update certain properties of a game by ID (Partial Update)
*
* id Long 
* gamesIdPatchRequest GamesIdPatchRequest 
* returns Game
* */
const gamesIdPATCH = ({ id, body }) => new Promise(
  async (resolve, reject) => {
    try {
      const game = await DAL.partiallyUpdateGame(id, body);
      resolve(Service.successResponse(game));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Replace all properties of a game by ID (Full Update)
*
* id Long 
* gameCreate GameCreate 
* returns Game
* */
const gamesIdPUT = ({ id, body }) => new Promise(
  async (resolve, reject) => {
    try {
      const game = await DAL.fullyUpdateGame(id, body);
      resolve(Service.successResponse(game));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Retrieve a game by name
*
* name String 
* returns Game
* */
const gamesNameGET = ({ name }) => new Promise(
  async (resolve, reject) => {
    try {
      const game = await DAL.getGameByName(name);
      resolve(Service.successResponse(game));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Add a new game to the exchange list
*
* gameCreate GameCreate 
* returns Game
* */
const gamesPOST = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      const game = await DAL.addNewGame(body);
      resolve({
        code: 201,
        payload: game
    });
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Retrieve a list of all users
*
* returns List
* */
const usersGET = () => new Promise(
  async (resolve, reject) => {
    try {
      const users = await DAL.getAllUsers();
      resolve(Service.successResponse(users));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Get a user from the system by ID
*
* id Long 
* returns User
* */
const usersIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const user = await DAL.getUserById(id);
      resolve(Service.successResponse(user));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Remove a user from the system by ID
*
* id Long 
* no response value expected for this operation
* */
const usersIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = await DAL.deleteUser(id);
      resolve({
        code: 204,
        payload: result
      });
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Update certain properties of a user by ID (Partial Update)
*
* id Long 
* usersIdPatchRequest UsersIdPatchRequest 
* returns User
* */
const usersIdPATCH = ({ id, body }) => new Promise(
  async (resolve, reject) => {
    try {
      const user = await DAL.partiallyUpdateUser(id, body);
      resolve(Service.successResponse(user));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Update user by ID (Full Update)
*
* id Long 
* userCreate UserCreate 
* returns User
* */
const usersIdPUT = ({ id, body }) => new Promise(
  async (resolve, reject) => {
    try {
      const user = await DAL.fullyUpdateUser(id, body);
      resolve(Service.successResponse(user));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Add a new user to the system
*
* userCreate UserCreate 
* returns User
* */
const usersPOST = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      const user = await DAL.addNewUser(body);
      resolve({
        code: 201,
        payload: user
      })
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);

module.exports = {
  gamesGET,
  gamesIdDELETE,
  gamesIdGET,
  gamesIdPATCH,
  gamesIdPUT,
  gamesNameGET,
  gamesPOST,
  usersGET,
  usersIdGET,
  usersIdDELETE,
  usersIdPATCH,
  usersIdPUT,
  usersPOST,
};
