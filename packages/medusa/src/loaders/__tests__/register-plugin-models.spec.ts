import { asValue } from "awilix"
import { createMedusaContainer } from "medusa-core-utils"
import path from "path"

import { registerPluginModels } from "../plugins"
import configModule from './__fixtures__/customizations/medusa-config'

describe.skip("plugin models loader", () => {
  const container = createMedusaContainer()
  container.register("db_entities", asValue([]))

  let models
  let error

  beforeAll(async () => {
    try {
      await registerPluginModels({
        configModule: configModule,
        container,
        rootDirectory: path.join(__dirname, '__fixtures__/customizations'),
        extensionDirectoryPath: './',
        pathGlob: "/models/*.ts",
      })
    } catch (e) {
      error = e
    }
  })

  it("ensure that the product model is registered from the user's respository", () => {
    const entities = container.resolve("db_entities_STORE")
    const productModelResolver = entities.find(entity => entity.resolve().name === 'Product')
    const productModel = productModelResolver.resolve()

    expect((new productModel()).custom_attribute).toEqual("test")
  })
})
