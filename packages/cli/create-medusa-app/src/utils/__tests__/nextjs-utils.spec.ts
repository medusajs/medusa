import { rm, stat } from "fs/promises"
import path from "path"
import ora, { Ora } from "ora"
import ProcessManager from "../process-manager.js"
import { installNextjsStarter } from "../nextjs-utils.js"

const abortController = new AbortController()
const spinner: Ora = ora()
const processManager = new ProcessManager()
const interval = setInterval(() => {})

const defaultOptions = {
  directoryName: "my-medusa-store",
  abortController,
  factBoxOptions: {
    interval,
    spinner,
    processManager
  },
  processManager
}
const projectName = `${defaultOptions.directoryName}-storefront`
const projectPath = path.join(
  process.cwd(), 
  projectName
)

describe("nextjs-utils", () => {
  afterEach(async () => {
    await rm(projectPath, {
      force: true,
      recursive: true
    })
  })

  afterAll(() => {
    spinner.stop()
    clearInterval(interval)
  })

  it("should install next.js storefront", async () => {
    const nextjsDirectory = await installNextjsStarter(
      defaultOptions
    )

    expect(nextjsDirectory).toEqual(projectName)

    expect(async () => {
      await stat(projectPath)
    }).not.toThrow()
    
    expect(async () => {
      await stat(
        path.join(projectPath, "node_modules")
      )
    }).not.toThrow()
  })
})