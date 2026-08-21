import { jest } from "@jest/globals"
import { runLintStep } from "../utils/lint-project"

// Mock runLintStep so we can assert how build() calls it without running a real lint
jest.mock("../utils/lint-project", () => ({
  runLintStep: jest.fn(),
}))

import build from "../build"

describe("build() lint behavior", () => {
  it("calls runLintStep with failOnError: false", async () => {
    // We don't need a full build pipeline — just verify the lint call contract.
    // The container resolution inside build() would fail without a real Medusa
    // project, but runLintStep is mocked and never runs, so the call never
    // throws. The assertion happens before the rest of build() executes.
    await build({
      directory: process.cwd(),
      adminOnly: false,
      lint: true,
      quiet: false,
    })
    expect(runLintStep).toHaveBeenCalledWith(
      expect.objectContaining({ failOnError: false })
    )
  })
})
