import { errorHandler } from "../middlewares/error-handler"
import { MedusaRequest } from "../types"

describe("errorHandler", () => {
  it("should return 400 invalid_data for malformed JSON request bodies", () => {
    const logger = {
      info: jest.fn(),
      error: jest.fn(),
    }

    const req = {
      scope: {
        resolve: jest.fn().mockReturnValue(logger),
      },
    } as unknown as MedusaRequest

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    const next = jest.fn()
    const err = Object.assign(new SyntaxError("Unexpected token b in JSON"), {
      type: "entity.parse.failed",
    })

    errorHandler()(err, req, res as any, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      type: "invalid_data",
      message: "Invalid JSON in request body",
    })
    expect(logger.info).toHaveBeenCalledWith("Invalid JSON in request body")
    expect(logger.error).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })
})
