import { joinerConfig } from "../__fixtures__/joiner-config"
import { MedusaApp } from "@medusajs/modules-sdk"
import modulesConfig from "../__fixtures__/modules-config"
import { ContainerRegistrationKeys, ModulesSdkUtils } from "@medusajs/utils"
import { buildSchemaObjectRepresentation } from "../../utils/build-config"
import { DB_URL } from "../../../integration-tests/utils"

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
    const fullRepresentation = buildSchemaObjectRepresentation(config.schema)

    removePropRecursively(fullRepresentation, "moduleConfig")

    const expectedProduct = {
      entity: "Product",
      parents: [],
      alias: "product",
      listeners: ["product.created", "product.updated"],
      fields: ["id", "title"],
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
      fields: ["id", "product_id", "sku", "product.id"],
    }

    const expectedProductPricingLink = {
      entity: "product_variant_price_set",
      parents: [
        {
          ref: expectedProductVariant,
          targetProp: "product_variant_price_set",
        },
      ],
      alias: "product_variant_price_set",
      listeners: [
        "productVariantPriceSet.attached",
        "productVariantPriceSet.detached",
      ],
      fields: ["variant_id", "price_set_id", "variant.id"],
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
      listeners: ["priceSet.created", "priceSet.updated"],
      fields: ["id", "product_variant_price_set.id"],
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
    }

    expect(fullRepresentation).toEqual({
      Product: expectedProduct,
      ProductVariant: expectedProductVariant,
      MoneyAmount: expectedMoneyAmount,
      product_variant_price_set: expectedProductPricingLink,
      PriceSet: expectedPriceSet,

      _schemaPropertiesMap: {
        product: expectedProduct,
        "product.variants": expectedProductVariant,
        variant: expectedProductVariant,
        "product.variants.product_variant_price_set.price_set.money_amounts":
          expectedMoneyAmount,
        "variant.product_variant_price_set.price_set.money_amounts":
          expectedMoneyAmount,
        "product_variant_price_set.price_set.money_amounts":
          expectedMoneyAmount,
        "price_set.money_amounts": expectedMoneyAmount,
        money_amount: expectedMoneyAmount,
        "product.variants.product_variant_price_set":
          expectedProductPricingLink,
        "variant.product_variant_price_set": expectedProductPricingLink,
        product_variant_price_set: expectedProductPricingLink,
        "product.variants.product_variant_price_set.price_set":
          expectedPriceSet,
        "variant.product_variant_price_set.price_set": expectedPriceSet,
        "product_variant_price_set.price_set": expectedPriceSet,
        price_set: expectedPriceSet,
      },
    })
  })
})
