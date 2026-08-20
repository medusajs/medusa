import { readFileSync } from "fs"
import path from "path"

type Alias = { find: RegExp; replacement: string }

/**
 * Whether the quote at *index* is escaped: a quote preceded by an even number
 * of backslashes closes the string, an odd count means the quote itself is
 * escaped. Counting only the immediately preceding character misreads a value
 * that ends in an escaped backslash and leaves the stripper inside the string.
 */
function isEscapedQuote(contents: string, index: number): boolean {
  let backslashes = 0
  for (let j = index - 1; j >= 0 && contents[j] === "\\"; j--) {
    backslashes++
  }
  return backslashes % 2 === 1
}

/**
 * Strips the comments tsconfig files are allowed to carry before JSON.parse.
 * Handles // line comments and /* block comments, leaving both alone inside
 * string literals (a URL or a Windows path with "//" in it is not a comment).
 */
function stripJsonComments(contents: string): string {
  let result = ""
  let inString = false
  for (let i = 0; i < contents.length; i++) {
    const char = contents[i]
    const next = contents[i + 1]
    if (char === '"' && !isEscapedQuote(contents, i)) {
      inString = !inString
    }
    if (!inString && char === "/" && next === "/") {
      while (i < contents.length && contents[i] !== "\n") {
        i++
      }
      result += "\n"
      continue
    }
    if (!inString && char === "/" && next === "*") {
      i += 2
      while (i < contents.length && !(contents[i] === "*" && contents[i + 1] === "/")) {
        i++
      }
      i++
      continue
    }
    result += char
  }
  return result
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Forward slashes, so the alias works the same on POSIX and Windows. */
function toPosix(value: string): string {
  return value.replace(/\\/g, "/")
}

function resolveAliasTarget(baseDir: string, target: string): string {
  return toPosix(path.resolve(baseDir, target))
}

/**
 * Reads the `compilerOptions.paths` aliases of a tsconfig file and converts
 * them into Vite `resolve.alias` entries.
 *
 * Used by `medusa plugin:build`: the admin extensions bundle is compiled by
 * Vite with the plugin package root as cwd, so Vite never sees the
 * `src/admin/tsconfig.json` the documented `@/*`-style aliases live in, and
 * Rollup treats them as bare package specifiers. Mapping them here
 * keeps a single source of truth — the admin tsconfig — for both the editor
 * and the bundler.
 *
 * Values are resolved against `baseUrl` when the tsconfig declares one (that
 * is TypeScript's rule), otherwise against the tsconfig's own directory
 * (the rule since TS 4.1). A missing file, a parse failure, or a config
 * without paths yields an empty list — the build then behaves exactly as
 * before.
 */
export function readTsPathAliases(tsconfigPath: string): Alias[] {
  let contents: string
  try {
    contents = readFileSync(tsconfigPath, "utf-8")
  } catch {
    return []
  }

  let compilerOptions: Record<string, unknown> | undefined
  try {
    const parsed = JSON.parse(stripJsonComments(contents))
    compilerOptions = parsed?.compilerOptions
  } catch {
    return []
  }

  if (!compilerOptions || typeof compilerOptions !== "object") {
    return []
  }

  const paths = (compilerOptions as { paths?: unknown }).paths
  if (!paths || typeof paths !== "object") {
    return []
  }

  const baseUrl = (compilerOptions as { baseUrl?: unknown }).baseUrl
  const baseDir =
    typeof baseUrl === "string" && baseUrl.length > 0
      ? path.resolve(path.dirname(tsconfigPath), baseUrl)
      : path.dirname(tsconfigPath)

  const aliases: Alias[] = []

  for (const [pattern, targets] of Object.entries(
    paths as Record<string, unknown>
  )) {
    if (!Array.isArray(targets) || typeof targets[0] !== "string") {
      continue
    }
    const target = targets[0]
    const starIndex = pattern.indexOf("*")

    if (starIndex === -1) {
      // An alias without a wildcard matches one exact module id.
      aliases.push({
        find: new RegExp(`^${escapeRegExp(pattern)}$`),
        replacement: resolveAliasTarget(baseDir, target),
      })
      continue
    }

    // "@/*" -> ["./*"] becomes /^@\/(.+)$/ -> "<adminDir>/\1": Vite applies
    // regex aliases with String.replace semantics, so $1 carries the subpath.
    const prefix = pattern.slice(0, starIndex)
    const suffix = pattern.slice(starIndex + 1)
    const targetStar = target.indexOf("*")
    const targetPrefix =
      targetStar === -1 ? target : target.slice(0, targetStar)
    const targetSuffix = targetStar === -1 ? "" : target.slice(targetStar + 1)

    aliases.push({
      find: new RegExp(
        `^${escapeRegExp(prefix)}(.+?)${escapeRegExp(suffix)}$`
      ),
      replacement: `${resolveAliasTarget(baseDir, targetPrefix)}/$1${targetSuffix}`,
    })
  }

  return aliases
}
