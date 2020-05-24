// base joi 
const BaseJoi = require('joi');
// joi date extension 
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
// handling the joi response 
const Response = require('../../responses/response');
// stop object 
const passengerObject = Joi.object({
  firstName: Joi.string().trim().required('First Name'),
  lastName: Joi.string().required().label('Last Name').max(150),
  gender: Joi.string().valid('male', 'female').label('Gender'),
});

const passengerArraySchema = Joi.array().items(passengerObject).min(1).max(6).unique('firstName').required();

// add joi schema 
const schemas = {
  // create
  create: Joi.object().keys({
    trainId: Joi.string().trim().label('name').required().max(50),
    passenger: Joi.alternatives().try(passengerObject, passengerArraySchema).required(),
  }),

  // get booking as per train
  get: Joi.object().keys({
    trainId: Joi.string().trim().label('name').required().max(50),
  }),

  // patch 
  patch: Joi.object().keys({
    params: {
      trainId: Joi.string().trim().label('trainId').required(),
    },
    body: {
      name: Joi.string().trim().label('name').optional().allow('').max(50),
      number: Joi.string().trim().label('number').optional().allow('').min(5).max(5),
    }
  }),

  // patch status
  patchStatus: Joi.object().keys({
    params: {
      trainId: Joi.string().trim().label('trainId').required(),
      type: Joi.string().trim().lowercase().valid('activate', 'de-activate').required()
    }
  }),

  // get the data 
  get: Joi.object().keys({
    query: {
      srcStop: Joi.string().trim().label('Source Stop').allow('').optional(),
      destStop: Joi.string().trim().label('Destination Stop').allow('').optional(),
      train: Joi.string().trim().label('train').allow('').optional(),
      limit: Joi.number().integer().default(20).min(0).max(200).label('limit').required(),
      skip: Joi.number().integer().min(0).max(200).label('skip').required(),
    }
  }),
};

const options = {
  // generic option
  basic: {
    abortEarly: false,
    convert: true,
    allowUnknown: false,
    stripUnknown: true
  },
  // Options for Array of array
  array: {
    abortEarly: false,
    convert: true,
    allowUnknown: true,
    stripUnknown: {
      objects: true
    }
  }
};

module.exports = {
  // exports validate admin signin 
  create: (req, res, next) => {
    // getting the schemas 
    let schema = schemas.create;
    let option = options.array;
    // validating the schema 
    schema.validate(req.body, option).then(() => {
      next();
      // if error occured
    }).catch((err) => {
      let error = [];
      err.details.forEach(element => {
        error.push(element.message);
      });

      // returning the response 
      Response.joierrors(req, res, err);
    });
  },

  // patch
  patch: (req, res, next) => {
    // getting the schemas 
    let schema = schemas.patch;
    let option = options.basic;

    // validating the schema 
    schema.validate({
      body: req.body,
      params: req.params
    }, option).then(() => {
      next();
      // if error occured
    }).catch((err) => {
      let error = [];
      err.details.forEach(element => {
        error.push(element.message);
      });

      // returning the response 
      Response.joierrors(req, res, err);
    });
  },

  // get
  get: (req, res, next) => {
    // getting the schemas 
    let schema = schemas.get;
    let option = options.basic;

    // validating the schema 
    schema.validate({
      query: req.query
    }, option).then(() => {
      next();
      // if error occured
    }).catch((err) => {
      let error = [];
      err.details.forEach(element => {
        error.push(element.message);
      });

      // returning the response 
      Response.joierrors(req, res, err);
    });
  },

  // patch status
  patchStatus: (req, res, next) => {
    // getting the schemas 
    let schema = schemas.patchStatus;
    let option = options.basic;
    console.log('The status her eis --> ', req.params);
    // validating the schema 
    schema.validate({
      params: req.params
    }, option).then(() => {
      next();
      // if error occured
    }).catch((err) => {
      let error = [];
      err.details.forEach(element => {
        error.push(element.message);
      });

      // returning the response 
      Response.joierrors(req, res, err);
    });
  },
}
