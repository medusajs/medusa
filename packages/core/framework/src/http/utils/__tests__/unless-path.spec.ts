import { unlessPath } from "../unless-path"
import { MedusaNextFunction, MedusaRequest, MedusaResponse } from "../../types"

describe("unlessPath", () => {
  let mockReq: Partial<MedusaRequest>
  let mockRes: Partial<MedusaResponse>
  let mockNext: jest.Mock<MedusaNextFunction>
  let mockMiddleware: jest.Mock

  beforeEach(() => {
    mockReq = { path: "/admin/products" }
    mockRes = {}
    mockNext = jest.fn()
    mockMiddleware = jest.fn()
  })

  it("skips middleware and calls next() when path matches regex", () => {
    const wrapped = unlessPath(/\/admin\/.*/, mockMiddleware)

    wrapped(
      mockReq as MedusaRequest,
      mockRes as MedusaResponse,
      mockNext as unknown as MedusaNextFunction
    )

    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(mockMiddleware).not.toHaveBeenCalled()
  })

  it("executes middleware when path does not match regex", () => {
    const wrapped = unlessPath(/\/store\/.*/, mockMiddleware)

    wrapped(
      mockReq as MedusaRequest,
      mockRes as MedusaResponse,
      mockNext as unknown as MedusaNextFunction
    )

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockMiddleware).toHaveBeenCalledWith(mockReq, mockRes, mockNext)
  })

  it("consistently skips middleware on successive requests with global (/g) regex", () => {
    const regex = /\/admin\/.*/g
    const wrapped = unlessPath(regex, mockMiddleware)

    // Call multiple times on the same matching path
    for (let i = 0; i < 5; i++) {
      mockNext.mockClear()
      mockMiddleware.mockClear()

      wrapped(
        mockReq as MedusaRequest,
        mockRes as MedusaResponse,
        mockNext as unknown as MedusaNextFunction
      )

      expect(mockNext).toHaveBeenCalledTimes(1)
      expect(mockMiddleware).not.toHaveBeenCalled()
    }
  })

  it("consistently skips middleware on successive requests with sticky (/y) regex", () => {
    const regex = /^\/admin\/.*/y
    const wrapped = unlessPath(regex, mockMiddleware)

    for (let i = 0; i < 5; i++) {
      mockNext.mockClear()
      mockMiddleware.mockClear()

      wrapped(
        mockReq as MedusaRequest,
        mockRes as MedusaResponse,
        mockNext as unknown as MedusaNextFunction
      )

      expect(mockNext).toHaveBeenCalledTimes(1)
      expect(mockMiddleware).not.toHaveBeenCalled()
    }
  })
})
