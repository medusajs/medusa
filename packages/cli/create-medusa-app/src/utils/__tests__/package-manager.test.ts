import PackageManager from "../package-manager"
import ProcessManager from "../process-manager"
import execute from "../execute"
import { existsSync, rmSync } from "fs"
import logMessage from "../log-message"

// Mock dependencies
jest.mock("../execute")
jest.mock("fs")
jest.mock("../log-message")

const mockExecute = execute as jest.MockedFunction<typeof execute>
const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>
const mockRmSync = rmSync as jest.MockedFunction<typeof rmSync>
const mockLogMessage = logMessage as jest.MockedFunction<typeof logMessage>

describe("PackageManager", () => {
  let processManager: ProcessManager
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    processManager = new ProcessManager()
    originalEnv = { ...process.env }
    jest.clearAllMocks()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe("constructor", () => {
    it("should initialize with default options", () => {
      const pm = new PackageManager(processManager)
      expect(pm.getPackageManager()).toBeUndefined()
    })

    it("should set npm as chosen package manager when useNpm is true", () => {
      const pm = new PackageManager(processManager, { useNpm: true })
      expect(pm["chosenPackageManager"]).toBe("npm")
    })

    it("should set yarn as chosen package manager when useYarn is true", () => {
      const pm = new PackageManager(processManager, { useYarn: true })
      expect(pm["chosenPackageManager"]).toBe("yarn")
    })

    it("should set pnpm as chosen package manager when usePnpm is true", () => {
      const pm = new PackageManager(processManager, { usePnpm: true })
      expect(pm["chosenPackageManager"]).toBe("pnpm")
    })

    it("should respect verbose option", () => {
      const pm = new PackageManager(processManager, { verbose: true })
      expect(pm["verbose"]).toBe(true)
    })

    it("should prioritize npm over other options", () => {
      const pm = new PackageManager(processManager, {
        useNpm: true,
        useYarn: true,
        usePnpm: true,
      })
      expect(pm["chosenPackageManager"]).toBe("npm")
    })
  })

  describe("detectFromUserAgent", () => {
    it("should detect pnpm from user agent with version", () => {
      process.env.npm_config_user_agent = "pnpm/8.0.0"
      const pm = new PackageManager(processManager)
      const result = pm["detectFromUserAgent"]()
      expect(result.manager).toBe("pnpm")
      expect(result.version).toBe("8.0.0")
    })

    it("should detect pnpm from pnpx with version", () => {
      process.env.npm_config_user_agent = "pnpx/8.0.0"
      const pm = new PackageManager(processManager)
      const result = pm["detectFromUserAgent"]()
      expect(result.manager).toBe("pnpm")
      expect(result.version).toBe("8.0.0")
    })

    it("should detect yarn from user agent with version", () => {
      process.env.npm_config_user_agent = "yarn/1.22.0"
      const pm = new PackageManager(processManager)
      const result = pm["detectFromUserAgent"]()
      expect(result.manager).toBe("yarn")
      expect(result.version).toBe("1.22.0")
    })

    it("should default to npm for unknown user agent", () => {
      process.env.npm_config_user_agent = "some-unknown-manager/1.0.0"
      const pm = new PackageManager(processManager)
      const result = pm["detectFromUserAgent"]()
      expect(result.manager).toBe("npm")
      expect(result.version).toBeUndefined()
    })

    it("should default to npm when user agent is undefined", () => {
      delete process.env.npm_config_user_agent
      const pm = new PackageManager(processManager)
      const result = pm["detectFromUserAgent"]()
      expect(result.manager).toBe("npm")
      expect(result.version).toBeUndefined()
    })
  })

  describe("setPackageManager", () => {
    it("should not run if package manager is already set", async () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "yarn"

      await pm.setPackageManager({})

      expect(mockExecute).not.toHaveBeenCalled()
    })

    it("should set chosen package manager if available", async () => {
      mockExecute.mockResolvedValue({ stdout: "8.0.0", stderr: "" })
      const pm = new PackageManager(processManager, { usePnpm: true })

      await pm.setPackageManager({})

      expect(pm.getPackageManager()).toBe("pnpm")
      expect(await pm.getPackageManagerString()).toBe("pnpm@8.0.0")
      expect(mockExecute).toHaveBeenCalledWith(
        ["pnpm -v", {}],
        { verbose: false }
      )
    })

    it("should throw error when chosen package manager is not available", async () => {
      mockExecute.mockRejectedValueOnce(new Error("Command not found"))

      const pm = new PackageManager(processManager, { usePnpm: true })

      await pm.setPackageManager({})

      expect(mockLogMessage).toHaveBeenCalledWith({
        type: "error",
        message: expect.stringContaining('"pnpm" is not available'),
      })
    })

    it("should detect from user agent when no package manager chosen", async () => {
      process.env.npm_config_user_agent = "yarn/1.22.0"

      const pm = new PackageManager(processManager)
      await pm.setPackageManager({})

      expect(pm.getPackageManager()).toBe("yarn")
      expect(await pm.getPackageManagerString()).toBe("yarn@1.22.0")
      // Detection message should not be logged in non-verbose mode
      expect(mockLogMessage).not.toHaveBeenCalledWith({
        type: "info",
        message: expect.stringContaining('Using detected package manager "yarn"'),
      })
      // Should not call getVersion since version is in user agent
      expect(mockExecute).not.toHaveBeenCalled()
    })

    it("should use detected package manager even without version in user agent", async () => {
      mockExecute.mockResolvedValue({ stdout: "1.22.0", stderr: "" })
      process.env.npm_config_user_agent = "yarn"

      const pm = new PackageManager(processManager)
      await pm.setPackageManager({})

      expect(pm.getPackageManager()).toBe("yarn")
      expect(await pm.getPackageManagerString()).toBe("yarn@1.22.0")
      // Should call getVersion since version is not in user agent
      expect(mockExecute).toHaveBeenCalledWith(["yarn -v", {}], {
        verbose: false,
      })
      // Fallback message should not be logged in non-verbose mode
      expect(mockLogMessage).not.toHaveBeenCalledWith({
        type: "info",
        message: expect.stringContaining("Falling back to"),
      })
    })

    it("should log detection messages in verbose mode", async () => {
      process.env.npm_config_user_agent = "yarn/1.22.0"

      const pm = new PackageManager(processManager, { verbose: true })
      await pm.setPackageManager({})

      expect(pm.getPackageManager()).toBe("yarn")
      expect(mockLogMessage).toHaveBeenCalledWith({
        type: "info",
        message: expect.stringContaining('Using detected package manager "yarn"'),
      })
      // Should not call getVersion since version is in user agent
      expect(mockExecute).not.toHaveBeenCalled()
    })

    it("should log fallback messages in verbose mode when no version in user agent", async () => {
      mockExecute.mockResolvedValue({ stdout: "1.22.0", stderr: "" })
      process.env.npm_config_user_agent = "yarn"

      const pm = new PackageManager(processManager, { verbose: true })
      await pm.setPackageManager({})

      expect(pm.getPackageManager()).toBe("yarn")
      expect(mockLogMessage).toHaveBeenCalledWith({
        type: "info",
        message: expect.stringContaining("Falling back to yarn"),
      })
      // Should call getVersion to get the version
      expect(mockExecute).toHaveBeenCalledWith(["yarn -v", {}], {
        verbose: false,
      })
    })
  })

  describe("removeLockFiles", () => {
    it("should not remove files if package manager is not set", async () => {
      const pm = new PackageManager(processManager)

      await pm.removeLockFiles("/test/path")

      expect(mockExistsSync).not.toHaveBeenCalled()
      expect(mockRmSync).not.toHaveBeenCalled()
    })

    it("should remove yarn.lock, pnpm-lock.yaml, and .yarn when using npm", async () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "npm"
      mockExistsSync.mockReturnValue(true)

      await pm.removeLockFiles("/test/path")

      expect(mockExistsSync).toHaveBeenCalledWith("/test/path/yarn.lock")
      expect(mockExistsSync).toHaveBeenCalledWith("/test/path/pnpm-lock.yaml")
      expect(mockExistsSync).toHaveBeenCalledWith("/test/path/.yarn")
      expect(mockRmSync).toHaveBeenCalledWith("/test/path/yarn.lock", {
        force: true,
        recursive: true,
      })
      expect(mockRmSync).toHaveBeenCalledWith("/test/path/pnpm-lock.yaml", {
        force: true,
        recursive: true,
      })
      expect(mockRmSync).toHaveBeenCalledWith("/test/path/.yarn", {
        force: true,
        recursive: true,
      })
    })

    it("should remove package-lock.json and pnpm-lock.yaml when using yarn", async () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "yarn"
      mockExistsSync.mockReturnValue(true)

      await pm.removeLockFiles("/test/path")

      expect(mockExistsSync).toHaveBeenCalledWith("/test/path/package-lock.json")
      expect(mockExistsSync).toHaveBeenCalledWith("/test/path/pnpm-lock.yaml")
      expect(mockRmSync).toHaveBeenCalledWith("/test/path/package-lock.json", {
        force: true,
        recursive: true,
      })
      expect(mockRmSync).toHaveBeenCalledWith("/test/path/pnpm-lock.yaml", {
        force: true,
        recursive: true,
      })
    })

    it("should remove yarn.lock, package-lock.json, and .yarn when using pnpm", async () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "pnpm"
      mockExistsSync.mockReturnValue(true)

      await pm.removeLockFiles("/test/path")

      expect(mockExistsSync).toHaveBeenCalledWith("/test/path/yarn.lock")
      expect(mockExistsSync).toHaveBeenCalledWith("/test/path/package-lock.json")
      expect(mockExistsSync).toHaveBeenCalledWith("/test/path/.yarn")
      expect(mockRmSync).toHaveBeenCalledWith("/test/path/yarn.lock", {
        force: true,
        recursive: true,
      })
      expect(mockRmSync).toHaveBeenCalledWith("/test/path/package-lock.json", {
        force: true,
        recursive: true,
      })
      expect(mockRmSync).toHaveBeenCalledWith("/test/path/.yarn", {
        force: true,
        recursive: true,
      })
    })

    it("should not remove files that don't exist", async () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "npm"
      mockExistsSync.mockReturnValue(false)

      await pm.removeLockFiles("/test/path")

      expect(mockExistsSync).toHaveBeenCalled()
      expect(mockRmSync).not.toHaveBeenCalled()
    })
  })

  describe("installDependencies", () => {
    it("should set package manager before installing if not set", async () => {
      process.env.npm_config_user_agent = "yarn/1.22.0"

      const pm = new PackageManager(processManager)
      await pm.installDependencies({ cwd: "/test/path" })

      expect(pm.getPackageManager()).toBe("yarn")
    })

    it("should remove lock files before installing", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })
      mockExistsSync.mockReturnValue(true)

      const pm = new PackageManager(processManager, { useNpm: true })
      pm["packageManager"] = "npm"

      await pm.installDependencies({ cwd: "/test/path" })

      expect(mockRmSync).toHaveBeenCalled()
    })

    it("should execute yarn command when using yarn", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })

      const pm = new PackageManager(processManager)
      pm["packageManager"] = "yarn"

      await pm.installDependencies({ cwd: "/test/path" })

      expect(mockExecute).toHaveBeenCalledWith(
        ["yarn", { cwd: "/test/path" }],
        { verbose: false }
      )
    })

    it("should execute pnpm install when using pnpm", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })

      const pm = new PackageManager(processManager)
      pm["packageManager"] = "pnpm"

      await pm.installDependencies({ cwd: "/test/path" })

      expect(mockExecute).toHaveBeenCalledWith(
        ["pnpm install", { cwd: "/test/path" }],
        { verbose: false }
      )
    })

    it("should execute npm install then npm ci when using npm", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })

      const pm = new PackageManager(processManager)
      pm["packageManager"] = "npm"

      await pm.installDependencies({ cwd: "/test/path" })

      expect(mockExecute).toHaveBeenCalledWith(
        ["npm install", { cwd: "/test/path" }],
        { verbose: false }
      )
      expect(mockExecute).toHaveBeenCalledWith(
        ["npm ci", { cwd: "/test/path" }],
        { verbose: false }
      )
      expect(mockExecute).toHaveBeenCalledTimes(2)
    })

    it("should re-run npm install if npm ci fails", async () => {
      mockExecute
        .mockResolvedValueOnce({ stdout: "", stderr: "" }) // npm install succeeds
        .mockRejectedValueOnce(new Error("npm ci failed")) // npm ci fails
        .mockResolvedValueOnce({ stdout: "", stderr: "" }) // npm install retry succeeds

      const pm = new PackageManager(processManager)
      pm["packageManager"] = "npm"

      await pm.installDependencies({ cwd: "/test/path" })

      expect(mockExecute).toHaveBeenCalledWith(
        ["npm install", { cwd: "/test/path" }],
        { verbose: false }
      )
      expect(mockExecute).toHaveBeenCalledWith(
        ["npm ci", { cwd: "/test/path" }],
        { verbose: false }
      )
      // Second npm install call
      expect(mockExecute).toHaveBeenCalledTimes(3)
    })

    it("should respect verbose option", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })

      const pm = new PackageManager(processManager, { verbose: true })
      pm["packageManager"] = "yarn"

      await pm.installDependencies({ cwd: "/test/path" })

      expect(mockExecute).toHaveBeenCalledWith(
        expect.anything(),
        { verbose: true }
      )
    })
  })

  describe("getCommandStr", () => {
    it("should throw error if package manager is not set", () => {
      const pm = new PackageManager(processManager)

      expect(() => pm.getCommandStr("dev")).toThrow("Package manager not set")
    })

    it("should return yarn command format", () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "yarn"

      expect(pm.getCommandStr("dev")).toBe("yarn dev")
    })

    it("should return pnpm command format", () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "pnpm"

      expect(pm.getCommandStr("build")).toBe("pnpm build")
    })

    it("should return npm command format with 'run'", () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "npm"

      expect(pm.getCommandStr("test")).toBe("npm run test")
    })
  })

  describe("runCommand", () => {
    it("should set package manager before running if not set", async () => {
      process.env.npm_config_user_agent = "yarn/1.22.0"

      const pm = new PackageManager(processManager)
      await pm.runCommand("dev", { cwd: "/test/path" })

      expect(pm.getPackageManager()).toBe("yarn")
    })

    it("should execute command with correct format for yarn", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })

      const pm = new PackageManager(processManager)
      pm["packageManager"] = "yarn"

      await pm.runCommand("dev", { cwd: "/test/path" })

      expect(mockExecute).toHaveBeenCalledWith(
        ["yarn dev", { cwd: "/test/path" }],
        { verbose: false }
      )
    })

    it("should execute command with correct format for npm", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })

      const pm = new PackageManager(processManager)
      pm["packageManager"] = "npm"

      await pm.runCommand("build", { cwd: "/test/path" })

      expect(mockExecute).toHaveBeenCalledWith(
        ["npm run build", { cwd: "/test/path" }],
        { verbose: false }
      )
    })

    it("should pass through verbose options", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })

      const pm = new PackageManager(processManager, { verbose: true })
      pm["packageManager"] = "yarn"

      await pm.runCommand("dev", { cwd: "/test/path" }, { needOutput: true })

      expect(mockExecute).toHaveBeenCalledWith(
        expect.anything(),
        { verbose: true, needOutput: true }
      )
    })

    it("should return execution result", async () => {
      const result = { stdout: "success", stderr: "" }
      mockExecute.mockResolvedValue(result)

      const pm = new PackageManager(processManager)
      pm["packageManager"] = "yarn"

      const output = await pm.runCommand("dev", {})

      expect(output).toEqual(result)
    })
  })

  describe("runMedusaCommand", () => {
    it("should set package manager before running if not set", async () => {
      process.env.npm_config_user_agent = "yarn/1.22.0"

      const pm = new PackageManager(processManager)
      await pm.runMedusaCommand("migrate", { cwd: "/test/path" })

      expect(pm.getPackageManager()).toBe("yarn")
    })

    it("should execute yarn medusa command for yarn", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })

      const pm = new PackageManager(processManager)
      pm["packageManager"] = "yarn"

      await pm.runMedusaCommand("migrate", { cwd: "/test/path" })

      expect(mockExecute).toHaveBeenCalledWith(
        ["yarn medusa migrate", { cwd: "/test/path" }],
        { verbose: false }
      )
    })

    it("should execute pnpm medusa command for pnpm", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })

      const pm = new PackageManager(processManager)
      pm["packageManager"] = "pnpm"

      await pm.runMedusaCommand("seed", { cwd: "/test/path" })

      expect(mockExecute).toHaveBeenCalledWith(
        ["pnpm medusa seed", { cwd: "/test/path" }],
        { verbose: false }
      )
    })

    it("should execute npx medusa command for npm", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })

      const pm = new PackageManager(processManager)
      pm["packageManager"] = "npm"

      await pm.runMedusaCommand("start", { cwd: "/test/path" })

      expect(mockExecute).toHaveBeenCalledWith(
        ["npx medusa start", { cwd: "/test/path" }],
        { verbose: false }
      )
    })

    it("should pass through verbose options", async () => {
      mockExecute.mockResolvedValue({ stdout: "", stderr: "" })

      const pm = new PackageManager(processManager, { verbose: true })
      pm["packageManager"] = "yarn"

      await pm.runMedusaCommand("migrate", { cwd: "/test/path" }, { needOutput: true })

      expect(mockExecute).toHaveBeenCalledWith(
        expect.anything(),
        { verbose: true, needOutput: true }
      )
    })

    it("should return execution result", async () => {
      const result = { stdout: "migration complete", stderr: "" }
      mockExecute.mockResolvedValue(result)

      const pm = new PackageManager(processManager)
      pm["packageManager"] = "yarn"

      const output = await pm.runMedusaCommand("migrate", {})

      expect(output).toEqual(result)
    })
  })

  describe("getPackageManager", () => {
    it("should return undefined when not set", () => {
      const pm = new PackageManager(processManager)
      expect(pm.getPackageManager()).toBeUndefined()
    })

    it("should return the current package manager", () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "yarn"
      expect(pm.getPackageManager()).toBe("yarn")
    })
  })

  describe("getPackageManagerString", () => {
    it("should return undefined when version is not set", async () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "yarn"
      expect(await pm.getPackageManagerString()).toBeUndefined()
    })

    it("should return packageManager@version format", async () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "yarn"
      pm["packageManagerVersion"] = "4.9.0"
      expect(await pm.getPackageManagerString()).toBe("yarn@4.9.0")
    })

    it("should work with pnpm", async () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "pnpm"
      pm["packageManagerVersion"] = "8.15.0"
      expect(await pm.getPackageManagerString()).toBe("pnpm@8.15.0")
    })

    it("should work with npm", async () => {
      const pm = new PackageManager(processManager)
      pm["packageManager"] = "npm"
      pm["packageManagerVersion"] = "10.0.0"
      expect(await pm.getPackageManagerString()).toBe("npm@10.0.0")
    })

    it("should call setPackageManager if package manager is not set", async () => {
      process.env.npm_config_user_agent = "yarn/1.22.0"

      const pm = new PackageManager(processManager)
      const result = await pm.getPackageManagerString()

      expect(pm.getPackageManager()).toBe("yarn")
      expect(result).toBe("yarn@1.22.0")
    })
  })
})
