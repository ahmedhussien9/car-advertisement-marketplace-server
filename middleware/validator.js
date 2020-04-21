const Ajv = require("ajv");
const ajv = Ajv({ allErrors: true });
const validator = require('validator');
const { ErrorHandler } = require("../helper/validationError");
const ObjectId = require('mongoose').Types.ObjectId;

class ValidateSchemaMiddleWare {
  async schemaValidationHandler(schemaName, userData) {
    const valid = await ajv.validate(schemaName, userData);
    
    if (valid) {
      return valid;
    } else {
      return valid;
    }
  }

}

module.exports = new ValidateSchemaMiddleWare();
