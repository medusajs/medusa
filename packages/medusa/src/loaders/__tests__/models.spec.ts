import { createMedusaContainer } from "medusa-core-utils"
import path from "path"

import modelsLoader from "../models"

describe("models loader", () => {
  const container = createMedusaContainer()
  let models
  let error

  beforeAll(async () => {
    try {
      models = await modelsLoader({
        container,
        isTest: true,
        coreTestPathGlob: "../models/{product,product-variant}.ts",
        rootDirectory: path.join(__dirname, 'customizations'),
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
    const productModel = models.find(model => model.name === 'Product')

    expect(productModel.isExtendedModel).not.toBeDefined()
    expect(new productModel().custom_attribute).toEqual("test")
  })

  it("ensure that the product variant model is a core model", () => {
    const productVariantModel = models.find(model => model.name === 'ProductVariant')

    expect(productVariantModel.isExtendedModel).not.toBeDefined()
  })
})
