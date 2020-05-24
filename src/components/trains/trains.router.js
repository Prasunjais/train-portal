// user controller 
const ctrl = require('./trains.controller');
// custom joi validation
const {
  get, // get the stop list 
  create,
  patch,
  patchStatus
} = require('./trains.validators');
// hooks 
const {
  isValidTrain
} = require('../../hook')
// exporting the user routes 
function userRoutes() {
  return (open, closed) => {
    closed.route('/train').post([create], ctrl.create);
    closed.route('/train/:trainId').patch([patch], isValidTrain, ctrl.patch);
    closed.route('/train').get([get], ctrl.get)
    closed.route('/train/:trainId/:type').patch([patchStatus], ctrl.patchStatus)
  };
}

module.exports = userRoutes();
