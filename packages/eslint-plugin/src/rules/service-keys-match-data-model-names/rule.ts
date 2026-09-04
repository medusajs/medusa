import * as fs from "fs"
import * as path from "path"
import type { TSESLint } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { parse } from "@typescript-eslint/typescript-estree"
import { createRule } from "../../create-rule"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"
import {
  findVariableInScope,
  getPropertyKeyName,
  resolveObjectExpression,
} from "../../util/ast"
import {
  createMedusaServiceBindings,
  trackMedusaServiceImports,
} from "../../util/service-scope"
import { dmlNameToServiceKey } from "../../util/strings"

type MessageIds = "serviceKeyMismatch"

const MODEL_IMPORT = "model"
const DEFINE_METHOD = "define"
const RESOLVABLE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]
const VALID_IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/

type ImportBinding = { importedName: string; source: string }

/**
 * `model.define(...)`/export-shape matchers below run over two different ASTs:
 * the live file under lint (real `TSESTree` nodes from `context`) and a sibling
 * file read from disk and re-parsed with `typescript-estree` directly. That
 * second parse resolves through this package's own nested `@typescript-eslint/
 * types` copy, which TypeScript treats as a distinct (structurally identical)
 * type from the one `@typescript-eslint/utils` re-exports — so these matchers
 * take plain `any`, the same workaround `loader-must-be-exported-in-module-
 * definition` and `use-validated-body-or-query` use for the same reason.
 */
type AnyNode = any // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Local names a file's own `ImportDeclaration`s bind `model` to via
 * `import { model } from "@medusajs/framework/utils"`.
 */
function collectModelLocalNames(body: readonly AnyNode[]): Set<string> {
  const names = new Set<string>()
  for (const node of body) {
    if (node.type !== AST_NODE_TYPES.ImportDeclaration) {
      continue
    }
    if (node.source.value !== FRAMEWORK_UTILS_SOURCE) {
      continue
    }
    for (const spec of node.specifiers) {
      if (
        spec.type === AST_NODE_TYPES.ImportSpecifier &&
        spec.imported?.type === AST_NODE_TYPES.Identifier &&
        spec.imported.name === MODEL_IMPORT
      ) {
        names.add(spec.local.name)
      }
    }
  }
  return names
}

/**
 * Walks a `model.define(...).cascades(...).indexes(...)` method chain looking
 * for the base `model.define(...)` call. Descends through call callees and
 * member-expression objects only, mirroring `primary-key-required`'s
 * `chainHasPrimaryKey`.
 */
function findModelDefineCall(
  node: AnyNode,
  modelLocalNames: Set<string>
): AnyNode | null {
  let current: AnyNode = node
  while (current) {
    if (current.type === AST_NODE_TYPES.CallExpression) {
      const callee = current.callee
      if (
        callee.type === AST_NODE_TYPES.MemberExpression &&
        !callee.computed &&
        callee.property.type === AST_NODE_TYPES.Identifier &&
        callee.property.name === DEFINE_METHOD &&
        callee.object.type === AST_NODE_TYPES.Identifier &&
        modelLocalNames.has(callee.object.name)
      ) {
        return current
      }
      current = callee
    } else if (current.type === AST_NODE_TYPES.MemberExpression) {
      current = current.object
    } else {
      return null
    }
  }
  return null
}

/** The literal string name argument of a resolved `model.define(name, schema)` call. */
function getDefineLiteralName(call: AnyNode): string | null {
  const firstArg = call.arguments[0]
  if (
    firstArg &&
    firstArg.type === AST_NODE_TYPES.Literal &&
    typeof firstArg.value === "string"
  ) {
    return firstArg.value
  }
  return null
}

/**
 * Resolves a relative import specifier to a file that exists on disk, trying
 * the specifier as-is, each supported extension appended, and `index.<ext>`
 * inside it (as a directory). Returns `null` for non-relative specifiers
 * (bare packages, tsconfig path aliases) — those can't be resolved without a
 * module resolver, so callers must skip rather than guess.
 */
function resolveModuleFile(fromDir: string, source: string): string | null {
  if (!source.startsWith(".")) {
    return null
  }
  const resolved = path.resolve(fromDir, source)
  const fileCandidates = [
    resolved,
    ...RESOLVABLE_EXTENSIONS.map((ext) => resolved + ext),
  ]
  for (const candidate of fileCandidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate
    }
  }
  for (const ext of RESOLVABLE_EXTENSIONS) {
    const indexCandidate = path.join(resolved, `index${ext}`)
    if (fs.existsSync(indexCandidate) && fs.statSync(indexCandidate).isFile()) {
      return indexCandidate
    }
  }
  return null
}

function parseFile(filePath: string): { body: AnyNode[] } | null {
  let source: string
  try {
    source = fs.readFileSync(filePath, "utf8")
  } catch {
    return null
  }
  try {
    const ast = parse(source, {
      jsx: filePath.endsWith("x"),
      loc: false,
      range: false,
    })
    return { body: ast.body as AnyNode[] }
  } catch {
    return null
  }
}

/**
 * Finds the expression exported as `exportedName` ("default" for a default
 * export) among a parsed file's top-level statements, resolving one further
 * local-identifier hop when the export just re-points at a `const` (e.g.
 * `export default Product` next to `const Product = model.define(...)`).
 *
 * Deliberately does not follow re-exports from another module
 * (`export { X } from "./y"` / `export * from "./y"`) — that would need
 * unbounded cross-file recursion for a pattern the documented custom-module
 * convention doesn't use (models are imported directly, not through a
 * barrel). Returns `null` for those, same as any other "can't tell" case.
 */
function findExportedExpression(
  body: readonly AnyNode[],
  exportedName: string
): AnyNode | null {
  const localConsts = new Map<string, AnyNode>()
  for (const stmt of body) {
    if (stmt.type !== AST_NODE_TYPES.VariableDeclaration) {
      continue
    }
    for (const decl of stmt.declarations) {
      if (decl.id.type === AST_NODE_TYPES.Identifier && decl.init) {
        localConsts.set(decl.id.name, decl.init)
      }
    }
  }

  const resolveIdentifier = (expr: AnyNode): AnyNode => {
    if (expr.type === AST_NODE_TYPES.Identifier) {
      return localConsts.get(expr.name) ?? expr
    }
    return expr
  }

  for (const stmt of body) {
    if (
      exportedName === "default" &&
      stmt.type === AST_NODE_TYPES.ExportDefaultDeclaration
    ) {
      const decl = stmt.declaration
      if (
        decl.type === AST_NODE_TYPES.FunctionDeclaration ||
        decl.type === AST_NODE_TYPES.ClassDeclaration ||
        decl.type === AST_NODE_TYPES.TSInterfaceDeclaration
      ) {
        return null
      }
      return resolveIdentifier(decl)
    }

    if (stmt.type !== AST_NODE_TYPES.ExportNamedDeclaration) {
      continue
    }

    if (stmt.declaration?.type === AST_NODE_TYPES.VariableDeclaration) {
      for (const decl of stmt.declaration.declarations) {
        if (
          decl.id.type === AST_NODE_TYPES.Identifier &&
          decl.id.name === exportedName &&
          decl.init
        ) {
          return decl.init
        }
      }
    }

    if (stmt.source) {
      // Re-export from another module — not followed, see doc comment above.
      continue
    }
    for (const spec of stmt.specifiers) {
      if (
        spec.exported.type === AST_NODE_TYPES.Identifier &&
        spec.exported.name === exportedName
      ) {
        const local = localConsts.get(spec.local.name)
        if (local) {
          return local
        }
      }
    }
  }
  return null
}

/**
 * Resolves the DML name a `MedusaService({ Key: <identifierName> })` value
 * refers to. Tries, in order: a `model.define(...)` bound to that name in the
 * current file's scope, then a relative import resolved to a sibling file on
 * disk. Returns `null` whenever the answer can't be determined statically —
 * callers must treat that as "skip", not "no model".
 */
function resolveDmlName(
  identifierName: string,
  scope: TSESLint.Scope.Scope,
  currentDir: string,
  currentFileModelLocalNames: Set<string>,
  currentFileImports: Map<string, ImportBinding>
): string | null {
  const variable = findVariableInScope(scope, identifierName)
  if (variable) {
    for (const def of variable.defs) {
      if (
        def.node.type === AST_NODE_TYPES.VariableDeclarator &&
        def.node.init
      ) {
        const call = findModelDefineCall(
          def.node.init,
          currentFileModelLocalNames
        )
        if (call) {
          return getDefineLiteralName(call)
        }
      }
    }
  }

  const importBinding = currentFileImports.get(identifierName)
  if (!importBinding) {
    return null
  }
  const targetPath = resolveModuleFile(currentDir, importBinding.source)
  if (!targetPath) {
    return null
  }
  const targetProgram = parseFile(targetPath)
  if (!targetProgram) {
    return null
  }
  const modelExpr = findExportedExpression(
    targetProgram.body,
    importBinding.importedName
  )
  if (!modelExpr) {
    return null
  }
  const targetModelLocalNames = collectModelLocalNames(targetProgram.body)
  const call = findModelDefineCall(modelExpr, targetModelLocalNames)
  if (!call) {
    return null
  }
  return getDefineLiteralName(call)
}

export const rule = createRule<[], MessageIds>({
  name: "service-keys-match-data-model-names",
  meta: {
    type: "problem",
    docs: {
      description:
        "The keys passed to `MedusaService({ Key: Model })` must match the PascalCase name produced by the model's `model.define(name, ...)` call.",
    },
    messages: {
      serviceKeyMismatch:
        'MedusaService key "{{key}}" does not match the name "{{expectedName}}" that `model.define("{{dmlName}}", ...)` produces for this model. `MedusaService` builds its method names from the object key, but the query graph resolves them from the model\'s own name — a mismatch works everywhere except `query.graph()`. Rename the key to "{{expectedName}}".',
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    if (!filename || filename.startsWith("<")) {
      return {}
    }
    const currentDir = path.dirname(filename)

    const medusaServiceBindings = createMedusaServiceBindings()
    const modelLocalNames = new Set<string>()
    const importBindings = new Map<string, ImportBinding>()

    return {
      ImportDeclaration(node) {
        trackMedusaServiceImports(node, medusaServiceBindings)

        if (node.source.value === FRAMEWORK_UTILS_SOURCE) {
          for (const spec of node.specifiers) {
            if (
              spec.type === AST_NODE_TYPES.ImportSpecifier &&
              spec.imported.type === AST_NODE_TYPES.Identifier &&
              spec.imported.name === MODEL_IMPORT
            ) {
              modelLocalNames.add(spec.local.name)
            }
          }
        }

        const source = node.source.value
        for (const spec of node.specifiers) {
          if (
            spec.type === AST_NODE_TYPES.ImportSpecifier &&
            spec.imported.type === AST_NODE_TYPES.Identifier
          ) {
            importBindings.set(spec.local.name, {
              importedName: spec.imported.name,
              source,
            })
          } else if (spec.type === AST_NODE_TYPES.ImportDefaultSpecifier) {
            importBindings.set(spec.local.name, {
              importedName: "default",
              source,
            })
          }
        }
      },

      CallExpression(node) {
        const callee = node.callee
        if (
          callee.type !== AST_NODE_TYPES.Identifier ||
          !medusaServiceBindings.medusaService.has(callee.name)
        ) {
          return
        }

        const scope = context.sourceCode.getScope(node)
        const modelsObject = resolveObjectExpression(node.arguments[0], scope)
        if (!modelsObject) {
          return
        }

        for (const prop of modelsObject.properties) {
          if (prop.type !== AST_NODE_TYPES.Property) {
            continue
          }
          const keyName = getPropertyKeyName(prop)
          if (!keyName) {
            continue
          }

          const value = prop.value
          let dmlName: string | null = null

          if (value.type === AST_NODE_TYPES.Identifier) {
            dmlName = resolveDmlName(
              value.name,
              scope,
              currentDir,
              modelLocalNames,
              importBindings
            )
          } else {
            const call = findModelDefineCall(value, modelLocalNames)
            if (call) {
              dmlName = getDefineLiteralName(call)
            }
          }

          if (dmlName === null) {
            continue
          }

          const expectedName = dmlNameToServiceKey(dmlName)
          if (expectedName === keyName) {
            continue
          }

          const canFix =
            VALID_IDENTIFIER_RE.test(expectedName) &&
            !modelsObject.properties.some(
              (p) =>
                p !== prop &&
                p.type === AST_NODE_TYPES.Property &&
                getPropertyKeyName(p) === expectedName
            )

          context.report({
            node: prop.key,
            messageId: "serviceKeyMismatch",
            data: { key: keyName, dmlName, expectedName },
            fix: canFix
              ? (fixer) => {
                  if (
                    prop.shorthand &&
                    value.type === AST_NODE_TYPES.Identifier
                  ) {
                    return fixer.replaceText(
                      prop,
                      `${expectedName}: ${value.name}`
                    )
                  }
                  return fixer.replaceText(prop.key, expectedName)
                }
              : null,
          })
        }
      },
    }
  },
})

export default rule
