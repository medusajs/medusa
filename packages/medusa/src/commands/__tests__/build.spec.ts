import build from "../build"
import { runLintStep } from "../utils/lint-project"

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}

jest.mock("../../loaders", () => ({
  initializeContainer: jest.fn().mockResolvedValue({
    resolve: jest.fn(() => mockLogger),
  }),
}))

jest.mock("../utils/generate-types", () => ({
  generateTypes: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("../utils/lint-project", () => ({
  runLintStep: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("@medusajs/framework/build-tools", () => ({
  Compiler: jest.fn().mockImplementation(() => ({
    loadTSConfigFile: jest.fn().mockResolvedValue({}),
    buildAppBackend: jest.fn().mockResolvedValue(true),
    buildAppFrontend: jest.fn().mockResolvedValue(true),
  })),
}))

jest.mock("@medusajs/admin-bundler", () => ({}), { virtual: true })

describe("medusa build", () => {
  let exitSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    exitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as any)
  })

  afterEach(() => {
    exitSpy.mockRestore()
  })

  it("passes failOnError: false to runLintStep so lint errors do not block the build", async () => {
    await build({
      directory: "/fake/project",
      adminOnly: false,
      lint: true,
      fix: false,
      quiet: false,
    })

    expect(runLintStep).toHaveBeenCalledWith({
      directory: "/fake/project",
      lint: true,
      fix: false,
      quiet: false,
      logger: mockLogger,
      failOnError: false,
    })
  })
})
