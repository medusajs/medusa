import { mkdtempSync, rmSync, writeFileSync } from "fs"
import os from "os"
import path from "path"
import { registerTypeScript } from "../register-typescript"

describe("registerTypeScript", () => {
  let projectRoot: string | undefined

  afterEach(() => {
    if (projectRoot) {
      rmSync(projectRoot, { recursive: true, force: true })
      projectRoot = undefined
    }
  })

  it("uses ts-node for TypeScript 6 and earlier", () => {
    const tsNodeRegister = jest.fn()
    const requireFn = jest.fn((id: string) => {
      if (id === "typescript/package.json") {
        return { version: "6.0.3" }
      }
      if (id === "ts-node") {
        return { register: tsNodeRegister }
      }
      return undefined
    }) as any
    requireFn.resolve = jest.fn((id: string) => id)

    registerTypeScript({ requireFn })

    expect(tsNodeRegister).toHaveBeenCalledWith({})
  })

  it("rejects TypeScript 7.0 with an actionable error", () => {
    const requireFn = jest.fn((id: string) => {
      if (id === "typescript/package.json") {
        return { version: "7.0.2" }
      }
      return undefined
    }) as any
    requireFn.resolve = jest.fn((id: string) => id)

    expect(() => registerTypeScript({ requireFn })).toThrow(
      "TypeScript 7.0.x cannot load Medusa projects. Use TypeScript 7.1 or later."
    )
  })

  it("transpiles TypeScript 7.1 files with typescript/sync", () => {
    projectRoot = mkdtempSync(path.join(os.tmpdir(), "medusa-cli-"))
    const filePath = path.join(projectRoot, "medusa-config.ts")
    writeFileSync(path.join(projectRoot, "tsconfig.json"), "{}")
    writeFileSync(filePath, "export default {}")

    const transpileModule = jest.fn(() => ({ outputText: "compiled" }))
    const parseConfigFile = jest.fn(() => ({
      options: { target: "esnext" },
    }))
    const close = jest.fn()
    const API = jest.fn(() => ({ parseConfigFile, transpileModule, close }))
    const requireFn = jest.fn((id: string) => {
      if (id === "typescript/package.json") {
        return { version: "7.1.0" }
      }
      if (id === "typescript/sync") {
        return { API }
      }
      return undefined
    }) as any
    requireFn.resolve = jest.fn((id: string) => id)

    const extensions: Record<string, (module: any, filename: string) => void> = {}
    registerTypeScript({
      cwd: projectRoot,
      requireFn,
      extensions,
    })

    const compile = jest.fn()
    extensions[".ts"]({ _compile: compile }, filePath)

    expect(parseConfigFile).toHaveBeenCalledWith(
      path.join(projectRoot, "tsconfig.json")
    )
    expect(API).toHaveBeenCalled()
    expect(close).toHaveBeenCalled()
    expect(transpileModule).toHaveBeenCalledWith(
      "export default {}",
      expect.objectContaining({
        compilerOptions: expect.objectContaining({
          inlineSourceMap: true,
          target: "esnext",
        }),
        fileName: filePath,
      })
    )
    expect(compile).toHaveBeenCalledWith("compiled", filePath)
  })
})
