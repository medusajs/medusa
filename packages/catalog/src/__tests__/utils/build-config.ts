import { joinerConfig } from "../__fixtures__/joiner-config"
import { MedusaApp } from "@medusajs/modules-sdk"
import modulesConfig from "../__fixtures__/modules-config"
import { ContainerRegistrationKeys, ModulesSdkUtils } from "@medusajs/utils"
import { buildFullConfigurationFromSchema } from "../../utils/build-config"

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

describe("buildFullConfigurationFromSchema", function () {
  beforeAll(async function () {
    const pgConnection = ModulesSdkUtils.createPgConnection({
      clientUrl: "postgres://postgres:postgres@localhost:5432/medusa-catalog",
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
    const fullConfiguration = buildFullConfigurationFromSchema(config.schema)
    expect(fullConfiguration).toEqual({})
  })
})
