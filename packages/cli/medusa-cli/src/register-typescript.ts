import { readFileSync } from "fs"
import path from "path"

type TypeScriptRequire = NodeJS.Require & {
  resolve: (id: string, options?: { paths?: string[] }) => string
}

type TypeScriptExtensions = Record<
  string,
  (module: { _compile: (content: string, filename: string) => void }, filename: string) => void
>

type RegisterTypeScriptOptions = {
  cwd?: string
  requireFn?: TypeScriptRequire
  extensions?: TypeScriptExtensions
}

const getVersionParts = (version: string) =>
  version.split(".").map((part) => Number.parseInt(part, 10) || 0)

const isTypeScript7_1OrLater = (version: string) => {
  const [major, minor] = getVersionParts(version)
  return major > 7 || (major === 7 && minor >= 1)
}

const isTypeScript7_0 = (version: string) => {
  const [major, minor] = getVersionParts(version)
  return major === 7 && minor === 0
}

const typeScript7_0Error = () => {
  const error = new Error(
    "TypeScript 7.0.x cannot load Medusa projects. Use TypeScript 7.1 or later."
  ) as Error & { code?: string }
  error.code = "TYPESCRIPT_7_0_UNSUPPORTED"
  return error
}

export function registerTypeScript({
  cwd = process.cwd(),
  requireFn = require,
  extensions = require.extensions as unknown as TypeScriptExtensions,
}: RegisterTypeScriptOptions = {}) {
  const paths = [cwd]
  const packageJson = requireFn(
    requireFn.resolve("typescript/package.json", { paths })
  ) as { version: string }

  if (isTypeScript7_0(packageJson.version)) {
    throw typeScript7_0Error()
  }

  if (!isTypeScript7_1OrLater(packageJson.version)) {
    requireFn("ts-node").register({})
    return
  }

  let typeScriptSync: {
    API: new () => {
      parseConfigFile: (configPath: string) => { options?: object }
      transpileModule: (
        source: string,
        options: { compilerOptions: object; fileName: string }
      ) => { outputText: string }
      close: () => void
    }
  }
  let compilerOptions: object

  const compileTypeScript = (
    module: { _compile: (content: string, filename: string) => void },
    filename: string
  ) => {
    if (!typeScriptSync) {
      typeScriptSync = requireFn(
        requireFn.resolve("typescript/sync", { paths })
      )
    }

    const ts = new typeScriptSync.API()
    try {
      if (!compilerOptions) {
        compilerOptions =
          ts.parseConfigFile(path.join(cwd, "tsconfig.json")).options ?? {}
      }

      const source = readFileSync(filename, "utf8")
      const { outputText } = ts.transpileModule(source, {
        compilerOptions: {
          ...compilerOptions,
          inlineSourceMap: true,
          sourceMap: false,
        },
        fileName: filename,
      })

      module._compile(outputText, filename)
    } finally {
      ts.close()
    }
  }

  extensions[".ts"] = compileTypeScript
  extensions[".tsx"] = compileTypeScript
}
