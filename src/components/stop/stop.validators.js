// base joi 
const BaseJoi = require('joi');
// joi date extension 
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
// handling the joi response 
const Response = require('../../responses/response');

// add joi schema 
const schemas = {
  // create
  create: Joi.object().keys({
    name: Joi.string().trim().label('name').required().max(50),
    description: Joi.string().trim().label('description').optional().allow('').min(6).max(255),
    initial: Joi.string().trim().label('initials').required().min(3).max(3),
  }),

  // patch 
  patch: Joi.object().keys({
    params: {
      stopId: Joi.string().trim().label('stopId').required(),
    },
    body: {
      name: Joi.string().trim().label('name').optional().allow('').max(50),
      description: Joi.string().trim().label('description').optional().allow('').min(6).max(255),
      initial: Joi.string().trim().label('initials').optional().allow('').min(3).max(3),
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
    let option = options.basic;

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
}
