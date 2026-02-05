/* eslint-disable no-unused-vars */
const Service = require('./Service');
const { DAL } = require('./DAL');

const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'video-game-exchange-web-server',
  brokers: [`${process.env.KAFKA_HOST || "kafka-broker"}:${process.env.KAFKA_PORT || "9092"}`]
});
const kafkaClient = kafka.producer();
kafkaClient.connect().then(() => {
  console.log("Kafka client connected");
}).catch((error) => {
  console.error("Error connecting Kafka client:", error);
}); 

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

      kafkaClient.send({
        topic: 'password-changed',
        messages: [
          { value: `${user.id}` },
        ],
      });
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

      kafkaClient.send({
        topic: 'password-changed',
        messages: [
          { value: `${user.id}}` },
        ],
      });
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
      let offer = await DAL.getOfferById(id);
    
      offer = formatOffer(offer);
      console.log(offer);
      resolve(Service.successResponse(offer));
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
const offersIdPATCH = ({ id, body }) => new Promise(
  async (resolve, reject) => {
    try {
      if (body.status == "Accepted") {
        let offer = await DAL.updateOffer(id, body);
        const gameRequested = await DAL.getGameById(offer.gameRequested);
        const gameOffered =  await DAL.getGameById(offer.gameOffered);

        // Swap the owners of each game
        await DAL.partiallyUpdateGame(gameRequested.id, { previousOwner: gameOffered.previousOwner });
        await DAL.partiallyUpdateGame(gameOffered.id, { previousOwner: gameRequested.previousOwner });

        offer = formatOffer(offer);
        console.log(offer);

        kafkaClient.send({
          topic: 'offer-accepted',
          messages: [
            { value: `${id}` },
          ],
        });
        resolve(Service.successResponse(offer));

      } else if (body.status == "Rejected") {
        let offer = await DAL.updateOffer(id, body);

        offer = formatOffer(offer);
        console.log(offer);

        kafkaClient.send({
          topic: 'offer-rejected',
          messages: [
            { value: `${id}` },
          ],
        });
        resolve(Service.successResponse(offer));

      } else {
        reject(Service.rejectResponse(
          'Offer status must be either Accepted or Rejected',
          405,
        ));
      }
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
const offersCreatePOST = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      const requestedGame = await DAL.getGameById(body.gameRequested);
      body.requestedOwnerId = requestedGame.previousOwner;

      const offeredGame = await DAL.getGameById(body.gameOffered);
      body.offeredOwnerId = offeredGame.previousOwner;
      let offer = await DAL.addNewOffer(body);
      
      offer = formatOffer(offer);
      offer.URI = `${BASE_URI}/offers/${offer.id}`;
      console.log(offer);

      kafkaClient.send({
        topic: 'offer-created',
        messages: [
          { value: `${offer.id}` },
        ],
      });
      resolve({
        code: 201,
        payload: offer
    });
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

const formatOffer = (offer) => {
  offer.gameRequested = `${BASE_URI}/games/${offer.gameRequested}`;
  offer.requestedOwner = `${BASE_URI}/users/${offer.requestedOwner}`;
  offer.gameOffered = `${BASE_URI}/games/${offer.gameOffered}`;
  offer.offeredOwner = `${BASE_URI}/users/${offer.offeredOwner}`;
  return offer;
}

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
