import { mkdtempSync, rmSync } from "fs"
import os from "os"
import path from "path"
import { Compiler } from "../compiler"

const syncCompiler = {
  parseConfigFile: jest.fn(),
  createProgram: jest.fn(),
  getPreEmitDiagnostics: jest.fn(),
  formatDiagnosticsWithColorAndContext: jest.fn(),
  close: jest.fn(),
}

jest.mock("typescript", () => ({ version: "7.1.0" }))
jest.mock(
  "typescript/sync",
  () => ({ ...syncCompiler, API: jest.fn(() => syncCompiler) }),
  { virtual: true }
)

const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
} as any

describe("Compiler with TypeScript 7.1", () => {
  let projectRoot: string

  beforeEach(() => {
    jest.clearAllMocks()
    projectRoot = mkdtempSync(path.join(os.tmpdir(), "medusa-compiler-"))
  })

  afterEach(() => {
    rmSync(projectRoot, { recursive: true, force: true })
  })

  it("loads tsconfig with typescript/sync", async () => {
    syncCompiler.parseConfigFile.mockReturnValue({
      options: { outDir: ".medusa/server" },
      fileNames: [path.join(projectRoot, "medusa-config.ts")],
      errors: [],
    })

    const tsConfig = await new Compiler(projectRoot, logger).loadTSConfigFile()

    expect(syncCompiler.parseConfigFile).toHaveBeenCalledWith(
      path.join(projectRoot, "tsconfig.json")
    )
    expect(tsConfig).toEqual({
      options: { outDir: ".medusa/server" },
      fileNames: [path.join(projectRoot, "medusa-config.ts")],
      errors: [],
    })
  })

  it("emits backend output with typescript/sync", async () => {
    const emit = jest.fn(() => ({ emitSkipped: false, diagnostics: [] }))
    const program = { emit }
    syncCompiler.createProgram.mockReturnValue(program)
    syncCompiler.getPreEmitDiagnostics.mockReturnValue([])

    const fileName = path.join(projectRoot, "medusa-config.ts")
    const succeeded = await new Compiler(projectRoot, logger).buildAppBackend({
      options: {},
      fileNames: [fileName],
      errors: [],
    })

    expect(syncCompiler.createProgram).toHaveBeenCalledWith(
      [fileName],
      expect.objectContaining({
        outDir: path.join(projectRoot, ".medusa/server"),
        inlineSourceMap: true,
      })
    )
    expect(emit).toHaveBeenCalled()
    expect(syncCompiler.close).toHaveBeenCalled()
    expect(succeeded).toBe(true)
  })

  it("reports TypeScript diagnostics from typescript/sync", async () => {
    const diagnostic = {} as any
    syncCompiler.createProgram.mockReturnValue({
      emit: jest.fn(() => ({ emitSkipped: false, diagnostics: [] })),
    })
    syncCompiler.getPreEmitDiagnostics.mockReturnValue([diagnostic])
    syncCompiler.formatDiagnosticsWithColorAndContext.mockReturnValue(
      "TypeScript error"
    )
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {})

    const succeeded = await new Compiler(projectRoot, logger).buildAppBackend({
      options: {},
      fileNames: [],
      errors: [],
    })

    expect(syncCompiler.formatDiagnosticsWithColorAndContext).toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("Backend build completed with errors")
    )
    expect(succeeded).toBe(false)
    consoleError.mockRestore()
  })
})
