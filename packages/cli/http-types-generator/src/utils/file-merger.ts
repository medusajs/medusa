import { readFileSync } from "fs"
import { Formatter } from "./formatter"
import type { EmittedInterface } from "../core/type-emitter"
import { TypeEmitter } from "../core/type-emitter"
import type { ImportTracker } from "../core/import-tracker"

interface ParsedImport {
  isType: boolean
  names: string[]
  source: string
}

export type MergeStatus = "created" | "updated" | "skipped" | "overwritten"

export interface MergeResult {
  content: string
  status: MergeStatus
  /** Number of interfaces added (0 for skipped/overwritten) */
  added: number
}

/**
 * Decides whether to create, merge, or overwrite a type file.
 */
export class FileMerger {
  /**
   * Decides whether to create, merge, or overwrite a type file.
   *
   * - File does not exist → create (write all interfaces)
   * - File exists + `force` → overwrite (write all interfaces, replacing existing)
   * - File exists, not `force` → merge: add only interfaces not already declared
   *
   * Returns the final file content plus a status code.
   */
  async resolveFileContent(
    file: string,
    interfaces: EmittedInterface[],
    importTracker: ImportTracker,
    force: boolean
  ): Promise<MergeResult> {
    const raw = TypeEmitter.assembleFile(interfaces, importTracker, file)
    const generated = raw

    const { existsSync } = await import("fs")
    if (!existsSync(file)) {
      const content = await Formatter.format(generated, file)
      return { content, status: "created", added: interfaces.length }
    }

    if (force) {
      const content = await Formatter.format(generated, file)
      return { content, status: "overwritten", added: interfaces.length }
    }

    const existingContent = readFileSync(file, "utf-8")
    const existingBlocks = this.extractInterfaceBlocks(existingContent)

    const newInterfaces = interfaces.filter(
      ({ name }) => !existingBlocks.has(name)
    )

    if (newInterfaces.length === 0) {
      return { content: existingContent, status: "skipped", added: 0 }
    }

    const generatedBlocks = this.extractInterfaceBlocks(generated)

    const existingBodyLines = existingContent
      .split("\n")
      .filter((l) => !l.trim().startsWith("import "))

    const newBlocks = newInterfaces
      .map(({ name }) => generatedBlocks.get(name) ?? "")
      .filter(Boolean)

    const existingImportLines = this.extractImportLines(existingContent)
    const generatedImportLines = this.extractImportLines(generated)
    const mergedImports = this.mergeImportLines(
      existingImportLines,
      generatedImportLines
    )

    const parts: string[] = []
    if (mergedImports.length > 0) {
      parts.push(mergedImports.join("\n"))
      parts.push("")
    }
    parts.push(existingBodyLines.join("\n").trimStart())
    parts.push("")
    parts.push(newBlocks.join("\n\n"))

    const merged = parts.join("\n")
    const content = await Formatter.format(merged, file)
    return { content, status: "updated", added: newInterfaces.length }
  }

  /**
   * Parses a named import line of the form:
   *   `import { A, B } from "source"`
   *   `import type { A, B } from "source"`
   *
   * Returns null for default imports, side-effect imports, or anything else.
   */
  private parseImportLine(line: string): ParsedImport | null {
    const typeRe = /^import\s+type\s+\{\s*([^}]+)\}\s+from\s+["']([^"']+)["']/
    const normalRe = /^import\s+\{\s*([^}]+)\}\s+from\s+["']([^"']+)["']/

    const typeMatch = line.trim().match(typeRe)
    const normalMatch = line.trim().match(normalRe)
    const m = typeMatch ?? normalMatch
    if (!m) return null

    return {
      isType: !!typeMatch,
      names: m[1]
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean),
      source: m[2],
    }
  }

  /**
   * Merges two sets of import lines, combining named imports for the same
   * source so we never emit duplicate import statements.
   */
  private mergeImportLines(
    existingLines: string[],
    newLines: string[]
  ): string[] {
    const map = new Map<string, { isType: boolean; names: Set<string> }>()
    const unparseable: string[] = []

    const process = (line: string) => {
      const t = line.trim()
      if (!t) return
      const parsed = this.parseImportLine(t)
      if (!parsed) {
        if (t.startsWith("import ") && !unparseable.includes(t)) {
          unparseable.push(t)
        }
        return
      }
      const key = `${parsed.isType ? "type:" : ""}${parsed.source}`
      if (!map.has(key)) {
        map.set(key, { isType: parsed.isType, names: new Set() })
      }
      for (const name of parsed.names) {
        map.get(key)!.names.add(name)
      }
    }

    for (const l of existingLines) process(l)
    for (const l of newLines) process(l)

    const result: string[] = []
    for (const [key, { isType, names }] of map) {
      const source = key.replace(/^type:/, "")
      const namesList = [...names].sort().join(", ")
      result.push(
        `${isType ? "import type" : "import"} { ${namesList} } from "${source}"`
      )
    }

    result.push(...unparseable)
    return result
  }

  /**
   * Scans `content` for interface and type alias declarations and returns a map
   * from name to the full block text.
   *
   * Matches all four forms so that hand-written declarations are never
   * duplicated by the generator regardless of their export/keyword variant:
   *   - `export interface Foo { ... }`
   *   - `export type Foo = { ... }`
   *   - `interface Foo { ... }`       (non-exported, e.g. internal helpers)
   *   - `type Foo = { ... }`          (non-exported type alias)
   */
  private extractInterfaceBlocks(content: string): Map<string, string> {
    const blocks = new Map<string, string>()
    const lines = content.split("\n")
    let i = 0

    while (i < lines.length) {
      const m = lines[i].match(/^(?:export\s+)?(?:interface|type)\s+(\w+)/)
      if (m) {
        const name = m[1]
        let block = ""
        let depth = 0

        while (i < lines.length) {
          const line = lines[i]
          block += line + "\n"
          depth +=
            (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length
          i++
          if (depth === 0 && block.trim()) break
        }

        blocks.set(name, block.trimEnd())
      } else {
        i++
      }
    }

    return blocks
  }

  /**
   * Extracts all `import ...` lines from the file content.
   */
  private extractImportLines(content: string): string[] {
    return content
      .split("\n")
      .filter((l) => l.trim().startsWith("import "))
  }
}
