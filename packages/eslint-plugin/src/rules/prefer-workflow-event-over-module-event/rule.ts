import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { FRAMEWORK_UTILS_SOURCE, MODULES_BY_VALUE } from "../../constants"
import {
  findProperty,
  resolveObjectExpression,
  unwrapTsExpression,
} from "../../util/ast"

type MessageIds = "preferWorkflowEvent" | "internalModuleEvent"

const MODULE_EVENT_MAP = buildModuleEventMap()

export const rule = createRule<[], MessageIds>({
  name: "prefer-workflow-event-over-module-event",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "In a subscriber's `config.event`, prefer workflow event enums (`*WorkflowEvents`) over the equivalent internal module-level events.",
    },
    fixable: "code",
    messages: {
      preferWorkflowEvent:
        "`{{source}}` is an internal module event. Subscribe to the workflow event `{{target}}` instead.",
      internalModuleEvent:
        "`{{source}}` is an internal module event with no public workflow-event equivalent. Confirm you mean to subscribe to an internal event, as these are implementation details and may change.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (MODULE_EVENT_MAP.size === 0) {
      return {}
    }

    const sourceCode = context.sourceCode

    // local binding -> imported name
    // e.g. `PE -> ProductEvents` for `import { ProductEvents as PE }`.
    const importedLocals = new Map<string, string>()
    // Imported names already present, so the fix skips a duplicate import.
    const importedUtilsNames = new Set<string>()
    // `import * as utils` -> `utils`.
    const namespaceLocals = new Set<string>()

    // Workflow enums whose import this fix pass already queued.
    const addedWorkflowImports = new Set<string>()

    // A named framework/utils import the fix can append workflow enums to.
    let utilsImportDecl: TSESTree.ImportDeclaration | null = null
    // The resolved subscriber `config` object, checked on `Program:exit`.
    let configObject: TSESTree.ObjectExpression | null = null

    /**
     * Ensure the workflow `enumName` is imported from framework/utils, appending
     * to an existing named import when there is one, otherwise inserting a fresh
     * import at the top of the file. Returns `null` when it is already imported
     * (or another fix in this pass already queued it).
     */
    function ensureWorkflowImport(
      fixer: TSESLint.RuleFixer,
      enumName: string
    ): TSESLint.RuleFix | null {
      if (
        importedUtilsNames.has(enumName) ||
        addedWorkflowImports.has(enumName)
      ) {
        return null
      }
      addedWorkflowImports.add(enumName)

      const specifiers = utilsImportDecl?.specifiers.filter(
        (s): s is TSESTree.ImportSpecifier =>
          s.type === AST_NODE_TYPES.ImportSpecifier
      )
      const last = specifiers?.[specifiers.length - 1]
      if (last) {
        return fixer.insertTextAfter(last, `, ${enumName}`)
      }
      return fixer.insertTextBeforeRange(
        [0, 0],
        `import { ${enumName} } from "${FRAMEWORK_UTILS_SOURCE}"\n`
      )
    }

    /** Check one entry of the subscriber `config.event` value. */
    function checkEventExpression(node: TSESTree.Expression): void {
      const expr = unwrapTsExpression(node)
      const resolved = normalizeEnum(expr, importedLocals, namespaceLocals)
      if (!resolved) {
        return
      }
      const replacement = MODULE_EVENT_MAP.get(resolved.key)
      // undefined -> not an internal module event, ignore
      if (replacement === undefined) {
        return
      }

      const source = sourceCode.getText(expr)
      if (replacement === null) {
        context.report({
          node: expr,
          messageId: "internalModuleEvent",
          data: { source },
        })
        return
      }

      context.report({
        node: expr,
        messageId: "preferWorkflowEvent",
        data: { source, target: replacement },
        fix(fixer) {
          // Namespace form keeps its prefix and reaches the enum through the
          // existing `utils` binding, so it needs no import.
          if (resolved.namespace) {
            return fixer.replaceText(
              expr,
              `${resolved.namespace}.${replacement}`
            )
          }
          const fixes: TSESLint.RuleFix[] = [
            fixer.replaceText(expr, replacement),
          ]
          const enumName = replacement.slice(0, replacement.indexOf("."))
          const importFix = ensureWorkflowImport(fixer, enumName)
          if (importFix) {
            fixes.push(importFix)
          }
          return fixes
        },
      })
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value !== FRAMEWORK_UTILS_SOURCE) {
          return
        }
        for (const specifier of node.specifiers) {
          if (
            specifier.type === AST_NODE_TYPES.ImportSpecifier &&
            specifier.imported.type === AST_NODE_TYPES.Identifier
          ) {
            // `{ ProductEvents as PE }`: `PE -> ProductEvents`.
            // `{ ProductEvents }`: `ProductEvents -> ProductEvents`.
            importedUtilsNames.add(specifier.imported.name)
            importedLocals.set(specifier.local.name, specifier.imported.name)
            // Has named specifiers, so the fix can append into it.
            utilsImportDecl ??= node
          } else if (
            specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier
          ) {
            namespaceLocals.add(specifier.local.name)
          }
        }
      },

      // Capture the subscriber `config` object, from either
      // `export const config = { ... }` or `export { config }`.
      ExportNamedDeclaration(node) {
        if (
          node.declaration &&
          node.declaration.type === AST_NODE_TYPES.VariableDeclaration
        ) {
          for (const decl of node.declaration.declarations) {
            if (
              decl.id.type === AST_NODE_TYPES.Identifier &&
              decl.id.name === "config"
            ) {
              const resolved = resolveObjectExpression(
                decl.init,
                sourceCode.getScope(node)
              )
              if (resolved) {
                configObject = resolved
              }
            }
          }
        }

        for (const spec of node.specifiers) {
          if (
            spec.exported.type !== AST_NODE_TYPES.Identifier ||
            spec.exported.name !== "config" ||
            node.source
          ) {
            continue
          }
          const resolved = resolveObjectExpression(
            spec.local,
            sourceCode.getScope(node)
          )
          if (resolved) {
            configObject = resolved
          }
        }
      },

      // Deferred to the end so imports and the `config` object are both known.
      "Program:exit"() {
        if (!configObject) {
          return
        }
        const eventProp = findProperty(configObject, "event")
        if (!eventProp) {
          return
        }
        const value = eventProp.value
        if (value.type === AST_NODE_TYPES.ArrayExpression) {
          for (const entry of value.elements) {
            if (entry && entry.type !== AST_NODE_TYPES.SpreadElement) {
              checkEventExpression(entry)
            }
          }
          return
        }
        // Ignore non-expression shapes (`AssignmentPattern`, empty-body method)
        // that can't be an event name.
        if (
          value.type !== AST_NODE_TYPES.AssignmentPattern &&
          value.type !== AST_NODE_TYPES.TSEmptyBodyFunctionExpression
        ) {
          checkEventExpression(value)
        }
      },
    }
  },
})

export default rule

/**
 * Build a map of internal module events to their workflow-event equivalent, if any.
 * Only enums whose value is in the internal `{module}.{data-model}.{action}`
 * form are included.
 */
function buildModuleEventMap(): Map<string, string | null> {
  const map = new Map<string, string | null>()
  const exports = require(FRAMEWORK_UTILS_SOURCE)
  if (!exports) {
    return map
  }

  const isEnumObject = (value: unknown): value is Record<string, unknown> =>
    !!value && typeof value === "object"

  const moduleValues = new Set(Object.keys(MODULES_BY_VALUE))

  // workflow event value -> `WorkflowEnum.MEMBER`, e.g.
  // `product-category.deleted` -> `ProductCategoryWorkflowEvents.DELETED`.
  const workflowByValue = new Map<string, string>(
    Object.entries(exports)
      .filter(
        ([enumName, enumObj]) =>
          enumName.endsWith("WorkflowEvents") && isEnumObject(enumObj)
      )
      .flatMap(([enumName, enumObj]) =>
        Object.entries(enumObj as Record<string, string>).map(
          ([member, value]) => [value, `${enumName}.${member}`]
        )
      )
  )

  for (const [enumName, enumObj] of Object.entries(exports)) {
    if (!enumName.endsWith("Events") || enumName.endsWith("WorkflowEvents")) {
      continue
    }
    if (!isEnumObject(enumObj)) {
      continue
    }
    for (const [member, value] of Object.entries(enumObj)) {
      if (typeof value !== "string") {
        continue
      }
      // Internal service events are `{module}.{data-model}.{action}`
      const parts = value.split(".")
      if (parts.length < 3 || !moduleValues.has(parts[0])) {
        continue
      }
      const replacement = workflowByValue.get(parts.slice(1).join(".")) ?? null
      map.set(`${enumName}.${member}`, replacement)
      map.set(value, replacement)
    }
  }

  return map
}

/**
 * - `"order.placed"`              -> literal value key, no namespace
 * - `ProductEvents.PROD...`       -> `ProductEvents.PRODUCT_CATEGORY_DELETED`, no namespace
 * - `utils.ProductEvents.PROD...` -> same key, namespace `utils`
 *
 * Returns `null` otherwise
 */
function normalizeEnum(
  node: TSESTree.Expression,
  importedLocals: Map<string, string>,
  namespaceLocals: Set<string>
): { key: string; namespace: string | null } | null {
  if (node.type === AST_NODE_TYPES.Literal && typeof node.value === "string") {
    return { key: node.value, namespace: null }
  }
  if (node.type !== AST_NODE_TYPES.MemberExpression) {
    return null
  }
  const member = memberName(node)
  if (!member) {
    return null
  }
  const object = node.object
  // `PE.MEMBER` -> resolve `PE` to its imported enum name.
  if (object.type === AST_NODE_TYPES.Identifier) {
    const canonical = importedLocals.get(object.name)
    return canonical ? { key: `${canonical}.${member}`, namespace: null } : null
  }
  // `utils.ProductEvents.MEMBER` -> the middle property is the enum name.
  if (
    object.type === AST_NODE_TYPES.MemberExpression &&
    !object.computed &&
    object.object.type === AST_NODE_TYPES.Identifier &&
    namespaceLocals.has(object.object.name) &&
    object.property.type === AST_NODE_TYPES.Identifier
  ) {
    return {
      key: `${object.property.name}.${member}`,
      namespace: object.object.name,
    }
  }
  return null
}

/** The accessed member, from `Enum.MEMBER` or `Enum["MEMBER"]`. */
function memberName(node: TSESTree.MemberExpression): string | null {
  if (!node.computed && node.property.type === AST_NODE_TYPES.Identifier) {
    return node.property.name
  }
  if (
    node.computed &&
    node.property.type === AST_NODE_TYPES.Literal &&
    typeof node.property.value === "string"
  ) {
    return node.property.value
  }
  return null
}
