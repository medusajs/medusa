import { getModel } from "../getModel"
import { OpenApi } from "../../interfaces/OpenApi"
import { Model } from "../../../../client/interfaces/Model"
import { OpenApiSchema } from "../../interfaces/OpenApiSchema"

describe("getModel", () => {
  let openApi: OpenApi
  beforeEach(async () => {
    openApi = {
      openapi: "3.0.0",
      info: {
        title: "Test",
        version: "1.0.0",
      },
      paths: {},
      components: {},
    }
  })

  it("should set model spec with definition", () => {
    const modelName = "OrderRes"
    const definition: OpenApiSchema = {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
    }
    const model: Model = getModel(openApi, definition, true, modelName)
    expect(model.spec).toEqual(definition)
  })

  it("should set property spec with definition", () => {
    const modelName = "OrderRes"
    const definition: OpenApiSchema = {
      type: "object",
      properties: {
        order: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
          },
        },
      },
    }
    const model: Model = getModel(openApi, definition, true, modelName)
    expect(model.properties[0].spec).toEqual(definition.properties!.order)
  })
})
