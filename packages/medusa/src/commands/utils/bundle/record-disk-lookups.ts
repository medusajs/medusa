import path from "path"

/**
 * Records, for a self-contained bundle, what boot would otherwise look up on
 * disk outside the application: package resolutions (specifier -> file) and
 * small files read with fs (e.g. plugins' package.json).
 */
function recordDiskLookups(appRoot: string) {
  const resolutions: Record<string, string> = {}
  const reads = new Set<string>()
  const outside = (file: unknown) =>
    typeof file === "string" &&
    path.isAbsolute(file) &&
    !file.startsWith(appRoot + path.sep)

  const Module = require("module")
  const resolveFilename = Module._resolveFilename
  Module._resolveFilename = function (request: string) {
    const resolved = resolveFilename.apply(this, arguments)
    if (!request.startsWith(".") && !path.isAbsolute(request) && !(request in resolutions)) {
      resolutions[request] = resolved
    }
    return resolved
  }

  const fs = require("fs")
  for (const [target, name] of [
    [fs, "readFileSync"],
    [fs, "readFile"],
    [fs.promises, "readFile"],
  ] as const) {
    const original = target[name]
    target[name] = function (file: unknown, ...rest: unknown[]) {
      if (outside(file)) {
        reads.add(file as string)
      }
      return original.call(this, file, ...rest)
    }
  }

  return { resolutions, reads }
}


;(global as any).__MEDUSA_DISK_LOOKUPS__ = recordDiskLookups(process.cwd())
