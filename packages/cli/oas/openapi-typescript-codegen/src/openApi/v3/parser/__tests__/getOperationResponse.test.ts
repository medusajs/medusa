import { OpenApi } from "../../interfaces/OpenApi"
import { getOperationResponse } from "../getOperationResponse"
import { OpenApiResponse } from "../../interfaces/OpenApiResponse"

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
    const response: OpenApiResponse = {
      description: "OK",
    }
    const operationResponse = getOperationResponse(openApi, response, 200)
    expect(operationResponse.spec).toEqual(response)
  })
})
