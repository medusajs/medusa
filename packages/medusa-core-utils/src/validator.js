import Joi from "joi"

Joi.objectId = require("joi-objectid")(Joi)

Joi.address = () => {
  return Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address_1: Joi.string().required(),
    address_2: Joi.string().allow(null),
    city: Joi.string().required(),
    country_code: Joi.string().required(),
    province: Joi.string().allow(null),
    postal_code: Joi.string().required(),
    phone: Joi.string().optional(),
    metadata: Joi.object().allow(null),
  })
}

Joi.dateFilter = () => {
  return Joi.object({
    lt: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
    gt: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
    gte: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
    lte: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
  })
}

Joi.orderFilter = () => {
  return Joi.object().keys({
    id: Joi.string(),
    status: Joi.array()
      .items(
        Joi.string().valid(
          "pending",
          "completed",
          "archived",
          "canceled",
          "requires_action"
        )
      )
      .single(),
    fulfillment_status: Joi.array()
      .items(
        Joi.string().valid(
          "not_fulfilled",
          "fulfilled",
          "partially_fulfilled",
          "shipped",
          "partially_shipped",
          "canceled",
          "returned",
          "partially_returned",
          "requires_action"
        )
      )
      .single(),
    payment_status: Joi.array()
      .items(
        Joi.string().valid(
          "captured",
          "awaiting",
          "not_paid",
          "refunded",
          "partially_refunded",
          "canceled",
          "requires_action"
        )
      )
      .single(),
    display_id: Joi.string(),
    cart_id: Joi.string(),
    offset: Joi.string(),
    limit: Joi.string(),
    expand: Joi.string(),
    fields: Joi.string(),
    customer_id: Joi.string(),
    email: Joi.string(),
    region_id: Joi.string(),
    currency_code: Joi.string(),
    tax_rate: Joi.string(),
    canceled_at: Joi.dateFilter(),
    created_at: Joi.dateFilter(),
    updated_at: Joi.dateFilter(),
  })
}

export default Joi
