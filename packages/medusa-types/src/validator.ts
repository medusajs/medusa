import * as Joi from "joi"

interface ExtendedJoi extends Joi.Root {
  address(): Joi.AlternativesSchema
  dateFilter(): Joi.ObjectSchema
  orderFilter(): Joi.ObjectSchema
  productFilter(): Joi.ObjectSchema
}

let extendedJoi: ExtendedJoi = Joi.extend((joi: Joi.Root) => ({
  base: joi.alternatives().try(
    joi.string(),
    joi.object().keys({
      first_name: joi.string().required(),
      last_name: joi.string().required(),
      address_1: joi.string().required(),
      address_2: joi.string().allow(null, "").optional(),
      city: joi.string().required(),
      country_code: joi.string().required(),
      province: joi.string().allow(null, "").optional(),
      postal_code: joi.string().required(),
      phone: joi.string().optional(),
      metadata: joi.object().allow(null, {}).optional(),
    })
  ),
  name: "address",
  type: "alternatives",
}))

extendedJoi = Joi.extend((joi: Joi.Root) => ({
  base: joi.object({
    lt: joi.alternatives(joi.date().timestamp("unix"), joi.date()),
    gt: joi.alternatives(joi.date().timestamp("unix"), joi.date()),
    gte: joi.alternatives(joi.date().timestamp("unix"), joi.date()),
    lte: joi.alternatives(joi.date().timestamp("unix"), joi.date()),
  }),
  name: "dateFilter",
  type: "object",
}))

extendedJoi = Joi.extend((joi: Joi.Root) => ({
  base: joi.object().keys({
    id: joi.string(),
    q: joi.string(),
    status: joi
      .array()
      .items(
        joi
          .string()
          .valid(
            "pending",
            "completed",
            "archived",
            "canceled",
            "requires_action"
          )
      )
      .single(),
    fulfillment_status: joi
      .array()
      .items(
        joi
          .string()
          .valid(
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
    payment_status: joi
      .array()
      .items(
        joi
          .string()
          .valid(
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
    display_id: joi.string(),
    cart_id: joi.string(),
    offset: joi.string(),
    limit: joi.string(),
    expand: joi.string(),
    fields: joi.string(),
    customer_id: joi.string(),
    email: joi.string(),
    region_id: joi.string(),
    currency_code: joi.string(),
    tax_rate: joi.string(),
    canceled_at: extendedJoi.dateFilter(),
    created_at: extendedJoi.dateFilter(),
    updated_at: extendedJoi.dateFilter(),
  }),
  name: "orderFilter",
  type: "object",
}))

extendedJoi = Joi.extend((joi: Joi.Root) => ({
  base: joi.object().keys({
    id: joi.string(),
    q: joi.string().allow(null, ""),
    status: joi
      .array()
      .items(joi.string().valid("proposed", "draft", "published", "rejected"))
      .single(),
    collection_id: joi.array().items(joi.string()).single(),
    tags: joi.array().items(joi.string()).single(),
    title: joi.string(),
    description: joi.string(),
    handle: joi.string(),
    is_giftcard: joi.string(),
    type: joi.string(),
    offset: joi.string(),
    limit: joi.string(),
    expand: joi.string(),
    fields: joi.string(),
    order: joi.string().optional(),
    created_at: extendedJoi.dateFilter(),
    updated_at: extendedJoi.dateFilter(),
    deleted_at: extendedJoi.dateFilter(),
  }),
  name: "productFilter",
  type: "object",
}))

export default extendedJoi
