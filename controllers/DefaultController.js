/**
 * The DefaultController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/DefaultService');
const gamesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.gamesGET);
};

const gamesIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.gamesIdDELETE);
};

const gamesIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.gamesIdGET);
};

const gamesIdPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service.gamesIdPATCH);
};

const gamesIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.gamesIdPUT);
};

const gamesNameGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.gamesNameGET);
};

const gamesPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.gamesPOST);
};

const offersCreatePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.offersCreatePOST);
};

const offersIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.offersIdGET);
};

const offersIdPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service.offersIdPATCH);
};

const usersGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.usersGET);
};

const usersIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.usersIdDELETE);
};

const usersIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.usersIdGET);
};

const usersIdPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service.usersIdPATCH);
};

const usersIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.usersIdPUT);
};

const usersPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.usersPOST);
};


module.exports = {
  gamesGET,
  gamesIdDELETE,
  gamesIdGET,
  gamesIdPATCH,
  gamesIdPUT,
  gamesNameGET,
  gamesPOST,
  offersCreatePOST,
  offersIdGET,
  offersIdPATCH,
  usersGET,
  usersIdDELETE,
  usersIdGET,
  usersIdPATCH,
  usersIdPUT,
  usersPOST,
};
