import { initializeContainer } from "../../loaders"
import build from "../build"
import { generateTypes } from "../utils/generate-types"
import { runLintStep } from "../utils/lint-project"

jest.mock("../../loaders", () => ({
  initializeContainer: jest.fn(),
}))

jest.mock("../utils/generate-types", () => ({
  generateTypes: jest.fn(),
}))

jest.mock("../utils/lint-project", () => ({
  runLintStep: jest.fn(),
}))

jest.mock(
  "@medusajs/framework/build-tools",
  () => ({
    Compiler: jest.fn().mockImplementation(() => ({
      loadTSConfigFile: jest.fn().mockResolvedValue({}),
      buildAppBackend: jest.fn().mockResolvedValue(true),
      buildAppFrontend: jest.fn().mockResolvedValue(true),
    })),
  }),
  { virtual: true }
)

jest.mock(
  "@medusajs/framework/utils",
  () => ({
    ContainerRegistrationKeys: {
      LOGGER: "logger",
    },
  }),
  { virtual: true }
)

jest.mock("@medusajs/admin-bundler", () => ({}), { virtual: true })

describe("build", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest
      .spyOn(process, "exit")
      .mockImplementation((code?: string | number | null) => code as never)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("configures lint errors as non-blocking", async () => {
    const logger = {
      error: jest.fn(),
      info: jest.fn(),
    }

    ;(initializeContainer as jest.Mock).mockResolvedValue({
      resolve: jest.fn().mockReturnValue(logger),
    })
    ;(generateTypes as jest.Mock).mockResolvedValue(undefined)
    ;(runLintStep as jest.Mock).mockResolvedValue(undefined)

    await build({
      directory: "/app",
      adminOnly: false,
      lint: true,
    })

    expect(runLintStep).toHaveBeenCalledWith(
      expect.objectContaining({
        directory: "/app",
        lint: true,
        logger,
        failOnError: false,
      })
    )
    expect(process.exit).toHaveBeenCalledWith(0)
  })
})
