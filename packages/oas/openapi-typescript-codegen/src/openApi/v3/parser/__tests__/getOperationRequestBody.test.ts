import { OpenApi } from "../../interfaces/OpenApi"
import { getOperationRequestBody } from "../getOperationRequestBody"
import { OpenApiRequestBody } from "../../interfaces/OpenApiRequestBody"

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

  it("should set spec with definition", () => {
    const body: OpenApiRequestBody = {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
            },
          },
        },
      },
    }
    const operationRequestBody = getOperationRequestBody(openApi, body)
    expect(operationRequestBody.spec).toEqual(body)
  })
})
