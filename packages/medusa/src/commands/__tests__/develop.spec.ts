import { EventEmitter } from "events"

const mockWatcher = new EventEmitter()
const mockFork = jest.fn()
const mockExecSync = jest.fn()

jest.mock("child_process", () => ({
  fork: (...args) => mockFork(...args),
  execSync: (...args) => mockExecSync(...args),
}))

jest.mock("chokidar", () => ({
  watch: jest.fn(() => mockWatcher),
}))

jest.mock("@medusajs/framework", () => ({
  MEDUSA_CLI_PATH: "/medusa/cli/dist/index.js",
}))

jest.mock("@medusajs/framework/utils", () => ({
  ContainerRegistrationKeys: { LOGGER: "logger" },
  FeatureFlag: { isFeatureEnabled: jest.fn(() => false) },
}))

jest.mock("@medusajs/telemetry", () => ({
  Store: jest.fn(),
}))

jest.mock("../../feature-flags/backend-hmr", () => ({
  __esModule: true,
  default: { key: "backend_hmr" },
}))

jest.mock("../../loaders", () => ({
  initializeContainer: jest.fn(async () => ({
    resolve: () => ({ info: jest.fn(), error: jest.fn() }),
  })),
}))

jest.mock("../../utils/claude-code-plugin", () => ({
  promptClaudeCodePlugin: jest.fn(),
}))

jest.mock("../utils/lint-project", () => ({
  runLintStep: jest.fn(),
}))

import develop from "../develop"

const createChildProcess = (pid: number) => {
  const child = new EventEmitter() as EventEmitter & {
    pid: number
    kill: jest.Mock
  }
  child.pid = pid
  child.kill = jest.fn()
  return child
}

const flushPromises = () => new Promise((resolve) => setImmediate(resolve))

describe("develop command", () => {
  const originalPlatform = process.platform
  const originalArgv = process.argv

  beforeEach(() => {
    jest.clearAllMocks()
    mockWatcher.removeAllListeners()
    process.argv = ["node", "medusa", "develop"]
    jest.spyOn(process, "on").mockImplementation(() => process)

    let pid = 100
    mockFork.mockImplementation(() => createChildProcess(pid++))
  })

  afterEach(() => {
    Object.defineProperty(process, "platform", { value: originalPlatform })
    process.argv = originalArgv
    jest.restoreAllMocks()
  })

  it("should start a new server on Windows when killing an already exited child fails", async () => {
    Object.defineProperty(process, "platform", { value: "win32" })
    mockExecSync.mockImplementation(() => {
      throw new Error("Command failed: taskkill /PID 100 /F /T")
    })

    await develop({
      types: false,
      directory: "/project",
      lint: false,
      fix: false,
    })
    expect(mockFork).toHaveBeenCalledTimes(1)

    mockWatcher.emit("unlink", "src/api/probe/route.ts")
    await flushPromises()

    expect(mockExecSync).toHaveBeenCalledWith("taskkill /PID 100 /F /T")
    expect(mockFork).toHaveBeenCalledTimes(2)

    mockWatcher.emit("change", "src/api/other/route.ts")
    await flushPromises()

    expect(mockExecSync).toHaveBeenLastCalledWith("taskkill /PID 101 /F /T")
    expect(mockFork).toHaveBeenCalledTimes(3)
  })

  it("should kill the running child and start a new server on file change", async () => {
    Object.defineProperty(process, "platform", { value: "linux" })

    await develop({
      types: false,
      directory: "/project",
      lint: false,
      fix: false,
    })
    const firstChild = mockFork.mock.results[0].value

    mockWatcher.emit("change", "src/api/route.ts")
    await flushPromises()

    expect(firstChild.kill).toHaveBeenCalledWith("SIGINT")
    expect(mockFork).toHaveBeenCalledTimes(2)
  })
})
