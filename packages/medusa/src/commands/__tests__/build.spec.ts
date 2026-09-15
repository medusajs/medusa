import build from "../build"
import { runLintStep } from "../utils/lint-project"

jest.mock("../utils/lint-project", () => ({
  runLintStep: jest.fn(),
}))

jest.mock(
  "@medusajs/framework/utils",
  () => ({
    ContainerRegistrationKeys: { LOGGER: "logger" },
  }),
  { virtual: true }
)

jest.mock("../utils/generate-types", () => ({
  generateTypes: jest.fn(),
}))

jest.mock("../../loaders", () => ({
  initializeContainer: jest.fn(),
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

jest.mock("@medusajs/admin-bundler", () => ({}), { virtual: true })

const logger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}

describe("build", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { initializeContainer } = require("../../loaders")
    initializeContainer.mockResolvedValue({
      resolve: jest.fn().mockReturnValue(logger),
    })

    jest
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as never)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should run the lint step as non-blocking", async () => {
    await build({ directory: __dirname, adminOnly: true, lint: true })

    expect(runLintStep).toHaveBeenCalledWith(
      expect.objectContaining({ failOnError: false, lint: true })
    )
  })
})
