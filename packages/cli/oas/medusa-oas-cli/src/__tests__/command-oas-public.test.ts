import { parse } from "@readme/openapi-parser"
import { execute } from "../command-oas"

jest.mock("@readme/openapi-parser", () => ({
  parse: jest.fn(),
  validate: jest.fn().mockResolvedValue({ valid: true }),
  compileErrors: jest.fn(),
}))

jest.mock("../utils/combine-oas", () => ({
  combineOAS: jest.fn(async (adminOAS) => adminOAS),
}))

jest.mock("commander", () => {
  class Option {
    choices() {
      return this
    }
    makeOptionMandatory() {
      return this
    }
    default() {
      return this
    }
  }
  return { Command: jest.fn(), Option }
})

const parseMock = parse as jest.Mock
const medusaVersion: string = require("@medusajs/medusa/package.json").version

const getBaseOpenApi = () => ({
  openapi: "3.0.0",
  info: { title: "Test", version: "0.0.0" },
  paths: {},
  components: {},
})

describe("command oas - public OAS", () => {
  beforeEach(() => {
    parseMock.mockReset()
    jest.spyOn(console, "log").mockImplementation(() => {})
    jest.spyOn(console, "warn").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should download the public OAS of the installed Medusa version", async () => {
    parseMock.mockResolvedValue(getBaseOpenApi())

    await execute({ type: "admin", dryRun: true, outDir: process.cwd() })

    expect(parseMock).toHaveBeenCalledTimes(1)
    expect(parseMock).toHaveBeenCalledWith(
      `https://docs.medusajs.com/api/download/admin?version=${encodeURIComponent(
        medusaVersion
      )}`
    )
  })

  it("should download the versioned public OAS of each API type for combined", async () => {
    parseMock.mockImplementation(async () => getBaseOpenApi())

    await execute({ type: "combined", dryRun: true, outDir: process.cwd() })

    expect(parseMock.mock.calls.map(([url]) => url)).toEqual([
      `https://docs.medusajs.com/api/download/admin?version=${encodeURIComponent(
        medusaVersion
      )}`,
      `https://docs.medusajs.com/api/download/store?version=${encodeURIComponent(
        medusaVersion
      )}`,
    ])
  })

  it("should fall back to the latest public OAS when the installed version has none", async () => {
    parseMock.mockImplementation(async (url: string) => {
      if (url.includes("?version=")) {
        throw new Error("Error downloading file: HTTP ERROR 404")
      }
      return getBaseOpenApi()
    })

    await execute({ type: "store", dryRun: true, outDir: process.cwd() })

    expect(parseMock).toHaveBeenLastCalledWith(
      "https://docs.medusajs.com/api/download/store"
    )
    expect(console.warn).toHaveBeenCalled()
  })
})
