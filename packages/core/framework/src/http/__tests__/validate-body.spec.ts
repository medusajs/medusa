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
      body: {
        additional_data: {},
      },
    } as MedusaRequest

    const mockResponse = {} as MedusaResponse
    const nextFunction = jest.fn()

    mockRequest.additionalDataValidator = zod
      .object({
        brand_id: zod.number(),
      })
      .nullish()

    const validatorFactory = (
      schema?: Zod.ZodOptional<Zod.ZodNullable<Zod.ZodObject<any, any>>>
    ) => {
      return schema
        ? createLinkBody().extend({
            additional_data: schema,
          })
        : createLinkBody()
    }

    let middleware = validateAndTransformBody(validatorFactory)

    await middleware(mockRequest, mockResponse, nextFunction)
    expect(nextFunction.mock.calls[0]).toEqual([
      new MedusaError(
        "invalid_data",
        `Invalid request: Field 'additional_data, brand_id' is required`
      ),
    ])
  })

  it("should allow additional_data to be undefined", async () => {
    let mockRequest = {
      query: {},
      body: {},
    } as MedusaRequest

    const mockResponse = {} as MedusaResponse
    const nextFunction = jest.fn()

    mockRequest.additionalDataValidator = zod
      .object({
        brand_id: zod.number(),
      })
      .nullish()

    const validatorFactory = (
      schema?: Zod.ZodOptional<Zod.ZodNullable<Zod.ZodObject<any, any>>>
    ) => {
      return schema
        ? createLinkBody().extend({
            additional_data: schema,
          })
        : createLinkBody()
    }

    let middleware = validateAndTransformBody(validatorFactory)

    await middleware(mockRequest, mockResponse, nextFunction)
    expect(nextFunction.mock.calls[0]).toEqual([])
  })

  it("should allow additional_data nested properties to be undefined", async () => {
    let mockRequest = {
      query: {},
      body: {
        additional_data: {},
      },
    } as MedusaRequest

    const mockResponse = {} as MedusaResponse
    const nextFunction = jest.fn()

    mockRequest.additionalDataValidator = zod
      .object({
        brand_id: zod.number().optional(),
      })
      .nullish()

    const validatorFactory = (
      schema?: Zod.ZodOptional<Zod.ZodNullable<Zod.ZodObject<any, any>>>
    ) => {
      return schema
        ? createLinkBody().extend({
            additional_data: schema,
          })
        : createLinkBody()
    }

    let middleware = validateAndTransformBody(validatorFactory)

    await middleware(mockRequest, mockResponse, nextFunction)
    expect(nextFunction.mock.calls[0]).toEqual([])
  })
})
