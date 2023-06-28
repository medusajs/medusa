import { createMedusaContainer } from "medusa-core-utils"
import path from "path"

import modelsLoader from "../models"

describe("models loader", () => {
  const container = createMedusaContainer()
  const rootDirectory = path.join(__dirname, 'customizations')
  const extensionPathGlob = 'models/{product,product-variant}.ts'
  let models
  let error

  beforeAll(async () => {
    try {
      models = await modelsLoader({
        container,
        isTest: true,
        coreTestPathGlob: "../models/{product,product-variant}.ts",
        rootDirectory,
        extensionPathGlob,
      })
    } catch (e) {
      error = e
    }
  })

  it("error should be falsy", () => {
    expect(error).toBeFalsy()
  })

  it("ensure that the product model is an extended model", () => {
    expect(models).toHaveLength(2)
    const productModel = models.find(model => model.name === 'Product')

    expect(new productModel().custom_attribute).toEqual("test")
  })

  it("ensure that the product variant model is a core model", () => {
    expect(models).toHaveLength(2)
    const productVariantModel = models.find(model => model.name === 'ProductVariant')

    expect(productVariantModel.isExtendedModel).not.toBeDefined()
  })
})
