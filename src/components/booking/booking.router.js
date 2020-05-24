// user controller 
const ctrl = require('./booking.controller');
// custom joi validation
const {
  get, // get the stop list 
  create,
  patch,
  patchStatus
} = require('./booking.validators');
// hooks 
const {
  isValidTrain
} = require('../../hook')
// exporting the user routes 
function userRoutes() {
  return (open, closed) => {
    closed.route('/booking').post([create], isValidTrain, ctrl.create);
    closed.route('/booking').get([get], isValidTrain, ctrl.get);
  };
}

module.exports = userRoutes();
