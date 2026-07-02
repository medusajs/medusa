import {
  ContainerRegistrationKeys,
  createMedusaContainer,
} from "@medusajs/utils"
import express from "express"
import { asValue } from "../../deps/awilix"
import { configManager } from "../../config"
import { expressLoader, resolveSessionCookieSecurity } from "../express-loader"

const logger = {
  shouldLog: jest.fn(() => false),
  http: jest.fn(),
}

describe("expressLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("registers response compression when project config enables it", async () => {
    configManager.loadConfig({
      baseDir: process.cwd(),
      throwOnValidationError: false,
      projectConfig: {
        http: {
          compression: {
            enabled: true,
          },
        },
      },
    })

    const app = express()
    const useSpy = jest.spyOn(app, "use")
    const container = createMedusaContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))

    await expressLoader({ app, container })

    expect(
      useSpy.mock.calls.some(
        ([middleware]) => middleware?.name === "compression"
      )
    ).toBe(true)
  })
})

describe("resolveSessionCookieSecurity", () => {
  it("returns insecure, no SameSite outside of production/staging", () => {
    expect(
      resolveSessionCookieSecurity({ isProduction: false, isStaging: false })
    ).toEqual({ sameSite: false, secure: false })
  })

  it("returns sameSite=lax + secure in production", () => {
    expect(
      resolveSessionCookieSecurity({ isProduction: true, isStaging: false })
    ).toEqual({ sameSite: "lax", secure: true })
  })

  it("returns sameSite=lax + secure in staging", () => {
    expect(
      resolveSessionCookieSecurity({ isProduction: false, isStaging: true })
    ).toEqual({ sameSite: "lax", secure: true })
  })

  it("never returns sameSite=none — that would allow cross-site cookies on POST and reintroduce CSRF", () => {
    const envs = [
      { isProduction: true, isStaging: false },
      { isProduction: false, isStaging: true },
      { isProduction: true, isStaging: true },
      { isProduction: false, isStaging: false },
    ]

    for (const env of envs) {
      const { sameSite } = resolveSessionCookieSecurity(env)
      expect(sameSite).not.toBe("none")
    }
  })
})
