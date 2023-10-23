const Product = {
  entity: "Product",
  parents: [],
  alias: "product",
  listeners: ["product.created", "product.updated"],
  fields: ["id", "title"],
  moduleConfig: expect.any(Object),
}

const ProductVariant = {
  entity: "ProductVariant",
  parents: [
    {
      ref: Product,
      targetProp: "variants",
      isList: true,
    },
  ],
  alias: "variant",
  listeners: ["variants.created", "variants.updated"],
  fields: ["id", "product_id", "sku", "product.id"],
  moduleConfig: expect.any(Object),
}

const ProductOption = {
  entity: "ProductOption",
  parents: [
    {
      ref: Product,
      targetProp: "options",
      isList: true,
    },
  ],
  alias: "options",
  listeners: ["options.created", "options.updated"],
  fields: ["id"],
  moduleConfig: expect.any(Object),
}

const ProductOptionValue = {
  entity: "ProductOptionValue",
  parents: [
    {
      ref: ProductOption,
      targetProp: "value",
      isList: true,
    },
    {
      ref: ProductVariant,
      targetProp: "value",
      isList: true,
    },
  ],
  alias: "value",
  listeners: ["value.created", "value.updated"],
  fields: ["id", "value"],
  moduleConfig: expect.any(Object),
}

const SalesChannel = {
  entity: "SalesChannel",
  parents: [
    {
      ref: Product,
      targetProp: "sales_channels",
      isList: true,
    },
  ],
  alias: "sales_channels",
  listeners: ["sales_channels.created", "sales_channels.updated"],
  fields: ["id", "name"],
  moduleConfig: expect.any(Object),
}

const ProductPricingLink = {
  entity: "LinkProductVariantPriceSet",
  parents: [
    {
      ref: ProductVariant,
      targetProp: "product_variant_price_set",
    },
  ],
  alias: "product_variant_price_set",
  listeners: [
    "LinkProductVariantPriceSet.attached",
    "LinkProductVariantPriceSet.detached",
  ],
  fields: ["variant_id", "price_set_id", "variant.id"],
  moduleConfig: expect.any(Object),
}

const PriceSet = {
  entity: "PriceSet",
  parents: [
    {
      ref: ProductPricingLink,
      targetProp: "price_set",
      isList: true,
    },
  ],
  alias: "price_set",
  listeners: ["PriceSet.created", "PriceSet.updated"],
  fields: ["id", "product_variant_price_set.id"],
  moduleConfig: expect.any(Object),
}

const MoneyAmount = {
  entity: "MoneyAmount",
  parents: [
    {
      ref: PriceSet,
      inSchemaRef: ProductVariant,
      targetProp: "money_amounts",
      isList: true,
    },
  ],
  alias: "money_amount",
  listeners: ["prices.created", "prices.updated"],
  fields: ["amount", "price_set.id"],
  moduleConfig: expect.any(Object),
}

export const schemaObjectRepresentation = {
  Product: Product,
  ProductVariant: ProductVariant,
  ProductOption: ProductOption,
  ProductOptionValue: ProductOptionValue,
  MoneyAmount: MoneyAmount,
  LinkProductVariantPriceSet: ProductPricingLink,
  PriceSet: PriceSet,
  SalesChannel: SalesChannel,

  _serviceNameModuleConfigMap: {},

  _schemaPropertiesMap: {
    product: {
      ref: Product,
    },
    "product.sales_channels": {
      ref: SalesChannel,
    },
    "product.variants": {
      ref: ProductVariant,
    },
    "product.variants.options": {
      ref: ProductOption,
    },
    "product.variants.options.value": {
      ref: ProductOptionValue,
    },
    variant: {
      ref: ProductVariant,
    },
    "product.variants.product_variant_price_set.price_set.money_amounts": {
      ref: MoneyAmount,
    },
    "variant.product_variant_price_set.price_set.money_amounts": {
      ref: MoneyAmount,
    },
    "product_variant_price_set.price_set.money_amounts": {
      ref: MoneyAmount,
    },
    "price_set.money_amounts": {
      ref: MoneyAmount,
    },
    "product.variants.money_amounts": {
      shortCutOf:
        "product.variants.product_variant_price_set.price_set.money_amounts",
      ref: MoneyAmount,
    },
    "variant.money_amounts": {
      ref: MoneyAmount,
    },
    money_amount: {
      ref: MoneyAmount,
    },
    "product.variants.product_variant_price_set": {
      ref: ProductPricingLink,
    },
    "variant.product_variant_price_set": {
      ref: ProductPricingLink,
    },
    product_variant_price_set: {
      ref: ProductPricingLink,
    },
    "product.variants.product_variant_price_set.price_set": {
      ref: PriceSet,
    },
    "variant.product_variant_price_set.price_set": {
      ref: PriceSet,
    },
    "product_variant_price_set.price_set": {
      ref: PriceSet,
    },
    price_set: {
      ref: PriceSet,
    },
  },
}
