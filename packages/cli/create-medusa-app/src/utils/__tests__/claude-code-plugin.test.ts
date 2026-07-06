import { promptClaudeCodePlugin } from "../claude-code-plugin"
import { spawnSync } from "child_process"
import fs from "fs"
import inquirer from "inquirer"
import logMessage from "../log-message"

jest.mock("child_process")
jest.mock("fs")
jest.mock("inquirer", () => ({ prompt: jest.fn() }))
jest.mock("../log-message")
jest.mock("os", () => ({
  homedir: jest.fn().mockReturnValue("/mock/home"),
}))
jest.mock("@medusajs/telemetry", () => ({
  Store: jest.fn(),
  track: jest.fn(),
}))

const mockSpawnSync = spawnSync as jest.MockedFunction<typeof spawnSync>
const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>
const mockReadFileSync = fs.readFileSync as jest.Mock
const mockInquirerPrompt = (inquirer as any).prompt as jest.Mock
const mockLogMessage = logMessage as jest.MockedFunction<typeof logMessage>

const CLAUDE_DIR = "/mock/home/.claude"
const PLUGIN_ID = "medusa-dev@medusa"
const CONFIG_KEY = "claude-code-plugin.prompted"

describe("promptClaudeCodePlugin", () => {
  let originalEnv: NodeJS.ProcessEnv
  let mockGetConfig: jest.Mock
  let mockSetConfig: jest.Mock
  let MockStore: jest.Mock
  let mockTrack: jest.Mock

  beforeEach(() => {
    originalEnv = { ...process.env }
    jest.clearAllMocks()
    jest.spyOn(console, "log").mockImplementation()

    // Default: interactive, not CI, no CLAUDE_CODE env
    delete process.env.CI
    delete process.env.CLAUDE_CODE
    Object.defineProperty(process.stdout, "isTTY", {
      value: true,
      writable: true,
      configurable: true,
    })

    // Set up Store mock
    mockGetConfig = jest.fn().mockReturnValue(false)
    mockSetConfig = jest.fn()
    const telemetry = jest.requireMock("@medusajs/telemetry")
    MockStore = telemetry.Store
    mockTrack = telemetry.track
    MockStore.mockImplementation(() => ({
      getConfig: mockGetConfig,
      setConfig: mockSetConfig,
      config_: { path: "/mock/config/path" },
    }))

    // Default: ~/.claude exists (Claude Code present), plugin not installed
    mockExistsSync.mockImplementation((filePath: unknown) => {
      return filePath === CLAUDE_DIR
    })
    mockReadFileSync.mockReturnValue(
      JSON.stringify({ version: 2, plugins: {} })
    )

    // Default: user says yes
    mockInquirerPrompt.mockResolvedValue({ install: true })

    // Default: both install commands succeed
    mockSpawnSync.mockReturnValue({ error: undefined } as any)
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  describe("non-interactive environments", () => {
    it("skips when CI=true", async () => {
      process.env.CI = "true"

      await promptClaudeCodePlugin()

      expect(mockInquirerPrompt).not.toHaveBeenCalled()
    })

    it("skips when stdout is not a TTY", async () => {
      Object.defineProperty(process.stdout, "isTTY", {
        value: false,
        writable: true,
        configurable: true,
      })

      await promptClaudeCodePlugin()

      expect(mockInquirerPrompt).not.toHaveBeenCalled()
    })
  })

  describe("Claude Code detection", () => {
    it("skips when ~/.claude does not exist and CLAUDE_CODE env is not set", async () => {
      mockExistsSync.mockReturnValue(false)

      await promptClaudeCodePlugin()

      expect(mockInquirerPrompt).not.toHaveBeenCalled()
    })

    it("proceeds when ~/.claude exists", async () => {
      await promptClaudeCodePlugin()

      expect(mockInquirerPrompt).toHaveBeenCalled()
    })

    it("proceeds when CLAUDE_CODE env var is set even without ~/.claude dir", async () => {
      mockExistsSync.mockReturnValue(false)
      process.env.CLAUDE_CODE = "1"

      await promptClaudeCodePlugin()

      expect(mockInquirerPrompt).toHaveBeenCalled()
    })
  })

  describe("plugin installation detection", () => {
    it("skips when installed_plugins.json contains the plugin", async () => {
      mockExistsSync.mockReturnValue(true)
      mockReadFileSync.mockReturnValue(
        JSON.stringify({ version: 2, plugins: { [PLUGIN_ID]: [{}] } })
      )

      await promptClaudeCodePlugin()

      expect(mockInquirerPrompt).not.toHaveBeenCalled()
    })

    it("proceeds when installed_plugins.json exists but does not contain the plugin", async () => {
      mockExistsSync.mockReturnValue(true)
      mockReadFileSync.mockReturnValue(
        JSON.stringify({ version: 2, plugins: { "other-plugin@other": [{}] } })
      )

      await promptClaudeCodePlugin()

      expect(mockInquirerPrompt).toHaveBeenCalled()
    })

    it("proceeds when installed_plugins.json does not exist", async () => {
      mockExistsSync.mockImplementation((filePath: unknown) => {
        return filePath === CLAUDE_DIR
      })

      await promptClaudeCodePlugin()

      expect(mockInquirerPrompt).toHaveBeenCalled()
    })

    it("proceeds when installed_plugins.json contains malformed JSON", async () => {
      mockExistsSync.mockReturnValue(true)
      mockReadFileSync.mockReturnValue("not valid json")

      await promptClaudeCodePlugin()

      expect(mockInquirerPrompt).toHaveBeenCalled()
    })
  })

  describe("already prompted", () => {
    it("skips when configStore already has the prompted flag set", async () => {
      mockGetConfig.mockReturnValue(true)

      await promptClaudeCodePlugin()

      expect(mockInquirerPrompt).not.toHaveBeenCalled()
    })

    it("checks the correct config key", async () => {
      await promptClaudeCodePlugin()

      expect(mockGetConfig).toHaveBeenCalledWith(CONFIG_KEY)
    })

    it("marks as prompted before showing the prompt", async () => {
      let setConfigCalledBeforePrompt = false
      mockInquirerPrompt.mockImplementation(async () => {
        setConfigCalledBeforePrompt = mockSetConfig.mock.calls.length > 0
        return { install: false }
      })

      await promptClaudeCodePlugin()

      expect(setConfigCalledBeforePrompt).toBe(true)
      expect(mockSetConfig).toHaveBeenCalledWith(CONFIG_KEY, true)
    })
  })

  describe("user says yes", () => {
    beforeEach(() => {
      mockInquirerPrompt.mockResolvedValue({ install: true })
    })

    it("runs marketplace add command", async () => {
      await promptClaudeCodePlugin()

      expect(mockSpawnSync).toHaveBeenCalledWith(
        "claude",
        ["plugin", "marketplace", "add", "medusajs/medusa-agent-skills"],
        { stdio: "inherit" }
      )
    })

    it("runs plugin install command", async () => {
      await promptClaudeCodePlugin()

      expect(mockSpawnSync).toHaveBeenCalledWith(
        "claude",
        ["plugin", "install", PLUGIN_ID],
        { stdio: "inherit" }
      )
    })

    it("tracks telemetry with install=true", async () => {
      await promptClaudeCodePlugin()

      expect(mockTrack).toHaveBeenCalledWith("CMA_CLAUDE_CODE_PLUGIN_PROMPT", {
        install: true,
      })
    })

    it("does not show fallback message when both commands succeed", async () => {
      await promptClaudeCodePlugin()

      expect(mockLogMessage).not.toHaveBeenCalled()
    })

    it("shows fallback message when marketplace command fails", async () => {
      mockSpawnSync.mockReturnValue({ error: new Error("not found") } as any)

      await promptClaudeCodePlugin()

      expect(mockLogMessage).toHaveBeenCalledWith({
        message: expect.stringContaining(
          "/plugin marketplace add medusajs/medusa-agent-skills"
        ),
      })
    })

    it("shows fallback message when plugin install command fails", async () => {
      mockSpawnSync
        .mockReturnValueOnce({ error: undefined } as any)
        .mockReturnValueOnce({ error: new Error("not found") } as any)

      await promptClaudeCodePlugin()

      expect(mockLogMessage).toHaveBeenCalledWith({
        message: expect.stringContaining(
          "/plugin marketplace add medusajs/medusa-agent-skills"
        ),
      })
    })
  })

  describe("user says no", () => {
    beforeEach(() => {
      mockInquirerPrompt.mockResolvedValue({ install: false })
    })

    it("does not run any install commands", async () => {
      await promptClaudeCodePlugin()

      expect(mockSpawnSync).not.toHaveBeenCalled()
    })

    it("does not show fallback message", async () => {
      await promptClaudeCodePlugin()

      expect(mockLogMessage).not.toHaveBeenCalled()
    })

    it("tracks telemetry with install=false", async () => {
      await promptClaudeCodePlugin()

      expect(mockTrack).toHaveBeenCalledWith("CMA_CLAUDE_CODE_PLUGIN_PROMPT", {
        install: false,
      })
    })
  })
})
