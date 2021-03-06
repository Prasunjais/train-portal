const BaseController = require('../baseController');
const Model = require('./models/stop.model');
const mongoose = require('mongoose');
const _ = require('lodash');
const {
  error,
  info
} = require('../../utils').logging;

// getting the model 
class userController extends BaseController {
  // constructor 
  constructor() {
    super();
    this.messageTypes = this.messageTypes.stops;
  }

  // do something 
  create = async (req, res) => {
    try {
      info('running the controller');

      let stopCreated = await Model.create({
        stopInitial: req.body.initial,
        name: req.body.name || '',
        description: req.body.description || ''
      });

      const resp = {
        status: 200,
        data: stopCreated
      };

      // success response 
      return this.success(req, res, this.status.HTTP_OK, resp, this.messageTypes.create);

      // catch any runtime error 
    } catch (e) {
      error(e);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, err));
    }
  }

  // check whether the stop id valid 
  isValidStop = async (stopId) => {
    try {
      info('Is Valid Stop');
      let ObjectId = mongoose.Types.ObjectId;
      let stopCreated = {};

      // is valid stop ids 
      if (ObjectId.isValid(stopId))
        stopCreated = await Model.findOne({
          _id: mongoose.Types.ObjectId(stopId),
          status: true
        }).lean();
      else
        return {
          success: false,
        };

      // if stop not created 
      if (!_.isEmpty(stopCreated)) return {
        success: true,
        data: stopCreated
      };
      else return {
        success: false,
      };

      // catch any runtime error 
    } catch (e) {
      error(e);
      return {
        success: false,
        error: e
      };
    }
  }

  // do something else 
  patch = async (req, res) => {
    try {
      let dataToPatch = {},
        stopId = req.params.stopId,
        isUpdated = {};

      // initializing data to update
      if (req.body.name) dataToPatch = {
        ...dataToPatch,
        name: req.body.name || ''
      }
      if (req.body.description) dataToPatch = {
        ...dataToPatch,
        description: req.body.description || ''
      }
      if (req.body.initial) dataToPatch = {
        ...dataToPatch,
        stopInitial: req.body.initial || ''
      }

      // check whether the data to update contains data
      if (dataToPatch && !_.isEmpty(dataToPatch)) {
        await Model.update({
          '_id': mongoose.Types.ObjectId(stopId)
        }, {
          $set: dataToPatch
        }).lean().catch((error) => {
          console.log('Error occurred here , the error is --> ', error);
        });
      } else return this.errors(req, res, this.status.HTTP_METHOD_NOT_ALLOWED, this.messageTypes.updateNotAllowed);

      // success response 
      return this.success(req, res, this.status.HTTP_OK, dataToPatch, this.messageTypes.patch);

      // catch any runtime error 
    } catch (e) {
      error(e);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, err));
    }
  }

  // get
  get = async (req, res) => {
    try {
      info('Get all the locations of the battle !');
      let limit = parseInt(req.query.limit || 20),
        skip = parseInt(req.query.skip || 0),
        search = req.query.search || '';

      // fields to project
      let fieldsToSelectObject = {
        'name': 1,
        'description': 1,
        'stopInitial': 1,
      };

      let searchObject = {};

      // king name 
      if (search) searchObject = {
        ...searchObject,
        '$or': [{
          'name': {
            $regex: req.query.search,
            $options: 'is'
          }
        }, {
          'description': {
            $regex: req.query.search,
            $options: 'is'
          }
        }, {
          'stopInitial': {
            $regex: req.query.search,
            $options: 'is'
          }
        }]
      }

      // get all the locations 
      let stops = await Model.aggregate([
        {
          '$project': fieldsToSelectObject
        }, {
          '$match': {
            ...searchObject
          }
        }, {
          '$skip': skip
        }, {
          '$limit': limit
        }]).allowDiskUse(true);

      // success response 
      return this.success(req, res, this.status.HTTP_OK,
        {
          results: stops,
          pageMeta: {
            skip: parseInt(skip),
            pageSize: limit,
            total: stops.length
          }
        }, this.messageTypes.stopFetchedSuccessfully);

      // catch any runtime error 
    } catch (e) {
      error(e);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, err));
    }
  }
}

// exporting the modules 
module.exports = new userController();
