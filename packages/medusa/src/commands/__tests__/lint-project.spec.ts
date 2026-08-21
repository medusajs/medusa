import { runLintStep } from "./lint-project"

describe("runLintStep failOnError forwarding", () => {
  it("forwards failOnError: false when provided", async () => {
    const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }

    await runLintStep({
      directory: process.cwd(),
      lint: false,
      logger,
      failOnError: false,
    })

    // With lint: false the step is skipped silently (debug log) and never touches failOnError
    expect(logger.debug).toHaveBeenCalled()
  })

  it("forwards failOnError: true when provided", async () => {
    const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }

    await runLintStep({
      directory: process.cwd(),
      lint: false,
      logger,
      failOnError: true,
    })

    expect(logger.debug).toHaveBeenCalled()
  })
})
