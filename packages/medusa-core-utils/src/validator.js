import Joi from "joi"

Joi.objectId = require("joi-objectid")(Joi)

// if address is a string, we assume that it is an id
Joi.address = () => {
  return Joi.alternatives().try(
    Joi.string(),
    Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      company: Joi.string().optional(),
      address_1: Joi.string().required(),
      address_2: Joi.string().allow(null, "").optional(),
      city: Joi.string().required(),
      country_code: Joi.string().required(),
      province: Joi.string().allow(null, "").optional(),
      postal_code: Joi.string().required(),
      phone: Joi.string().optional(),
      metadata: Joi.object().allow(null, {}).optional(),
    })
  )
}

Joi.dateFilter = () => {
  return Joi.object({
    lt: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
    gt: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
    gte: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
    lte: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
  })
}

export default Joi
