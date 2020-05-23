// user controller 
const ctrl = require('./stop.controller');
// custom joi validation
const {
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
  };
}

module.exports = userRoutes();
