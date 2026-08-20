import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import path from "path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { readTsPathAliases } from "./tsconfig-alias"

let projectDir: string
let adminDir: string

beforeEach(() => {
  projectDir = mkdtempSync(path.join(tmpdir(), "medusa-admin-alias-"))
  adminDir = path.join(projectDir, "src", "admin")
  mkdirSync(adminDir, { recursive: true })
})

afterEach(() => {
  rmSync(projectDir, { recursive: true, force: true })
})

function writeAdminTsconfig(contents: string): string {
  const tsconfigPath = path.join(adminDir, "tsconfig.json")
  writeFileSync(tsconfigPath, contents)
  return tsconfigPath
}

/** Resolves an alias against an import id the way Vite does (String.replace). */
function resolveAlias(aliases: { find: RegExp; replacement: string }[], id: string) {
  for (const alias of aliases) {
    if (alias.find.test(id)) {
      return id.replace(alias.find, alias.replacement)
    }
  }
  return null
}

describe("readTsPathAliases", () => {
  it("maps the documented @/* alias to the admin directory", () => {
    const tsconfigPath = writeAdminTsconfig(
      JSON.stringify({
        compilerOptions: { paths: { "@/*": ["./*"] } },
      })
    )

    const resolved = resolveAlias(readTsPathAliases(tsconfigPath), "@/hooks/api")
    expect(resolved).toBe(`${adminDir.replace(/\\/g, "/")}/hooks/api`)
  })

  it("resolves targets against baseUrl when one is declared", () => {
    // TypeScript resolves baseUrl relative to the tsconfig's own directory.
    const tsconfigPath = writeAdminTsconfig(
      JSON.stringify({
        compilerOptions: {
          baseUrl: ".",
          paths: { "@/*": ["*"] },
        },
      })
    )

    const resolved = resolveAlias(readTsPathAliases(tsconfigPath), "@/components")
    expect(resolved).toBe(`${adminDir.replace(/\\/g, "/")}/components`)
  })

  it("supports an exact alias without a wildcard", () => {
    const tsconfigPath = writeAdminTsconfig(
      JSON.stringify({
        compilerOptions: { paths: { "@/hooks": ["./hooks/index.ts"] } },
      })
    )

    const aliases = readTsPathAliases(tsconfigPath)
    const resolved = resolveAlias(aliases, "@/hooks")
    expect(resolved).toBe(`${adminDir.replace(/\\/g, "/")}/hooks/index.ts`)
    // An exact alias must not capture longer ids that share its prefix.
    expect(resolveAlias(aliases, "@/hooks/api")).toBeNull()
  })

  it("keeps the suffix of a pattern like ./src/* -> ./*", () => {
    const tsconfigPath = writeAdminTsconfig(
      JSON.stringify({
        compilerOptions: { paths: { "components/*": ["./components/*"] } },
      })
    )

    const resolved = resolveAlias(
      readTsPathAliases(tsconfigPath),
      "components/table/columns"
    )
    expect(resolved).toBe(
      `${adminDir.replace(/\\/g, "/")}/components/table/columns`
    )
  })

  it("parses tsconfig comments without treating // inside strings as comments", () => {
    const tsconfigPath = writeAdminTsconfig(`{
      // Admin-only aliases, per the docs
      "compilerOptions": {
        "paths": {
          "@/*": ["./*"] /* trailing block comment */
        }
      }
    }`)

    const resolved = resolveAlias(readTsPathAliases(tsconfigPath), "@/hooks/api")
    expect(resolved).toBe(`${adminDir.replace(/\\/g, "/")}/hooks/api`)
  })

  it("returns an empty list for a missing file, invalid JSON, or no paths", () => {
    expect(readTsPathAliases(path.join(adminDir, "tsconfig.json"))).toEqual([])

    expect(readTsPathAliases(writeAdminTsconfig("{ not json"))).toEqual([])

    expect(
      readTsPathAliases(writeAdminTsconfig(JSON.stringify({ compilerOptions: {} })))
    ).toEqual([])
  })
})
