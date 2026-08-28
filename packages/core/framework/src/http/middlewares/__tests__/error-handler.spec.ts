import createHttpError from "http-errors"

import { MedusaError } from "@medusajs/utils"
import { errorHandler, getHttpResponseFromError } from "../error-handler"

describe("getHttpResponseFromError", () => {
  test.each([
    [MedusaError.Types.INVALID_DATA, 400],
    [MedusaError.Types.NOT_ALLOWED, 400],
    [MedusaError.Types.UNAUTHORIZED, 401],
    [MedusaError.Types.FORBIDDEN, 403],
    [MedusaError.Types.NOT_FOUND, 404],
    [MedusaError.Types.CONFLICT, 409],
    [MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR, 422],
    [MedusaError.Types.DUPLICATE_ERROR, 422],
    [MedusaError.Types.DB_ERROR, 500],
    [MedusaError.Types.UNEXPECTED_STATE, 500],
    [MedusaError.Types.INVALID_ARGUMENT, 500],
  ])("should map %s to %i", (type, statusCode) => {
    expect(getHttpResponseFromError(new MedusaError(type, "Failed"))).toEqual(
      expect.objectContaining({ statusCode })
    )
  })

  it("should map an unknown error to 500", () => {
    expect(getHttpResponseFromError(new Error("Something went wrong"))).toEqual(
      {
        statusCode: 500,
        body: {
          code: "unknown_error",
          message: "An unknown error occurred.",
          type: "unknown_error",
        },
      }
    )
  })

  it("should use the status code of an http error", () => {
    expect(
      getHttpResponseFromError(createHttpError(413, "Payload too large"))
    ).toEqual({
      statusCode: 413,
      body: { message: "Payload too large", type: "unknown_error" },
    })
  })

  it("should keep the transaction errors mapped to a conflict", () => {
    const err = new Error("Transaction already started")
    err.name = "TransactionAlreadyStartedError"

    expect(getHttpResponseFromError(err)).toEqual({
      statusCode: 409,
      body: {
        code: "invalid_state_error",
        type: undefined,
        message:
          "The request conflicted with another request. You may retry the request with the provided Idempotency-Key.",
      },
    })
  })
})

describe("errorHandler", () => {
  const createRequest = () => ({
    path: "/store/carts/cart_1/promotions",
    scope: { resolve: () => ({ error: jest.fn(), info: jest.fn() }) },
  })

  const createResponse = () => {
    const res: any = {
      statusCode: undefined,
      body: undefined,
      status: (statusCode: number) => {
        res.statusCode = statusCode
        return res
      },
      json: (body: any) => {
        res.body = body
        return res
      },
    }
    return res
  }

  it("should respond with the mapped status code and body", () => {
    const res = createResponse()

    errorHandler()(
      new MedusaError(MedusaError.Types.INVALID_DATA, "Promotion not found"),
      createRequest() as any,
      res,
      jest.fn()
    )

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({
      code: undefined,
      type: MedusaError.Types.INVALID_DATA,
      message: "Promotion not found",
    })
  })

  it("should respond with the zod issues when present", () => {
    const res = createResponse()
    const err: any = new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid request"
    )
    err.issues = [{ code: "invalid_type", path: ["code"], message: "Required" }]

    errorHandler()(err, createRequest() as any, res, jest.fn())

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({
      type: MedusaError.Types.INVALID_DATA,
      message: expect.stringContaining("Required"),
    })
  })

  it("should hide the details of an unknown error", () => {
    const res = createResponse()

    errorHandler()(
      new Error("Connection string is invalid") as any,
      createRequest() as any,
      res,
      jest.fn()
    )

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      code: "unknown_error",
      type: "unknown_error",
      message: "An unknown error occurred.",
    })
  })

  it("should respond with the status code of an http error", () => {
    const res = createResponse()

    errorHandler()(
      createHttpError(400, "Unexpected token in JSON") as any,
      createRequest() as any,
      res,
      jest.fn()
    )

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({
      message: "Unexpected token in JSON",
      type: MedusaError.Types.INVALID_DATA,
    })
  })
})
