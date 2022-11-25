import { default as Joi } from "joi"

const dateFilter = () => {
  return Joi.object({
    lt: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
    gt: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
    gte: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
    lte: Joi.alternatives(Joi.date().timestamp("unix"), Joi.date()),
  })
}

Object.assign(Joi, {
  objectId: require("joi-objectid")(Joi),
  address: () => {
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
  },
  dateFilter,
  orderFilter: () => {
    return Joi.object().keys({
      id: Joi.string(),
      q: Joi.string(),
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
      canceled_at: dateFilter(),
      created_at: dateFilter(),
      updated_at: dateFilter(),
    })
  },
  productFilter: () => {
    return Joi.object().keys({
      id: Joi.string(),
      q: Joi.string().allow(null, ""),
      status: Joi.array()
        .items(Joi.string().valid("proposed", "draft", "published", "rejected"))
        .single(),
      collection_id: Joi.array().items(Joi.string()).single(),
      tags: Joi.array().items(Joi.string()).single(),
      title: Joi.string(),
      description: Joi.string(),
      handle: Joi.string(),
      is_giftcard: Joi.string(),
      type: Joi.string(),
      offset: Joi.string(),
      limit: Joi.string(),
      expand: Joi.string(),
      fields: Joi.string(),
      order: Joi.string().optional(),
      created_at: dateFilter(),
      updated_at: dateFilter(),
      deleted_at: dateFilter(),
    })
  },
})

declare module "joi" {
  interface Root {
    objectId: Joi.StringSchema
    address: <T>() => Joi.AlternativesSchema
    dateFilter: <T>() => Joi.ObjectSchema<T>
    orderFilter: <T>() => Joi.ObjectSchema<T>
    productFilter: <T>() => Joi.ObjectSchema<T>
  }
}

export default Joi
