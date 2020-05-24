// user controller 
const ctrl = require('./stop.controller');
// custom joi validation
const {
  get, // get the stop list 
  create,
  patch
} = require('./stop.validators');
// hooks 
const {
  isValidStop
} = require('../../hook')
// exporting the user routes 
function userRoutes() {
  return (open, closed) => {
    closed.route('/stop').post([create], ctrl.create);
    closed.route('/stop/:stopId').patch([patch], isValidStop, ctrl.patch);
    closed.route('/stop').get([get], ctrl.get)
  };
}

module.exports = userRoutes();
