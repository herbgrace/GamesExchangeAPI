/* eslint-disable no-unused-vars */
// Will not work in Backup's location, but will for regular controller's location
const Service = require('./Service');
const { DAL } = require('./DAL');
const BASE_URI = 'http://localhost:8080';

/**
* Retrieve a list of all games in the exchange
*
* returns List
* */
const gamesGET = () => new Promise(
  async (resolve, reject) => {
    try {
      const games = await DAL.getAllGames();
      for (let game of games) {
        game.previousOwner = game.previousOwner ? `${BASE_URI}/users/${game.previousOwner}` : "None";
        game.URI = `${BASE_URI}/games/${game.id}`;
      }
      console.log(games);
      resolve(Service.successResponse(games));
    } catch (e) {
      console.error(e);
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
      console.log(result);
      resolve({
        code: 204,
        payload: result
      });
    } catch (e) {
      console.error(e);
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
      game.previousOwner = game.previousOwner ? `${BASE_URI}/users/${game.previousOwner}` : "None";
      console.log(game);
      resolve(Service.successResponse(game));
    } catch (e) {
      console.error(e);
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
      game.previousOwner = game.previousOwner ? `${BASE_URI}/users/${game.previousOwner}` : "None";
      game.newURI = `${BASE_URI}/games/${game.id}`;
      console.log(game);
      resolve(Service.successResponse(game));
    } catch (e) {
      console.error(e);
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
      game.previousOwner = game.previousOwner ? `${BASE_URI}/users/${game.previousOwner}` : "None";
      game.newURI = `${BASE_URI}/games/${game.id}`;
      console.log(game);
      resolve(Service.successResponse(game));
    } catch (e) {
      console.error(e);
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
      game.previousOwner = game.previousOwner ? `${BASE_URI}/users/${game.previousOwner}` : "None";
      console.log(game);
      resolve(Service.successResponse(game));
    } catch (e) {
      console.error(e);
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
      game.previousOwner = game.previousOwner ? `${BASE_URI}/users/${game.previousOwner}` : "None";
      game.URI = `${BASE_URI}/games/${game.id}`;
      console.log(game);
      resolve({
        code: 201,
        payload: game
    });
    } catch (e) {
      console.error(e);
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
      for (let user of users) {
        delete user.password;
        user.URI = `${BASE_URI}/users/${user.id}`;
      }
      console.log(users);
      resolve(Service.successResponse(users));
    } catch (e) {
      console.error(e);
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
      delete user.password;
      console.log(user);
      resolve(Service.successResponse(user));
    } catch (e) {
      console.error(e);
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
      console.log(result);
      resolve({
        code: 204,
        payload: result
      });
    } catch (e) {
      console.error(e);
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
      delete user.password;
      user.newURI = `${BASE_URI}/users/${user.id}`;
      console.log(user);
      resolve(Service.successResponse(user));
    } catch (e) {
      console.error(e);
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
      delete user.password;
      user.newURI = `${BASE_URI}/users/${user.id}`;
      console.log(user);
      resolve(Service.successResponse(user));
    } catch (e) {
      console.error(e);
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
      delete user.password;
      user.URI = `${BASE_URI}/users/${user.id}`;
      console.log(user);
      resolve({
        code: 201,
        payload: user
      })
    } catch (e) {
      console.error(e);
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Retrieve an offer by ID
*
* id Long 
* returns Offer
* */
const offersIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Create a new offer
*
* id Long 
* offerUpdate OfferUpdate 
* returns Offer
* */
const offersIdPATCH = ({ id, offerUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        offerUpdate,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Retrieve an offer by ID
*
* offerCreate OfferCreate 
* returns Offer
* */
const offersCreatePOST = ({ offerCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        offerCreate,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
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
  offersIdGET,
  offersIdPATCH,
  offersCreatePOST,
};
