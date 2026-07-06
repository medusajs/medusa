import { promptClaudeCodePlugin } from "../claude-code-plugin"
import { spawnSync } from "child_process"
import fs from "fs"
import confirm from "@inquirer/confirm"
import { Store, track } from "@medusajs/telemetry"

jest.mock("child_process")
jest.mock("fs")
jest.mock("@inquirer/confirm", () => ({
  __esModule: true,
  default: jest.fn(),
}))
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
const mockConfirm = confirm as jest.MockedFunction<typeof confirm>
const MockStore = Store as jest.MockedClass<typeof Store>
const mockTrack = track as jest.MockedFunction<typeof track>

const CLAUDE_DIR = "/mock/home/.claude"
const PLUGIN_ID = "medusa-dev@medusa"
const CONFIG_KEY = "claude-code-plugin.prompted"

describe("promptClaudeCodePlugin", () => {
  let originalEnv: NodeJS.ProcessEnv
  let mockGetConfig: jest.Mock
  let mockSetConfig: jest.Mock

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

    // Set up Store mock instance
    mockGetConfig = jest.fn().mockReturnValue(false)
    mockSetConfig = jest.fn()
    MockStore.mockImplementation(
      () =>
        ({
          getConfig: mockGetConfig,
          setConfig: mockSetConfig,
        }) as any
    )

    // Default: ~/.claude exists (Claude Code present), plugin not installed
    mockExistsSync.mockImplementation((filePath: unknown) => {
      return filePath === CLAUDE_DIR
    })
    mockReadFileSync.mockReturnValue(
      JSON.stringify({ version: 2, plugins: {} })
    )

    // Default: user says yes
    mockConfirm.mockResolvedValue(true)

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

      expect(mockConfirm).not.toHaveBeenCalled()
    })

    it("skips when stdout is not a TTY", async () => {
      Object.defineProperty(process.stdout, "isTTY", {
        value: false,
        writable: true,
        configurable: true,
      })

      await promptClaudeCodePlugin()

      expect(mockConfirm).not.toHaveBeenCalled()
    })
  })

  describe("Claude Code detection", () => {
    it("skips when ~/.claude does not exist and CLAUDE_CODE env is not set", async () => {
      mockExistsSync.mockReturnValue(false)

      await promptClaudeCodePlugin()

      expect(mockConfirm).not.toHaveBeenCalled()
    })

    it("proceeds when ~/.claude exists", async () => {
      await promptClaudeCodePlugin()

      expect(mockConfirm).toHaveBeenCalled()
    })

    it("proceeds when CLAUDE_CODE env var is set even without ~/.claude dir", async () => {
      mockExistsSync.mockReturnValue(false)
      process.env.CLAUDE_CODE = "1"

      await promptClaudeCodePlugin()

      expect(mockConfirm).toHaveBeenCalled()
    })
  })

  describe("plugin installation detection", () => {
    it("skips when installed_plugins.json contains the plugin", async () => {
      mockExistsSync.mockReturnValue(true)
      mockReadFileSync.mockReturnValue(
        JSON.stringify({ version: 2, plugins: { [PLUGIN_ID]: [{}] } })
      )

      await promptClaudeCodePlugin()

      expect(mockConfirm).not.toHaveBeenCalled()
    })

    it("proceeds when installed_plugins.json exists but does not contain the plugin", async () => {
      mockExistsSync.mockReturnValue(true)
      mockReadFileSync.mockReturnValue(
        JSON.stringify({ version: 2, plugins: { "other-plugin@other": [{}] } })
      )

      await promptClaudeCodePlugin()

      expect(mockConfirm).toHaveBeenCalled()
    })

    it("proceeds when installed_plugins.json does not exist", async () => {
      mockExistsSync.mockImplementation((filePath: unknown) => {
        return filePath === CLAUDE_DIR
      })

      await promptClaudeCodePlugin()

      expect(mockConfirm).toHaveBeenCalled()
    })

    it("proceeds when installed_plugins.json contains malformed JSON", async () => {
      mockExistsSync.mockReturnValue(true)
      mockReadFileSync.mockReturnValue("not valid json")

      await promptClaudeCodePlugin()

      expect(mockConfirm).toHaveBeenCalled()
    })
  })

  describe("already prompted", () => {
    it("skips when configStore already has the prompted flag set", async () => {
      mockGetConfig.mockReturnValue(true)

      await promptClaudeCodePlugin()

      expect(mockConfirm).not.toHaveBeenCalled()
    })

    it("checks the correct config key", async () => {
      await promptClaudeCodePlugin()

      expect(mockGetConfig).toHaveBeenCalledWith(CONFIG_KEY)
    })

    it("marks as prompted before showing the prompt", async () => {
      let setConfigCalledBeforePrompt = false
      ;(mockConfirm as jest.Mock).mockImplementation(async () => {
        setConfigCalledBeforePrompt = mockSetConfig.mock.calls.length > 0
        return false
      })

      await promptClaudeCodePlugin()

      expect(setConfigCalledBeforePrompt).toBe(true)
      expect(mockSetConfig).toHaveBeenCalledWith(CONFIG_KEY, true)
    })
  })

  describe("user says yes", () => {
    beforeEach(() => {
      mockConfirm.mockResolvedValue(true)
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

      expect(mockTrack).toHaveBeenCalledWith("MEDUSA_CLAUDE_CODE_PLUGIN_PROMPT", {
        install: true,
      })
    })

    it("does not show fallback message when both commands succeed", async () => {
      await promptClaudeCodePlugin()

      expect(console.log).not.toHaveBeenCalled()
    })

    it("shows fallback message when marketplace command fails", async () => {
      mockSpawnSync.mockReturnValue({ error: new Error("not found") } as any)

      await promptClaudeCodePlugin()

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("/plugin marketplace add medusajs/medusa-agent-skills")
      )
    })

    it("shows fallback message when plugin install command fails", async () => {
      mockSpawnSync
        .mockReturnValueOnce({ error: undefined } as any)
        .mockReturnValueOnce({ error: new Error("not found") } as any)

      await promptClaudeCodePlugin()

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("/plugin marketplace add medusajs/medusa-agent-skills")
      )
    })
  })

  describe("user says no", () => {
    beforeEach(() => {
      mockConfirm.mockResolvedValue(false)
    })

    it("does not run any install commands", async () => {
      await promptClaudeCodePlugin()

      expect(mockSpawnSync).not.toHaveBeenCalled()
    })

    it("does not show fallback message", async () => {
      await promptClaudeCodePlugin()

      expect(console.log).not.toHaveBeenCalled()
    })

    it("tracks telemetry with install=false", async () => {
      await promptClaudeCodePlugin()

      expect(mockTrack).toHaveBeenCalledWith("MEDUSA_CLAUDE_CODE_PLUGIN_PROMPT", {
        install: false,
      })
    })
  })
})
