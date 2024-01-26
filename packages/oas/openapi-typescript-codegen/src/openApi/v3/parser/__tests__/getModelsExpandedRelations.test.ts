import { Model } from "../../../../client/interfaces/Model"
import { handleExpandedRelations } from "../getModelsExpandedRelations"
import { getModel } from "../getModel"
import { OpenApi } from "../../interfaces/OpenApi"
import { OpenApiSchema } from "../../interfaces/OpenApiSchema"
import { getType } from "../getType"

function getModelsTest(openApi: OpenApi): Model[] {
  const models: Model[] = []
  if (openApi.components) {
    for (const definitionName in openApi.components.schemas) {
      if (openApi.components.schemas.hasOwnProperty(definitionName)) {
        const definition = openApi.components.schemas[definitionName]
        const definitionType = getType(definitionName)
        const model = getModel(openApi, definition, true, definitionType.base)
        models.push(model)
      }
    }
  }
  return models
}

describe("getModelsExpandedRelations", () => {
  let openApi: OpenApi
  beforeEach(async () => {
    openApi = {
      openapi: "3.0.0",
      info: {
        title: "Test",
        version: "1.0.0",
      },
      paths: {},
      components: {
        schemas: {
          Order: {
            type: "object",
            properties: {
              region: {
                $ref: "#/components/schemas/Region",
              },
              total: {
                type: "number",
              },
            },
          },
          Region: {
            type: "object",
            properties: {
              country: {
                $ref: "#/components/schemas/Country",
              },
            },
          },
          Country: {
            type: "object",
          },
          Customer: {
            type: "object",
            properties: {
              orders: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Order",
                },
              },
            },
          },
        },
      },
    }
  })

  describe("basic use cases", () => {
    it("should find nested relation - model", () => {
      const modelName: string = "OrderRes"
      const definition: OpenApiSchema = {
        type: "object",
        "x-expanded-relations": {
          field: "order",
          relations: ["region"],
        },
        properties: {
          order: {
            $ref: "#/components/schemas/Order",
          },
        },
      }
      const model: Model = getModel(openApi, definition, true, modelName)
      const models: Model[] = [...getModelsTest(openApi), model]

      handleExpandedRelations(model, models)

      expect(model.properties[0].nestedRelations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "order",
            base: "Order",
            isArray: false,
            nestedRelations: expect.arrayContaining([
              expect.objectContaining({
                field: "region",
                base: "Region",
                isArray: false,
                nestedRelations: [],
              }),
            ]),
          }),
        ])
      )
    })

    it("should find nested relation - shallow", () => {
      const modelName: string = "OrderRes"
      const definition: OpenApiSchema = {
        type: "object",
        "x-expanded-relations": {
          field: "order",
          relations: ["total"],
        },
        properties: {
          order: {
            $ref: "#/components/schemas/Order",
          },
        },
      }
      const model: Model = getModel(openApi, definition, true, modelName)
      const models: Model[] = [...getModelsTest(openApi), model]

      handleExpandedRelations(model, models)

      expect(model.properties[0].nestedRelations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "order",
            base: "Order",
            isArray: false,
            nestedRelations: expect.arrayContaining([
              expect.objectContaining({
                field: "total",
                nestedRelations: [],
              }),
            ]),
          }),
        ])
      )
    })

    it("should find nested relation - array", () => {
      const modelName: string = "CustomerRes"
      const definition: OpenApiSchema = {
        type: "object",
        "x-expanded-relations": {
          field: "customer",
          relations: ["orders"],
        },
        properties: {
          customer: {
            $ref: "#/components/schemas/Customer",
          },
        },
      }
      const model: Model = getModel(openApi, definition, true, modelName)
      const models: Model[] = [...getModelsTest(openApi), model]

      handleExpandedRelations(model, models)

      expect(model.properties[0].nestedRelations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "customer",
            base: "Customer",
            isArray: false,
            nestedRelations: expect.arrayContaining([
              expect.objectContaining({
                field: "orders",
                base: "Order",
                isArray: true,
                nestedRelations: [],
              }),
            ]),
          }),
        ])
      )
    })
  })

  describe("misc usage", () => {
    it.each([["allOf"], ["anyOf"], ["oneOf"]])(
      "should findPropInCombination - %s",
      (combination) => {
        openApi.components!.schemas!.ExpandedOrder = {
          [combination]: [{ $ref: "#/components/schemas/Order" }],
        }
        const modelName: string = "OrderRes"
        const definition: OpenApiSchema = {
          type: "object",
          "x-expanded-relations": {
            field: "order",
            relations: ["region"],
          },
          properties: {
            order: {
              $ref: "#/components/schemas/ExpandedOrder",
            },
          },
        }
        const model: Model = getModel(openApi, definition, true, modelName)
        const models: Model[] = [...getModelsTest(openApi), model]

        handleExpandedRelations(model, models)

        expect(model.properties[0].nestedRelations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              nestedRelations: expect.arrayContaining([
                expect.objectContaining({
                  field: "region",
                }),
              ]),
            }),
          ])
        )
      }
    )

    it.each([["relations"], ["totals"], ["implicit"], ["eager"]])(
      "should find nested relation with relation type - %s",
      (relationType) => {
        const modelName: string = "OrderRes"
        const definition: OpenApiSchema = {
          type: "object",
          "x-expanded-relations": {
            field: "order",
            [relationType]: ["region"],
          },
          properties: {
            order: {
              $ref: "#/components/schemas/Order",
            },
          },
        }
        const model: Model = getModel(openApi, definition, true, modelName)
        const models: Model[] = [...getModelsTest(openApi), model]

        handleExpandedRelations(model, models)

        expect(model.properties[0].nestedRelations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              nestedRelations: expect.arrayContaining([
                expect.objectContaining({
                  field: "region",
                }),
              ]),
            }),
          ])
        )
      }
    )

    it("should set field hasDepth - true", () => {
      const modelName: string = "OrderRes"
      const definition: OpenApiSchema = {
        type: "object",
        "x-expanded-relations": {
          field: "order",
          relations: ["region.country"],
        },
        properties: {
          order: {
            $ref: "#/components/schemas/Order",
          },
        },
      }
      const model: Model = getModel(openApi, definition, true, modelName)
      const models: Model[] = [...getModelsTest(openApi), model]

      handleExpandedRelations(model, models)

      expect(model.properties[0].nestedRelations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            hasDepth: true,
            nestedRelations: expect.arrayContaining([
              expect.objectContaining({
                field: "region",
                nestedRelations: expect.arrayContaining([
                  expect.objectContaining({
                    field: "country",
                  }),
                ]),
              }),
            ]),
          }),
        ])
      )
    })

    it("should set relation hasDepth - true", () => {
      const modelName: string = "CustomerRes"
      const definition: OpenApiSchema = {
        type: "object",
        "x-expanded-relations": {
          field: "customer",
          relations: ["orders.region.country"],
        },
        properties: {
          customer: {
            $ref: "#/components/schemas/Customer",
          },
        },
      }
      const model: Model = getModel(openApi, definition, true, modelName)
      const models: Model[] = [...getModelsTest(openApi), model]

      handleExpandedRelations(model, models)

      expect(model.properties[0].nestedRelations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            hasDepth: true,
            nestedRelations: expect.arrayContaining([
              expect.objectContaining({
                field: "orders",
                hasDepth: true,
                nestedRelations: expect.arrayContaining([
                  expect.objectContaining({
                    field: "region",
                    nestedRelations: expect.arrayContaining([
                      expect.objectContaining({
                        field: "country",
                        nestedRelations: [],
                      }),
                    ]),
                  }),
                ]),
              }),
            ]),
          }),
        ])
      )
    })

    it("should add models with relation to root model imports, only once", () => {
      const modelName: string = "OrderRes"
      const definition: OpenApiSchema = {
        type: "object",
        "x-expanded-relations": {
          field: "order",
          relations: ["region", "region.country"],
        },
        properties: {
          order: {
            $ref: "#/components/schemas/Order",
          },
        },
      }
      const model: Model = getModel(openApi, definition, true, modelName)
      const models: Model[] = [...getModelsTest(openApi), model]

      handleExpandedRelations(model, models)

      expect(model.imports).toEqual(expect.arrayContaining(["Order", "Region"]))
    })
  })

  describe("errors", () => {
    it("should throw if field is not found", () => {
      const modelName: string = "OrderRes"
      const definition: OpenApiSchema = {
        type: "object",
        "x-expanded-relations": {
          field: "nope",
        },
        properties: {
          order: {
            $ref: "#/components/schemas/Order",
          },
        },
      }
      const model: Model = getModel(openApi, definition, true, modelName)
      const models: Model[] = [...getModelsTest(openApi), model]

      expect(() => handleExpandedRelations(model, models)).toThrow(
        "x-expanded-relations - field not found"
      )
    })

    it("should throw if relation is not found", () => {
      const modelName: string = "OrderRes"
      const definition: OpenApiSchema = {
        type: "object",
        "x-expanded-relations": {
          field: "order",
          relations: ["nope"],
        },
        properties: {
          order: {
            $ref: "#/components/schemas/Order",
          },
        },
      }
      const model: Model = getModel(openApi, definition, true, modelName)
      const models: Model[] = [...getModelsTest(openApi), model]

      expect(() => handleExpandedRelations(model, models)).toThrow(
        "x-expanded-relations - relation not found"
      )
    })

    it.each([["allOf"], ["anyOf"], ["oneOf"]])(
      "should throw if field exports as a combination - %s",
      (combination) => {
        const modelName: string = "OrderRes"
        const definition: OpenApiSchema = {
          type: "object",
          "x-expanded-relations": {
            field: "order",
            relations: ["region"],
          },
          properties: {
            order: {
              [combination]: [{ $ref: "#/components/schemas/Order" }],
            },
          },
        }
        const model: Model = getModel(openApi, definition, true, modelName)
        const models: Model[] = [...getModelsTest(openApi), model]

        expect(() => handleExpandedRelations(model, models)).toThrow(
          "x-expanded-relations - unsupported - field referencing multiple models"
        )
      }
    )
  })
})
