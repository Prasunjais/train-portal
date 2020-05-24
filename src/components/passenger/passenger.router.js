// user controller 
const ctrl = require('./passenger.controller');
// custom joi validation
const {
  get, // get the stop list 
  create,
  patch,
  patchStatus
} = require('./passenger.validators');
// hooks 
const {
  isValidTrain
} = require('../../hook')
// exporting the user routes 
function userRoutes() {
  return (open, closed) => {
  };
}

module.exports = userRoutes();
