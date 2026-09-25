import path from "path"
import fs from "fs"
import os from "os"
import * as swcCore from "@swc/core"
import ts from "typescript"
import { buildSwcTransformOptions } from "../develop"

/**
 * Regression tests for the `medusa plugin:develop` per-file SWC transform.
 *
 * The transformer must honor the plugin's TypeScript `baseUrl`/`paths`
 * mappings so that files hot-reloaded during development resolve aliased
 * imports the same way the full `tsc` build does. Without forwarding
 * `paths`, the emitted JS keeps the raw alias (e.g.
 * `require("@services/greet")`) which crashes at runtime in the consuming
 * application.
 */

describe("plugin develop SWC transform", () => {
  let projectRoot: string

  beforeEach(() => {
    projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "medusa-plugin-"))
    fs.mkdirSync(path.join(projectRoot, "src", "services"), {
      recursive: true,
    })
    fs.writeFileSync(
      path.join(projectRoot, "src", "services", "greet.ts"),
      `export const greet = () => "hello"`
    )
  })

  afterEach(() => {
    fs.rmSync(projectRoot, { recursive: true, force: true })
  })

  const writeTsConfig = (compilerOptions: Record<string, unknown>) => {
    fs.writeFileSync(
      path.join(projectRoot, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          target: "es2021",
          module: "commonjs",
          ...compilerOptions,
        },
        include: ["src"],
      })
    )
  }

  const loadParsedConfig = () => {
    const parsedConfig = ts.getParsedCommandLineOfConfigFile(
      path.join(projectRoot, "tsconfig.json"),
      { inlineSourceMap: true },
      {
        ...ts.sys,
        useCaseSensitiveFileNames: true,
        getCurrentDirectory: () => projectRoot,
        onUnRecoverableConfigFileDiagnostic: () => {},
      }
    )!
    return parsedConfig
  }

  const transform = async (filePath: string) => {
    const output = await swcCore.transformFile(
      filePath,
      buildSwcTransformOptions(projectRoot, loadParsedConfig())
    )
    return output.code
  }

  describe("buildSwcTransformOptions", () => {
    it("forwards the parsed baseUrl and paths from the tsconfig", () => {
      writeTsConfig({
        baseUrl: ".",
        paths: { "@services/*": ["./src/services/*"] },
      })

      const options = buildSwcTransformOptions(projectRoot, loadParsedConfig())

      expect(path.resolve(options.jsc.baseUrl!)).toBe(path.resolve(projectRoot))
      expect(options.jsc.paths).toEqual({
        "@services/*": ["./src/services/*"],
      })
    })

    it("falls back to the plugin directory when no baseUrl is set", () => {
      writeTsConfig({ paths: { "@services/*": ["./src/services/*"] } })

      const options = buildSwcTransformOptions(projectRoot, loadParsedConfig())

      expect(options.jsc.baseUrl).toBe(projectRoot)
      expect(options.jsc.paths).toEqual({
        "@services/*": ["./src/services/*"],
      })
    })
  })

  describe("transformFile", () => {
    it("resolves tsconfig paths aliases in the emitted output", async () => {
      writeTsConfig({
        baseUrl: ".",
        paths: { "@services/*": ["./src/services/*"] },
      })

      const entryFile = path.join(projectRoot, "src", "main.ts")
      fs.writeFileSync(
        entryFile,
        `import { greet } from "@services/greet"\nexport const run = () => greet()\n`
      )

      const code = await transform(entryFile)

      expect(code).toContain(`require("./services/greet")`)
      expect(code).not.toContain(`require("@services/greet")`)
    })

    it("keeps the alias unresolved when the tsconfig has no paths mapping", async () => {
      writeTsConfig({})

      const entryFile = path.join(projectRoot, "src", "broken.ts")
      fs.writeFileSync(
        entryFile,
        `import { greet } from "@services/greet"\nexport const run = () => greet()\n`
      )

      const code = await transform(entryFile)

      expect(code).toContain(`require("@services/greet")`)
    })
  })
})
