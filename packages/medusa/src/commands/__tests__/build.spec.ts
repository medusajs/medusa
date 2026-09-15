import { Compiler } from "@medusajs/framework/build-tools"
import { initializeContainer } from "../../loaders"
import build from "../build"
import { generateTypes } from "../utils/generate-types"
import { runLintStep } from "../utils/lint-project"

jest.mock("@medusajs/framework/build-tools", () => ({
  Compiler: jest.fn(),
}))

jest.mock("@medusajs/framework/utils", () => ({
  ContainerRegistrationKeys: {
    LOGGER: "logger",
  },
}))

jest.mock("@medusajs/admin-bundler", () => ({}))

jest.mock("../../loaders", () => ({
  initializeContainer: jest.fn(),
}))

jest.mock("../utils/generate-types", () => ({
  generateTypes: jest.fn(),
}))

jest.mock("../utils/lint-project", () => ({
  runLintStep: jest.fn(),
}))

describe("build", () => {
  const logger = {
    info: jest.fn(),
    error: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(initializeContainer as jest.Mock).mockResolvedValue({
      resolve: jest.fn(() => logger),
    })
    ;(generateTypes as jest.Mock).mockResolvedValue(undefined)
    ;(runLintStep as jest.Mock).mockResolvedValue(undefined)
    ;(Compiler as jest.Mock).mockImplementation(() => ({
      loadTSConfigFile: jest.fn().mockResolvedValue({}),
      buildAppBackend: jest.fn().mockResolvedValue(true),
      buildAppFrontend: jest.fn().mockResolvedValue(true),
    }))

    jest.spyOn(process, "exit").mockImplementation((() => undefined) as never)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("keeps lint errors non-blocking during build", async () => {
    await build({
      directory: "/app",
      adminOnly: true,
      lint: true,
      fix: false,
      quiet: true,
    })

    expect(runLintStep).toHaveBeenCalledWith({
      directory: "/app",
      lint: true,
      fix: false,
      quiet: true,
      logger,
      failOnError: false,
    })
  })
})
