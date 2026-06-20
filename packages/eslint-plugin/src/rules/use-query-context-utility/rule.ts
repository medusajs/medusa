import type { TSESTree, TSESLint } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"

type MessageIds = "useQueryContext"

const QUERY_CONTEXT = "QueryContext"
const QUERY_METHODS: ReadonlySet<string> = new Set(["graph", "index"])

function isQueryReceiver(node: TSESTree.Expression): boolean {
  if (node.type === AST_NODE_TYPES.Identifier && node.name === "query") {
    return true
  }
  if (
    node.type === AST_NODE_TYPES.MemberExpression &&
    !node.computed &&
    node.property.type === AST_NODE_TYPES.Identifier &&
    node.property.name === "query"
  ) {
    return true
  }
  return false
}

function getContextProperty(
  arg: TSESTree.CallExpressionArgument | undefined
): TSESTree.Property | null {
  if (!arg) {
    return null
  }
  if (arg.type !== AST_NODE_TYPES.ObjectExpression) {
    return null
  }
  for (const prop of arg.properties) {
    if (prop.type !== AST_NODE_TYPES.Property) {
      continue
    }
    if (prop.computed) {
      continue
    }
    const key = prop.key
    if (key.type === AST_NODE_TYPES.Identifier && key.name === "context") {
      return prop
    }
    if (key.type === AST_NODE_TYPES.Literal && key.value === "context") {
      return prop
    }
  }
  return null
}

export const rule = createRule<[], MessageIds>({
  name: "use-query-context-utility",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Wrap `context` arguments to `query.graph` / `query.index` with `QueryContext(...)` from `@medusajs/framework/utils`.",
    },
    fixable: "code",
    messages: {
      useQueryContext:
        "Wrap the `context` value with `QueryContext(...)` from `@medusajs/framework/utils`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const queryContextLocalNames = new Set<string>()
    let frameworkUtilsImportNode: TSESTree.ImportDeclaration | null = null

    function addQueryContextImport(
      fixer: TSESLint.RuleFixer
    ): TSESLint.RuleFix | null {
      if (frameworkUtilsImportNode) {
        const specifiers = frameworkUtilsImportNode.specifiers.filter(
          (s): s is TSESTree.ImportSpecifier =>
            s.type === AST_NODE_TYPES.ImportSpecifier
        )
        if (specifiers.length === 0) {
          return null
        }
        const last = specifiers[specifiers.length - 1]
        return fixer.insertTextAfter(last, `, ${QUERY_CONTEXT}`)
      }
      const program = context.sourceCode.ast
      const first = program.body[0]
      const importLine = `import { ${QUERY_CONTEXT} } from "${FRAMEWORK_UTILS_SOURCE}"\n`
      if (!first) {
        return fixer.insertTextAfterRange([0, 0], importLine)
      }
      return fixer.insertTextBefore(first, importLine)
    }

    function checkArg(arg: TSESTree.CallExpressionArgument | undefined): void {
      const contextProp = getContextProperty(arg)
      if (!contextProp) {
        return
      }
      const value = contextProp.value
      if (value.type !== AST_NODE_TYPES.ObjectExpression) {
        return
      }

      context.report({
        node: value,
        messageId: "useQueryContext",
        fix(fixer) {
          const fixes: TSESLint.RuleFix[] = []
          const localName =
            queryContextLocalNames.size > 0
              ? (queryContextLocalNames.values().next().value as string)
              : QUERY_CONTEXT
          const source = context.sourceCode.getText(value)
          fixes.push(fixer.replaceText(value, `${localName}(${source})`))
          if (queryContextLocalNames.size === 0) {
            const importFix = addQueryContextImport(fixer)
            if (!importFix) {
              return null
            }
            fixes.push(importFix)
            queryContextLocalNames.add(QUERY_CONTEXT)
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
        frameworkUtilsImportNode = node
        for (const specifier of node.specifiers) {
          if (
            specifier.type === AST_NODE_TYPES.ImportSpecifier &&
            specifier.imported.type === AST_NODE_TYPES.Identifier &&
            specifier.imported.name === QUERY_CONTEXT
          ) {
            queryContextLocalNames.add(specifier.local.name)
          }
        }
      },

      CallExpression(node) {
        const callee = node.callee
        if (callee.type !== AST_NODE_TYPES.MemberExpression) {
          return
        }
        if (callee.computed) {
          return
        }
        if (callee.property.type !== AST_NODE_TYPES.Identifier) {
          return
        }
        if (!QUERY_METHODS.has(callee.property.name)) {
          return
        }
        if (!isQueryReceiver(callee.object)) {
          return
        }

        checkArg(node.arguments[0])
        checkArg(node.arguments[1])
      },
    }
  },
})

export default rule
