const BaseController = require('../baseController');
const Model = require('./models/trains.model');
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
    this.messageTypes = this.messageTypes.train;
  }

  // do something 
  create = async (req, res) => {
    try {
      info('running the controller');

      let stopCreated = await Model.create({
        ...req.body
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
  isValidTrain = async (trainId) => {
    try {
      info('Is Valid Stop');
      let ObjectId = mongoose.Types.ObjectId;
      let isValidTrain = {};

      // is valid stop ids 
      if (ObjectId.isValid(trainId))
        isValidTrain = await Model.findOne({
          _id: mongoose.Types.ObjectId(trainId),
          status: true
        }).lean();
      else
        return {
          success: false,
        };

      // if stop not created 
      if (!_.isEmpty(isValidTrain)) return {
        success: true,
        data: isValidTrain
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
        trainId = req.params.trainId,
        isUpdated = {};

      // initializing data to update
      if (req.body.name) dataToPatch = {
        ...dataToPatch,
        name: req.body.name || ''
      }
      if (req.body.number) dataToPatch = {
        ...dataToPatch,
        number: req.body.number || ''
      }

      // check whether the data to update contains data
      if (dataToPatch && !_.isEmpty(dataToPatch)) {
        await Model.update({
          '_id': mongoose.Types.ObjectId(trainId)
        }, {
          $set: dataToPatch
        }).lean().catch((error) => {
          error(error);
          throw new Error('error');
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

  patchStatus = async (req, res) => {
    try {
      let dataToPatch = {},
        trainId = req.params.trainId,
        isUpdated = {};

      // initializing data to update
      if (req.params.type == 'activate') dataToPatch = {
        status: true
      }
      if (req.params.type == 'de-activate') dataToPatch = {
        status: false
      }

      // check whether the data to update contains data
      if (dataToPatch && !_.isEmpty(dataToPatch)) {
        await Model.update({
          '_id': mongoose.Types.ObjectId(trainId)
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
        srcStop = req.query.srcStop || '',
        destStop = req.query.destStop || '',
        destSearchObj = {},
        srcSearchObj = {},
        trainSearchObj = {},
        train = req.query.train || '';

      // fields to project
      let fieldsToSelectObject = {
        'name': 1,
        'number': 1,
        'startTimeInMin': 1,
        'stops': 1,
        'status': 1
      };

      let searchObject = {};

      // source stop name 
      if (srcStop) srcSearchObj = {
        '$or': [{
          'stops.stopName': {
            $regex: req.query.srcStop,
            $options: 'is'
          }
        }, {
          'stops.stopInitial': {
            $regex: req.query.srcStop,
            $options: 'is'
          }
        }]
      }

      // destination stop name 
      if (destStop) destSearchObj = {
        '$or': [{
          'stops.stopName': {
            $regex: req.query.destStop,
            $options: 'is'
          }
        }, {
          'stops.stopInitial': {
            $regex: req.query.destStop,
            $options: 'is'
          }
        }]
      }

      // train search 
      if (train) trainSearchObj = {
        '$or': [{
          'number': {
            $regex: req.query.train,
            $options: 'is'
          }
        }, {
          'name': {
            $regex: req.query.train,
            $options: 'is'
          }
        }]
      }

      // search object 
      searchObject = {
        '$or': [
          trainSearchObj,
          {
            '$and': [
              srcSearchObj,
              destSearchObj
            ]
          }
        ],
        'status': true
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
