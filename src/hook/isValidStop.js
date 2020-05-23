// Controller
const stopCtrl = require('../components/stop/stop.controller');

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
    let stopId = req.params.stopId; // get the stop id 

    // get all the published schedule  
    let isValidStop = await stopCtrl.isValidStop(stopId);

    // check whether the document type already exists
    if (isValidStop.success) next();
    else {
      error('Stop Id are not Valid !'); // route doesnt exist 
      Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.stops.invalidStopId);
    }

    // catch any runtime error 
  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
