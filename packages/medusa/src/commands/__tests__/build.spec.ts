import { runLintStep } from "../utils/lint-project"

const logger = {
  info: jest.fn(),
  error: jest.fn(),
}

const container = {
  resolve: jest.fn(() => logger),
}

jest.mock(
  "@medusajs/framework/utils",
  () => ({
    ContainerRegistrationKeys: { LOGGER: "logger" },
  }),
  { virtual: true }
)

jest.mock("../../loaders", () => ({
  initializeContainer: jest.fn(() => Promise.resolve(container)),
}))

jest.mock("../utils/generate-types", () => ({
  generateTypes: jest.fn(() => Promise.resolve()),
}))

jest.mock("../utils/lint-project", () => ({
  runLintStep: jest.fn(() => Promise.resolve()),
}))

jest.mock(
  "@medusajs/framework/build-tools",
  () => ({
    Compiler: jest.fn().mockImplementation(() => ({
      loadTSConfigFile: jest.fn(() => Promise.resolve(null)),
    })),
  }),
  { virtual: true }
)

const mockedRunLintStep = runLintStep as jest.Mock

describe("build", () => {
  let processExitSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    // loadTSConfigFile resolves null above, so build() calls process.exit right
    // after the lint step. Throw from the mock so execution actually stops
    // there instead of falling through into the (unmocked) compiler/bundler.
    processExitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation(((code?: number) => {
        throw new Error(`process.exit(${code})`)
      }) as never)
  })

  afterEach(() => {
    processExitSpy.mockRestore()
  })

  it("runs the lint step with failOnError: false, so lint errors don't block the build", async () => {
    const build = (await import("../build")).default

    await expect(
      build({
        directory: "/project",
        adminOnly: false,
        lint: true,
      })
    ).rejects.toThrow("process.exit(1)")

    expect(mockedRunLintStep).toHaveBeenCalledWith(
      expect.objectContaining({ failOnError: false })
    )
  })
})
