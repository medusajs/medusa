import { MedusaApp } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys, ModulesSdkUtils } from "@medusajs/utils"
import { DB_URL } from "../../../integration-tests/utils"
import { buildSchemaObjectRepresentation } from "../../utils/build-config"
import { joinerConfig } from "../__fixtures__/joiner-config"
import modulesConfig from "../__fixtures__/modules-config"

function removePropRecursively(obj, propToRemove) {
  for (const prop in obj) {
    if (prop === propToRemove) {
      delete obj[prop]
    } else if (typeof obj[prop] === "object") {
      removePropRecursively(obj[prop], propToRemove)
    }
  }
}

const config = {
  schema: `
      type Product @Listeners(values: ["product.created", "product.updated"]) {
        id: String
        title: String
        variants: [ProductVariant]
      }
      
      type ProductVariant @Listeners(values: ["variants.created", "variants.updated"]) {
        id: String
        product_id: String
        sku: String
        money_amounts: [MoneyAmount]
      }
      
      type MoneyAmount @Listeners(values: ["prices.created", "prices.updated"]) {
        amount: Int
      }
  `,
}

describe("buildSchemaObjectRepresentation", function () {
  beforeAll(async function () {
    const pgConnection = ModulesSdkUtils.createPgConnection({
      clientUrl: DB_URL,
      schema: "public",
    })

    const injectedDependencies = {
      [ContainerRegistrationKeys.PG_CONNECTION]: pgConnection,
    }

    await MedusaApp({
      modulesConfig,
      servicesConfig: joinerConfig,
      injectedDependencies,
    })
  })

  it("should build the full tree config from a graphql schema", function () {
    const [fullRepresentation] = buildSchemaObjectRepresentation(config.schema)

    const expectedProduct = {
      entity: "Product",
      parents: [],
      alias: "product",
      listeners: ["product.created", "product.updated"],
      fields: ["id", "title"],
      moduleConfig: expect.any(Object),
    }

    const expectedProductVariant = {
      entity: "ProductVariant",
      parents: [
        {
          ref: expectedProduct,
          targetProp: "variants",
          isList: true,
        },
      ],
      alias: "variant",
      listeners: ["variants.created", "variants.updated"],
      fields: ["id", "product_id", "sku", "product.id", "product.title"],
      moduleConfig: expect.any(Object),
    }

    const expectedProductPricingLink = {
      entity: "LinkProductVariantPriceSet",
      parents: [
        {
          ref: expectedProductVariant,
          targetProp: "product_variant_price_set",
        },
      ],
      alias: "product_variant_price_set",
      listeners: [
        "LinkProductVariantPriceSet.attached",
        "LinkProductVariantPriceSet.detached",
      ],
      fields: [
        "variant_id",
        "price_set_id",
        "variant.id",
        "variant.product_id",
        "variant.sku",
      ],
      moduleConfig: expect.any(Object),
    }

    const expectedPriceSet = {
      entity: "PriceSet",
      parents: [
        {
          ref: expectedProductPricingLink,
          targetProp: "price_set",
          isList: true,
        },
      ],
      alias: "price_set",
      listeners: ["PriceSet.created", "PriceSet.updated"],
      fields: [
        "id",
        "product_variant_price_set.id",
        "product_variant_price_set.variant_id",
        "product_variant_price_set.price_set_id",
      ],
      moduleConfig: expect.any(Object),
    }

    const expectedMoneyAmount = {
      entity: "MoneyAmount",
      parents: [
        {
          ref: expectedPriceSet,
          inSchemaRef: expectedProductVariant,
          targetProp: "money_amounts",
          isList: true,
        },
      ],
      alias: "money_amount",
      listeners: ["prices.created", "prices.updated"],
      fields: ["amount", "price_set.id"],
      moduleConfig: expect.any(Object),
    }

    expect(fullRepresentation).toEqual({
      Product: expectedProduct,
      ProductVariant: expectedProductVariant,
      MoneyAmount: expectedMoneyAmount,
      LinkProductVariantPriceSet: expectedProductPricingLink,
      PriceSet: expectedPriceSet,

      _serviceNameModuleConfigMap: {
        productService: expect.any(Object),
        pricingService: expect.any(Object),
        productVariantPricingPriceSetLink: expect.any(Object),
      },

      _schemaPropertiesMap: {
        product: {
          ref: expectedProduct,
        },
        "product.variants": {
          ref: expectedProductVariant,
        },
        variant: {
          ref: expectedProductVariant,
        },
        "product.variants.product_variant_price_set.price_set.money_amounts": {
          ref: expectedMoneyAmount,
        },
        "variant.product_variant_price_set.price_set.money_amounts": {
          ref: expectedMoneyAmount,
        },
        "product_variant_price_set.price_set.money_amounts": {
          ref: expectedMoneyAmount,
        },
        "price_set.money_amounts": {
          ref: expectedMoneyAmount,
        },
        "product.variants.money_amounts": {
          shortCutOf:
            "product.variants.product_variant_price_set.price_set.money_amounts",
          ref: expectedMoneyAmount,
        },
        "variant.money_amounts": {
          ref: expectedMoneyAmount,
        },
        money_amount: {
          ref: expectedMoneyAmount,
        },
        "product.variants.product_variant_price_set": {
          ref: expectedProductPricingLink,
        },
        "variant.product_variant_price_set": {
          ref: expectedProductPricingLink,
        },
        product_variant_price_set: {
          ref: expectedProductPricingLink,
        },
        "product.variants.product_variant_price_set.price_set": {
          ref: expectedPriceSet,
        },
        "variant.product_variant_price_set.price_set": {
          ref: expectedPriceSet,
        },
        "product_variant_price_set.price_set": {
          ref: expectedPriceSet,
        },
        price_set: {
          ref: expectedPriceSet,
        },
      },
    })
  })
})
