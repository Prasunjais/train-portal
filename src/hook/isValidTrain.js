// Controller
const trainCtrl = require('../components/trains/trains.controller');

// Responses & others utils 
const Response = require('../responses/response');
const StatusCodes = require('../facades/response');
const MessageTypes = require('../responses/types');
const Exceptions = require('../exceptions/Handler');
const {
  error,
  info
} = require('../utils').logging;

// exporting the hooks 
module.exports = async (req, res, next) => {
  try {
    info('Check whether the stop id!');
    let trainId = req.params.trainId || req.body.trainId || req.query.trainId; // get the train id 
    if (trainId) {
      // get all the published schedule  
      let isValidTrain = await trainCtrl.isValidTrain(trainId);

      // check whether the document type already exists
      if (isValidTrain.success) next();
      else {
        error('Stop Id are not Valid !'); // route doesnt exist 
        Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.train.invalidTrainId);
      }
    } else next();

    // catch any runtime error 
  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
