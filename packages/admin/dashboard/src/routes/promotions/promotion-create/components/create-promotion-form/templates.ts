const commonHiddenFields = [
  "type",
  "application_method.type",
]

const amountOfOrderHiddenFields = [
  ...commonHiddenFields,
  "application_method.allocation",
]

const amountOfProductHiddenFields = [
  ...commonHiddenFields,
  "application_method.allocation.across",
]

const percentageOfOrderHiddenFields = [
  ...commonHiddenFields,
  "application_method.allocation",
  "is_tax_inclusive",
]
const percentageOfProductHiddenFields = [
  ...commonHiddenFields,
  "application_method.allocation.across",
  "is_tax_inclusive",
]

const buyGetHiddenFields = [
  ...commonHiddenFields,
  "application_method.value",
  "application_method.allocation",
  "is_tax_inclusive",
]

const freeShippingHiddenFields = [
  ...commonHiddenFields,
  "application_method.value",
  "application_method.allocation",
  "is_tax_inclusive",
]

export const templates = [
  {
    id: "amount_off_products",
    type: "standard",
    title: "promotions.templates.amount_off_products.title",
    description: "promotions.templates.amount_off_products.description",
    hiddenFields: amountOfProductHiddenFields,
    defaults: {
      is_automatic: "false",
      type: "standard",
      application_method: {
        allocation: "each",
        target_type: "items",
        type: "fixed",
      },
    },
  },
  {
    id: "amount_off_order",
    type: "standard",
    title: "promotions.templates.amount_off_order.title",
    description: "promotions.templates.amount_off_order.description",
    hiddenFields: amountOfOrderHiddenFields,
    defaults: {
      is_automatic: "false",
      type: "standard",
      application_method: {
        allocation: "across",
        target_type: "order",
        type: "fixed",
      },
    },
  },
  {
    id: "percentage_off_product",
    type: "standard",
    title: "promotions.templates.percentage_off_product.title",
    description: "promotions.templates.percentage_off_product.description",
    hiddenFields: percentageOfProductHiddenFields,
    defaults: {
      is_automatic: "false",
      type: "standard",
      application_method: {
        allocation: "each",
        target_type: "items",
        type: "percentage",
      },
    },
  },
  {
    id: "percentage_off_order",
    type: "standard",
    title: "promotions.templates.percentage_off_order.title",
    description: "promotions.templates.percentage_off_order.description",
    hiddenFields: percentageOfOrderHiddenFields,
    defaults: {
      is_automatic: "false",
      type: "standard",
      application_method: {
        allocation: "across",
        target_type: "order",
        type: "percentage",
      },
    },
  },
  {
    id: "buy_get",
    type: "buy_get",
    title: "promotions.templates.buy_get.title",
    description: "promotions.templates.buy_get.description",
    hiddenFields: buyGetHiddenFields,
    defaults: {
      is_automatic: "false",
      type: "buyget",
      application_method: {
        type: "percentage",
        value: 100,
        apply_to_quantity: 1,
        max_quantity: 1,
      },
    },
  },
  {
    id: "shipping_discount",
    type: "standard",
    title: "promotions.templates.shipping_discount.title",
    description: "promotions.templates.shipping_discount.description",
    hiddenFields: freeShippingHiddenFields,
    defaults: {
      is_automatic: "false",
      type: "standard",
      application_method: {
        allocation: "across",
        target_type: "shipping_methods",
        type: "percentage",
        value: 100,
      },
    },
  },
]
