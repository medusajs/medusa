import { OpenApi } from "../../interfaces/OpenApi"
import { OpenApiOperation } from "../../interfaces/OpenApiOperation"
import { getOperation } from "../getOperation"
import { getOperationParameters } from "../getOperationParameters"

describe("getOperation", () => {
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

  it("should parse x-codegen", () => {
    const op: OpenApiOperation = {
      "x-codegen": {
        method: "list",
      },
      responses: {
        "200": {
          description: "OK",
        },
      },
    }
    const pathParams = getOperationParameters(openApi, [])
    const operation = getOperation(
      openApi,
      "/orders",
      "get",
      "Orders",
      op,
      pathParams
    )
    expect(operation).toEqual(
      expect.objectContaining({
        codegen: { method: "list" },
      })
    )
  })

  it("should add x-codegen.queryParams to imports", () => {
    const op: OpenApiOperation = {
      "x-codegen": {
        queryParams: "OrdersQueryParams",
      },
      responses: {
        "200": {
          description: "OK",
        },
      },
    }
    const pathParams = getOperationParameters(openApi, [])
    const operation = getOperation(
      openApi,
      "/orders",
      "get",
      "Orders",
      op,
      pathParams
    )
    expect(operation.imports).toEqual(
      expect.arrayContaining(["OrdersQueryParams"])
    )
  })
})
