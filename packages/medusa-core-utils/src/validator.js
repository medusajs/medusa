import Joi from "@hapi/joi"

Joi.objectId = require("joi-objectid")(Joi)

Joi.address = () => {
  return Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address_1: Joi.string().required(),
    address_2: Joi.string().allow(""),
    city: Joi.string().required(),
    country_code: Joi.string().required(),
    province: Joi.string().allow(""),
    postal_code: Joi.string().required(),
    phone: Joi.string().required(),
    metadata: Joi.object(),
  })
}

export default Joi
