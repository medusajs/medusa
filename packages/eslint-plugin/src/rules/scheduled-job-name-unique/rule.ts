import * as fs from "fs"
import * as path from "path"
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { parse } from "@typescript-eslint/typescript-estree"
import { createRule } from "../../create-rule"
import { findProperty } from "../../util/ast"
import { isIndexFile, toPosix } from "../../util/filename"

type MessageIds = "duplicateName"

const SUPPORTED_EXTENSIONS = [".ts", ".tsx", ".js", ".mjs", ".cjs"]

/**
 * Locates the `config` object literal exported from a scheduled-job file by
 * walking the top-level statements. Mirrors `scheduled-job-config-required`'s
 * resolution (object literal directly, or via a local `const` initializer),
 * but works without scope analysis so it can run over a bare parsed AST from
 * another file on disk.
 *
 * Handles:
 * - `export const config = { ... }`
 * - `export const config = base` (where `const base = { ... }`)
 * - `const config = { ... }; export { config }`
 * - `const c = { ... }; export { c as config }`
 *
 * Skips re-exports (`export { config } from "./x"`) — unresolvable locally.
 */
function findConfigObject(
  body: TSESTree.ProgramStatement[]
): TSESTree.ObjectExpression | null {
  const localObjects = new Map<string, TSESTree.ObjectExpression>()

  for (const stmt of body) {
    const decl =
      stmt.type === AST_NODE_TYPES.ExportNamedDeclaration && stmt.declaration
        ? stmt.declaration
        : stmt
    if (decl.type !== AST_NODE_TYPES.VariableDeclaration) {
      continue
    }
    for (const d of decl.declarations) {
      if (
        d.id.type === AST_NODE_TYPES.Identifier &&
        d.init?.type === AST_NODE_TYPES.ObjectExpression
      ) {
        localObjects.set(d.id.name, d.init)
      }
    }
  }

  const resolve = (
    node: TSESTree.Node | null | undefined
  ): TSESTree.ObjectExpression | null => {
    if (!node) {
      return null
    }
    if (node.type === AST_NODE_TYPES.ObjectExpression) {
      return node
    }
    if (node.type === AST_NODE_TYPES.Identifier) {
      return localObjects.get(node.name) ?? null
    }
    return null
  }

  for (const stmt of body) {
    if (stmt.type !== AST_NODE_TYPES.ExportNamedDeclaration) {
      continue
    }

    if (stmt.declaration?.type === AST_NODE_TYPES.VariableDeclaration) {
      for (const d of stmt.declaration.declarations) {
        if (d.id.type === AST_NODE_TYPES.Identifier && d.id.name === "config") {
          const resolved = resolve(d.init)
          if (resolved) {
            return resolved
          }
        }
      }
    }

    if (stmt.source) {
      // Re-export from another module — can't resolve locally.
      continue
    }

    for (const spec of stmt.specifiers) {
      if (
        spec.exported.type === AST_NODE_TYPES.Identifier &&
        spec.exported.name === "config" &&
        spec.local.type === AST_NODE_TYPES.Identifier
      ) {
        const resolved = resolve(spec.local)
        if (resolved) {
          return resolved
        }
      }
    }
  }

  return null
}

/**
 * Returns the `name` property's string-literal value and the literal node from
 * a job file's `config` export, or `null` when there is no resolvable config,
 * no `name` property, or the `name` value isn't a plain string literal.
 */
function getConfigName(
  program: TSESTree.Program
): { value: string; node: TSESTree.Node } | null {
  const config = findConfigObject(program.body)
  if (!config) {
    return null
  }

  const prop = findProperty(config, "name")
  if (!prop) {
    return null
  }

  if (
    prop.value.type === AST_NODE_TYPES.Literal &&
    typeof prop.value.value === "string"
  ) {
    return { value: prop.value.value, node: prop.value }
  }
  return null
}

/**
 * Given a job file path, returns the nearest ancestor `jobs/` directory (the
 * project's scheduled-jobs root), or `null` when the file isn't under one.
 */
function locateJobsRoot(filename: string): string | null {
  const posix = toPosix(filename)
  const idx = posix.lastIndexOf("/jobs/")
  if (idx === -1) {
    return null
  }
  return posix.slice(0, idx + "/jobs".length)
}

/** Recursively collects all supported job-file paths under `root`. */
function collectJobFiles(root: string): string[] {
  const out: string[] = []
  const walk = (dir: string): void => {
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const abs = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === "node_modules") {
          continue
        }
        walk(abs)
      } else if (
        entry.isFile() &&
        SUPPORTED_EXTENSIONS.includes(path.extname(entry.name))
      ) {
        out.push(toPosix(abs))
      }
    }
  }
  walk(root)
  return out
}

/** Parses a job file from disk and extracts its `config.name`, if any. */
function extractNameFromFile(filePath: string): string | null {
  let source: string
  try {
    source = fs.readFileSync(filePath, "utf8")
  } catch {
    return null
  }

  let ast: TSESTree.Program
  try {
    ast = parse(source, {
      jsx: filePath.endsWith("x"),
      loc: false,
      range: false,
    }) as unknown as TSESTree.Program
  } catch {
    return null
  }

  return getConfigName(ast)?.value ?? null
}

export const rule = createRule<[], MessageIds>({
  name: "scheduled-job-name-unique",
  meta: {
    type: "problem",
    docs: {
      description:
        "Scheduled job `config.name` must be unique across all scheduled jobs in the project.",
    },
    messages: {
      duplicateName:
        "Scheduled job name \"{{name}}\" is already used by another job ({{otherFile}}). Each scheduled job must have a unique `name`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    return {
      "Program:exit"(node: TSESTree.Program) {
        const filename = context.filename
        if (!filename || filename.startsWith("<")) {
          return
        }
        // `index.<ext>` barrels in a jobs directory aren't job definitions.
        if (isIndexFile(filename)) {
          return
        }

        const current = getConfigName(sourceCode.ast ?? node)
        if (!current) {
          return
        }

        const jobsRoot = locateJobsRoot(filename)
        if (!jobsRoot) {
          return
        }

        const currentPath = toPosix(path.resolve(filename))

        for (const otherPath of collectJobFiles(jobsRoot)) {
          if (toPosix(path.resolve(otherPath)) === currentPath) {
            continue
          }
          if (extractNameFromFile(otherPath) === current.value) {
            context.report({
              node: current.node,
              messageId: "duplicateName",
              data: {
                name: current.value,
                otherFile: path.relative(jobsRoot, otherPath) || otherPath,
              },
            })
            // One report is enough — the conflict is established.
            break
          }
        }
      },
    }
  },
})

export default rule
