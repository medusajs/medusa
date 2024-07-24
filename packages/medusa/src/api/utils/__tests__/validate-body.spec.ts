import zod from "zod"
import { MedusaError } from "@medusajs/utils"
import { createLinkBody } from "../validators"
import { validateAndTransformBody } from "../validate-body"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

describe("validateAndTransformBody", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should merge a custom validators schema", async () => {
    let mockRequest = {
      query: {},
      body: {},
    } as MedusaRequest

    const mockResponse = {} as MedusaResponse
    const nextFunction = jest.fn()

    mockRequest.extendedValidators = {
      body: zod.object({
        brand_id: zod.number(),
      }),
    }

    let middleware = validateAndTransformBody(createLinkBody())
    await middleware(mockRequest, mockResponse, nextFunction)
    expect(nextFunction).toHaveBeenCalledWith(
      new MedusaError(
        "invalid_data",
        `Invalid request: Field 'brand_id' is required`
      )
    )
  })

  it("should pass schema to merge to the original validator factory", async () => {
    let mockRequest = {
      query: {},
      body: {},
    } as MedusaRequest

    const mockResponse = {} as MedusaResponse
    const nextFunction = jest.fn()

    mockRequest.extendedValidators = {
      body: zod.object({
        brand_id: zod.number(),
      }),
    }

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
