import zod from "zod"
import { MedusaError } from "@medusajs/utils"
import { validateAndTransformBody } from "../utils/validate-body"
import { MedusaRequest, MedusaResponse } from "../types"

const createLinkBody = () => {
  return zod.object({
    add: zod.array(zod.string()).optional(),
    remove: zod.array(zod.string()).optional(),
  })
}

describe("validateAndTransformBody", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should pass additionalDataValidator to validator factory", async () => {
    let mockRequest = {
      query: {},
      body: {},
    } as MedusaRequest

    const mockResponse = {} as MedusaResponse
    const nextFunction = jest.fn()

    mockRequest.additionalDataValidator = zod.object({
      brand_id: zod.number(),
    })

    const validatorFactory = (schema?: Zod.ZodObject<any, any>) => {
      return schema ? createLinkBody().merge(schema) : createLinkBody()
    }

    let middleware = validateAndTransformBody(validatorFactory)

    await middleware(mockRequest, mockResponse, nextFunction)
    expect(nextFunction).toHaveBeenCalledWith(
      new MedusaError(
        "invalid_data",
        `Invalid request: Field 'brand_id' is required`
      )
    )
  })
})
