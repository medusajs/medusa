import {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"

import IndexEngineFeatureFlag from "../../../../feature-flags/index-engine"
import { isIndexEnabledMiddleware } from "../middlewares"

const buildRequest = (indexService: unknown) =>
  ({
    scope: {
      resolve: (registration: unknown) => {
        if (registration === Modules.INDEX) {
          return indexService
        }
        if (registration === ContainerRegistrationKeys.LOGGER) {
          return { warn: jest.fn() }
        }
        return undefined
      },
    },
  } as unknown as AuthenticatedMedusaRequest)

const buildResponse = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  }
  res.status.mockReturnValue(res)
  res.json.mockReturnValue(res)
  return res as unknown as MedusaResponse
}

describe("isIndexEnabledMiddleware", () => {
  afterEach(() => {
    FeatureFlag.setFlag(IndexEngineFeatureFlag.key, false)
  })

  it("ends the response with a 404 when the index module is not configured", () => {
    FeatureFlag.setFlag(IndexEngineFeatureFlag.key, false)
    const req = buildRequest(undefined)
    const res = buildResponse()
    const next = jest.fn() as MedusaNextFunction

    isIndexEnabledMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    // The response has to be ended, otherwise the request hangs open until the
    // client gives up instead of receiving the 404.
    expect(res.json).toHaveBeenCalledWith({
      type: "not_found",
      message: "Route not found",
    })
    expect(next).not.toHaveBeenCalled()
  })

  it("ends the response with a 404 when the index service is missing", () => {
    FeatureFlag.setFlag(IndexEngineFeatureFlag.key, true)
    const req = buildRequest(undefined)
    const res = buildResponse()
    const next = jest.fn() as MedusaNextFunction

    isIndexEnabledMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(next).not.toHaveBeenCalled()
  })

  it("passes through when the index module is configured", () => {
    FeatureFlag.setFlag(IndexEngineFeatureFlag.key, true)
    const req = buildRequest({ searchService: jest.fn() })
    const res = buildResponse()
    const next = jest.fn() as MedusaNextFunction

    isIndexEnabledMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})
