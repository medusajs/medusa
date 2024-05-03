import { getModels } from "../getModels"
import { OpenApi } from "../../interfaces/OpenApi"

describe("getModels", () => {
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

  it("should return an empty array if no models are found", () => {
    const models = getModels(openApi)
    expect(models).toEqual([])
  })

  it("should return an array of models", () => {
    openApi.components = {
      schemas: {
        OrderRes: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
          },
        },
      },
    }
    const models = getModels(openApi)
    expect(models).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "OrderRes",
          properties: expect.arrayContaining([
            expect.objectContaining({
              name: "id",
              type: "string",
            }),
          ]),
        }),
      ])
    )
  })

  it("should return an array of models with expanded relations", () => {
    openApi.components = {
      schemas: {
        OrderRes: {
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
        },
        Order: {
          type: "object",
          properties: {
            region: {
              $ref: "#/components/schemas/Region",
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
      },
    }
    const models = getModels(openApi)
    expect(models).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "OrderRes",
          properties: expect.arrayContaining([
            expect.objectContaining({
              name: "order",
              base: "Order",
              nestedRelations: expect.arrayContaining([
                expect.objectContaining({
                  base: "Order",
                  field: "order",
                  nestedRelations: expect.arrayContaining([
                    expect.objectContaining({
                      field: "region",
                      base: "Region",
                      nestedRelations: expect.arrayContaining([
                        expect.objectContaining({
                          base: "Country",
                          field: "country",
                          nestedRelations: [],
                        }),
                      ]),
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

  it("should convert query parameters into a schema when x-codegen.queryParams is declared", () => {
    openApi.paths = {
      "/": {
        get: {
          operationId: "GetOrder",
          "x-codegen": {
            queryParams: "GetOrderQueryParams",
          },
          parameters: [
            {
              description: "Limit the number of results",
              in: "query",
              name: "limit",
              schema: {
                type: "integer",
              },
              required: true,
              deprecated: true,
            },
          ],
          responses: {
            "200": {
              description: "OK",
            },
          },
        },
      },
    }
    const models = getModels(openApi)
    expect(models).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "GetOrderQueryParams",
          properties: expect.arrayContaining([
            expect.objectContaining({
              description: "Limit the number of results",
              name: "limit",
              type: "number",
              isRequired: true,
              deprecated: true,
            }),
          ]),
        }),
      ])
    )
  })
})
