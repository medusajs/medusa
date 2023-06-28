import { createMedusaContainer } from "medusa-core-utils"
import path from "path"
import { asValue } from "awilix"

import modelsLoader from "../models"

describe("models loader", () => {
  const container = createMedusaContainer()
  container.register("db_entities", asValue([]))
  let models
  let error

  beforeAll(async () => {
    try {
      models = await modelsLoader({
        container,
        isTest: true,
        coreTestPathGlob: "../models/{product,product-variant}.ts",
        rootDirectory: path.join(__dirname, "__fixtures__/customizations"),
        extensionPathGlob: "models/{product,product-variant}.ts",
      })
    } catch (e) {
      error = e
    }
  })

  it("error should be falsy & register 2 models", () => {
    expect(error).toBeFalsy()
    expect(models).toHaveLength(2)
  })

  it("ensure that the product model is an extended model", () => {
    const productModel = models.find((model) => model.name === "Product")

    expect(productModel.isExtendedModel).toBe(true)
    expect(new productModel().custom_attribute).toEqual("test")
  })

  it("ensure that the product variant model is a core model", () => {
    const productVariantModel = models.find(
      (model) => model.name === "ProductVariant"
    )

    expect(productVariantModel.isExtendedModel).not.toBeDefined()
  })

  it("ensure that the extended product model is registered in db_entities", () => {
    const entities = container.resolve("db_entities_STORE")
    const productModelResolver = entities.find(
      (entity) => entity.resolve().name === "Product"
    )
    const productModel = productModelResolver.resolve()

    expect(productModel.isExtendedModel).toBe(true)
    expect(new productModel().custom_attribute).toEqual("test")
  })

  it("ensure that the core product variant model is registered in db_entities", () => {
    const entities = container.resolve("db_entities_STORE")
    const productVariantModelResolver = entities.find(
      (entity) => entity.resolve().name === "ProductVariant"
    )
    const productVariantModel = productVariantModelResolver.resolve()

    expect(productVariantModel.isExtendedModel).not.toBeDefined()
  })
})
