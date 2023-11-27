import { asValue } from "awilix"
import { createMedusaContainer } from "medusa-core-utils"
import path from "path"

import modelsLoader from "../models"

describe.skip("models loader", () => {
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

    expect(new productModel().custom_attribute).toEqual("test")
  })

  it("ensure that the extended product model is registered in db_entities", () => {
    const entities = container.resolve("db_entities_STORE")
    const productModelResolver = entities.find(
      (entity) => entity.resolve().name === "Product"
    )
    const productModel = productModelResolver.resolve()

    expect(new productModel().custom_attribute).toEqual("test")
  })
})
