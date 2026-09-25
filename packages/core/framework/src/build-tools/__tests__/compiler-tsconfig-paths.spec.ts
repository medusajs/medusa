import path from "path"
import fs from "fs"
import os from "os"
import { Compiler } from "../compiler"
import type { Logger } from "@medusajs/types"

/**
 * Regression tests for the plugin develop workflow's handling of TypeScript
 * `paths` mappings. `medusa plugin:develop` compiles each changed file with a
 * per-file SWC transform. The transformer must receive the tsconfig's
 * `baseUrl`/`paths` options so aliased imports resolve in the emitted output,
 * matching what the full build (`tsc`) produces.
 */

describe("Compiler TS config paths", () => {
  let projectRoot: string
  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    panic: jest.fn(),
    setLogLevel: jest.fn(),
  } as unknown as Logger

  beforeEach(() => {
    projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "medusa-compiler-"))
    fs.mkdirSync(path.join(projectRoot, "src"), { recursive: true })
    fs.writeFileSync(path.join(projectRoot, "src", "index.ts"), `export {}`)
    fs.writeFileSync(
      path.join(projectRoot, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          baseUrl: ".",
          paths: {
            "@services/*": ["./src/services/*"],
          },
          target: "ES2021",
          module: "commonjs",
          outDir: "dist",
        },
        include: ["src"],
      })
    )
  })

  afterEach(() => {
    fs.rmSync(projectRoot, { recursive: true, force: true })
  })

  it("parses baseUrl and paths from the plugin tsconfig", async () => {
    const compiler = new Compiler(projectRoot, logger)
    const parsedConfig = await compiler.loadTSConfigFile()

    expect(parsedConfig).toBeDefined()
    expect(parsedConfig!.options.baseUrl).toBeDefined()
    expect(parsedConfig!.options.paths).toEqual({
      "@services/*": ["./src/services/*"],
    })
  })
})
