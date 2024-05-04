import { OpenApi } from "../../interfaces/OpenApi"
import { getOperationParameter } from "../getOperationParameter"
import { OpenApiParameter } from "../../interfaces/OpenApiParameter"

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
    const parameter: OpenApiParameter = {
      name: "id",
      in: "path",
    }
    const operationParameter = getOperationParameter(openApi, parameter)
    expect(operationParameter.spec).toEqual(parameter)
  })
})
