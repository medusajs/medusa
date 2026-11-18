import { spawn } from "child_process"
import { EventEmitter } from "events"
import { existsSync, mkdtempSync, readFileSync, rmSync } from "fs"
import os from "os"
import path from "path"
import { Compiler } from "../compiler"

jest.mock("typescript", () => ({ version: "7.0.2" }))
jest.mock("child_process", () => ({ spawn: jest.fn() }))

const mockedSpawn = spawn as unknown as jest.Mock

const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
} as any

function mockTscRun(exitCode: number, stdout = "") {
  mockedSpawn.mockImplementationOnce(() => {
    const child = new EventEmitter() as EventEmitter & {
      stdout: EventEmitter
    }
    child.stdout = new EventEmitter()
    process.nextTick(() => {
      child.stdout.emit("data", stdout)
      child.emit("close", exitCode)
    })
    return child
  })
}

describe("Compiler with TypeScript 7", () => {
  let projectRoot: string

  beforeEach(() => {
    jest.clearAllMocks()
    projectRoot = mkdtempSync(path.join(os.tmpdir(), "medusa-compiler-"))
  })

  afterEach(() => {
    rmSync(projectRoot, { recursive: true, force: true })
  })

  it("loads the tsconfig file with tsc --showConfig", async () => {
    mockTscRun(
      0,
      JSON.stringify({
        compilerOptions: { outDir: "./.medusa/server" },
        files: ["./medusa-config.ts", "./src/api/route.ts"],
      })
    )

    const tsConfig = await new Compiler(projectRoot, logger).loadTSConfigFile()

    expect(mockedSpawn).toHaveBeenCalledWith(
      process.execPath,
      [
        expect.stringMatching(/bin[\\/]tsc$/),
        "--showConfig",
        "-p",
        path.join(projectRoot, "tsconfig.json"),
      ],
      expect.objectContaining({ cwd: projectRoot })
    )
    expect(tsConfig).toEqual({
      options: { outDir: "./.medusa/server" },
      fileNames: [
        path.join(projectRoot, "medusa-config.ts"),
        path.join(projectRoot, "src/api/route.ts"),
      ],
      errors: [],
    })
  })

  it("returns undefined when tsc --showConfig fails", async () => {
    mockTscRun(1, "error TS5058")
    jest.spyOn(console, "error").mockImplementationOnce(() => {})

    const tsConfig = await new Compiler(projectRoot, logger).loadTSConfigFile()

    expect(tsConfig).toBeUndefined()
  })

  it("compiles the backend with tsc and a temporary tsconfig file", async () => {
    const buildConfigPath = path.join(
      projectRoot,
      ".medusa",
      "tsconfig.build.json"
    )
    let buildConfig: any
    mockedSpawn.mockImplementationOnce((...args) => {
      buildConfig = JSON.parse(readFileSync(buildConfigPath, "utf-8"))
      mockTscRun(0)
      return mockedSpawn(...args)
    })

    const succeeded = await new Compiler(projectRoot, logger).buildAppBackend({
      options: {},
      fileNames: [
        path.join(projectRoot, "medusa-config.ts"),
        path.join(projectRoot, "src/admin/widget.tsx"),
      ],
      errors: [],
    })

    expect(succeeded).toBe(true)
    expect(buildConfig).toEqual({
      extends: path.join(projectRoot, "tsconfig.json"),
      compilerOptions: {
        outDir: path.join(projectRoot, ".medusa/server"),
        rootDir: projectRoot,
        inlineSourceMap: true,
      },
      files: [path.join(projectRoot, "medusa-config.ts")],
      include: [],
    })
    expect(existsSync(buildConfigPath)).toBe(false)
  })

  it.each([
    [1, "Backend build completed without emitting any output"],
    [2, "Backend build completed with errors"],
  ])(
    "fails the backend build when tsc exits with %s",
    async (exitCode, message) => {
      mockTscRun(exitCode)

      const succeeded = await new Compiler(projectRoot, logger).buildAppBackend(
        { options: {}, fileNames: [], errors: [] }
      )

      expect(succeeded).toBe(false)
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining(message))
    }
  )
})
