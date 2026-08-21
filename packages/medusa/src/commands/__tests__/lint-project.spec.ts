import { jest } from "@jest/globals"
import { runLintStep } from "../utils/lint-project"

jest.mock("../utils/lint-project", () => ({
  __esModule: true,
  lintProject: jest.fn(),
  runLintStep: jest.fn(),
}))

import { lintProject } from "../utils/lint-project"

describe("runLintStep", () => {
  let mockExit
  let mockStderr

  beforeEach(() => {
    mockExit = jest.spyOn(process, "exit").mockImplementation(() => undefined as never)
    mockStderr = jest.spyOn(process.stderr, "write").mockImplementation(() => true)
    jest.clearAllMocks()
  })

  afterEach(() => {
    mockExit.mockRestore()
    mockStderr.mockRestore()
  })

  it("logs a warning and continues when lint errors are found and failOnError is false", async () => {
    ;(lintProject as jest.Mock).mockResolvedValue({
      status: "linted",
      result: { errorCount: 1, warningCount: 0, formatted: "fake lint output" },
    })

    const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }

    await runLintStep({
      directory: process.cwd(),
      lint: true,
      failOnError: false,
      logger,
    })

    expect(mockExit).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("1 error(s)"))
  })

  it("calls process.exit(1) when lint errors are found and failOnError is true", async () => {
    ;(lintProject as jest.Mock).mockResolvedValue({
      status: "linted",
      result: { errorCount: 2, warningCount: 0, formatted: "fake lint output" },
    })

    const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }

    await runLintStep({
      directory: process.cwd(),
      lint: true,
      failOnError: true,
      logger,
    })

    expect(mockExit).toHaveBeenCalledWith(1)
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("2 error(s)"))
  })
})
