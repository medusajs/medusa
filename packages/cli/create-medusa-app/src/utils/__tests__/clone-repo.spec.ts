import { rm, stat } from "fs/promises"
import path from "path"
import ora, { Ora } from "ora"
import runCloneRepo from "../clone-repo.js"

const abortController = new AbortController()
const spinner: Ora = ora()
const defaultOptions = {
  projectName: "my-medusa-store",
  abortController,
  spinner
}
const projectPath = path.join(process.cwd(), defaultOptions.projectName)

describe("clone-repo", () => {
  afterEach(async () => {
    await rm(projectPath, {
      force: true,
      recursive: true
    })
  })

  it("should clone the repo", async () => {
    await runCloneRepo(defaultOptions)

    expect(async () => {
      await stat(projectPath)
    }).not.toThrow()
  })
})