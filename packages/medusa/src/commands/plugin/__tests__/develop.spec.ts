import { execFileSync } from "child_process"
import fs from "fs"
import os from "os"
import path from "path"
import * as ts from "typescript"

type Transform = (filePath: string) => Promise<string>
type Config = {
  compilerOptions?: { baseUrl?: string; paths?: Record<string, string[]> }
  extends?: string
}

const loadTSConfigFileMock = jest.fn()
const buildPluginBackendMock = jest.fn()
const developPluginBackendMock = jest.fn<
  Promise<void>,
  [Transform, () => void]
>()
const execFileMock = jest.fn()

jest.mock("@medusajs/framework/build-tools", () => ({
  Compiler: jest.fn().mockImplementation(() => ({
    loadTSConfigFile: (...args: any[]) => loadTSConfigFileMock(...args),
    buildPluginBackend: (...args: any[]) => buildPluginBackendMock(...args),
    developPluginBackend: (transform: Transform, publish: () => void) =>
      developPluginBackendMock(transform, publish),
  })),
}))

jest.mock("@medusajs/framework/logger", () => ({
  logger: { info: jest.fn(), error: jest.fn() },
}))

jest.mock("child_process", () => ({
  ...jest.requireActual("child_process"),
  execFile: (...args: any[]) => execFileMock(...args),
}))

import developPlugin from "../develop"

let fixture: string
let directory: string

function write(file: string, content: string) {
  const absolutePath = path.join(fixture, file)
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
  fs.writeFileSync(absolutePath, content)
  return absolutePath
}

function configure(config: Config = {}, parent?: Config) {
  if (parent) {
    write("config/tsconfig.base.json", JSON.stringify(parent))
  }
  write(
    "plugin/tsconfig.json",
    JSON.stringify({
      ...config,
      compilerOptions: { target: "es2021", ...config.compilerOptions },
      include: ["src/**/*.ts"],
    })
  )
  const parsedConfig = ts.getParsedCommandLineOfConfigFile(
    path.join(directory, "tsconfig.json"),
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        throw new Error(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
        )
      },
    }
  )
  expect(parsedConfig?.errors).toEqual([])
  loadTSConfigFileMock.mockResolvedValue(parsedConfig)
  return parsedConfig
}

async function startPlugin() {
  await developPlugin({ directory })
  return developPluginBackendMock.mock.calls[0][0]
}

async function emit(transform: Transform, file: string) {
  const outputPath = path.join(
    directory,
    ".medusa/server",
    path.relative(directory, file).replace(/\.ts$/, ".js")
  )
  const code = await transform(file)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, code)
  return outputPath
}

function execute(file: string) {
  return JSON.parse(
    execFileSync(
      process.execPath,
      [
        "-e",
        "process.stdout.write(JSON.stringify(require(process.argv[1]).default()))",
        file,
      ],
      { encoding: "utf8", timeout: 5000, stdio: ["ignore", "pipe", "pipe"] }
    )
  )
}

beforeEach(() => {
  fixture = fs.mkdtempSync(path.join(os.tmpdir(), "medusa-plugin-develop-"))
  directory = path.join(fixture, "plugin")
  loadTSConfigFileMock.mockReset()
  buildPluginBackendMock.mockReset()
  developPluginBackendMock.mockReset().mockResolvedValue(undefined)
  execFileMock.mockReset()
})

afterEach(() => {
  jest.restoreAllMocks()
  fs.rmSync(fixture, { recursive: true, force: true })
})

const aliasCases: {
  name: string
  config: Config
  parent?: Config
  specifier?: string
}[] = [
  {
    name: "paths without baseUrl",
    config: {
      compilerOptions: { paths: { "@services/*": ["src/services/*"] } },
    },
  },
  {
    name: "an explicit project-root baseUrl",
    config: {
      compilerOptions: {
        baseUrl: ".",
        paths: { "@services/*": ["src/services/*"] },
      },
    },
  },
  {
    name: "a custom baseUrl",
    config: {
      compilerOptions: {
        baseUrl: "src",
        paths: { "@services/*": ["services/*"] },
      },
    },
  },
  {
    name: "an inherited baseUrl",
    config: { extends: "../config/tsconfig.base.json" },
    parent: {
      compilerOptions: {
        baseUrl: "../plugin/src",
        paths: { "@services/*": ["services/*"] },
      },
    },
  },
  {
    name: "paths inherited from another directory without baseUrl",
    config: { extends: "../config/tsconfig.base.json" },
    parent: {
      compilerOptions: {
        paths: { "@services/*": ["../plugin/src/services/*"] },
      },
    },
  },
  {
    name: "an exact alias",
    config: {
      compilerOptions: { paths: { "@greeting": ["src/services/greeting"] } },
    },
    specifier: "@greeting",
  },
]

describe("developPlugin", () => {
  test.each(aliasCases)(
    "resolves $name in emitted modules",
    async ({ config, parent, specifier }) => {
      const target = write(
        "plugin/src/services/greeting.ts",
        `export const greet = () => "first"`
      )
      const importer = write(
        "plugin/src/api/example/route.ts",
        `import { greet } from "${
          specifier ?? "@services/greeting"
        }"; export default () => greet()`
      )
      configure(config, parent)
      const transform = await startPlugin()
      await emit(transform, target)
      const output = await emit(transform, importer)
      expect(execute(output)).toEqual("first")

      // Reuse the command's real callback for subsequent source changes.
      write(
        "plugin/src/services/greeting.ts",
        `export const greet = () => "second"`
      )
      await emit(transform, target)
      await emit(transform, importer)
      expect(execute(output)).toEqual("second")
    }
  )

  test.each([false, true])(
    "preserves relative, builtin and external imports (paths: %s)",
    async (withPaths) => {
      const target = write(
        "plugin/src/services/greeting.ts",
        `export const greet = () => "hello"`
      )
      const importer = write(
        "plugin/src/api/example/route.ts",
        `import { greet } from "../../services/greeting"
       import { basename } from "node:path"
       import { value } from "external-package"
       export default () => [greet(), basename("example"), value]`
      )
      write(
        "plugin/node_modules/external-package/package.json",
        JSON.stringify({ name: "external-package", main: "index.js" })
      )
      write(
        "plugin/node_modules/external-package/index.js",
        `exports.value = "external"`
      )
      configure(
        withPaths
          ? {
              compilerOptions: {
                baseUrl: "src",
                paths: { "@services/*": ["services/*"] },
              },
            }
          : {}
      )
      const transform = await startPlugin()
      await emit(transform, target)
      expect(execute(await emit(transform, importer))).toEqual([
        "hello",
        "example",
        "external",
      ])
    }
  )

  test("does not build, watch or publish when config loading fails", async () => {
    loadTSConfigFileMock.mockResolvedValue(undefined)
    await developPlugin({ directory })
    expect(buildPluginBackendMock).not.toHaveBeenCalled()
    expect(developPluginBackendMock).not.toHaveBeenCalled()
    expect(execFileMock).not.toHaveBeenCalled()
  })

  test("loads config and builds before starting the watcher", async () => {
    write("plugin/src/index.ts", "export {}")
    const parsedConfig = configure()
    await startPlugin()
    expect(buildPluginBackendMock).toHaveBeenCalledWith(parsedConfig)
    expect(loadTSConfigFileMock.mock.invocationCallOrder[0]).toBeLessThan(
      buildPluginBackendMock.mock.invocationCallOrder[0]
    )
    expect(buildPluginBackendMock.mock.invocationCallOrder[0]).toBeLessThan(
      developPluginBackendMock.mock.invocationCallOrder[0]
    )
    expect(execFileMock).not.toHaveBeenCalled()
  })

  test("preserves publication arguments and prevents concurrent publishes", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {})
    jest.spyOn(console, "error").mockImplementation(() => {})
    write("plugin/src/index.ts", "export {}")
    configure()
    await startPlugin()
    const publish = developPluginBackendMock.mock.calls[0][1]
    publish()
    publish()
    expect(execFileMock).toHaveBeenCalledTimes(1)
    expect(execFileMock).toHaveBeenCalledWith(
      process.execPath,
      [
        path.join(path.dirname(require.resolve("yalc")), "yalc.js"),
        "publish",
        "--push",
        "--no-scripts",
      ],
      { cwd: directory },
      expect.any(Function)
    )
    execFileMock.mock.calls[0][3](null, "", "")
    publish()
    expect(execFileMock).toHaveBeenCalledTimes(2)
  })
})
