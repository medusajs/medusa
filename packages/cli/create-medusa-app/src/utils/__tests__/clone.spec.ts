import runCloneRepo from "../clone-repo.js"
import path from "path"
import { rm, stat } from "fs/promises"
import ora, { Ora } from "ora"
import { tmpdir } from "os"

const projectName = "test-store"
const projectPath = path.join(tmpdir(), projectName)
const abortController = new AbortController()
const spinner: Ora = ora()

describe("clone-repo", () => {
  afterAll(async () => {
    // delete project
    await rm(projectPath, {
      force: true,
      recursive: true
    })
  })

  it("should clone the repo", async () => {
    expect.assertions(1)
    await runCloneRepo({
      projectName: projectPath,
      abortController,
      spinner
    })

    return expect((async () => {
      await stat(projectPath)
    })()).resolves.toBeUndefined()
  })
})