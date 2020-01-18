import Joi from "@hapi/joi"
Joi.objectId = require("joi-objectid")(Joi)

export default Joi
