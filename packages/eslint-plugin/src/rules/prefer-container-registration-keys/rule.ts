import type { TSESTree, TSESLint } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"
import { isResolveCallee } from "../../util/container"

type MessageIds = "preferRegistrationKey"

const CONTAINER_REGISTRATION_KEYS = "ContainerRegistrationKeys"

/**
 * Map of known registration-key string values → enum member name.
 * Sourced from `packages/core/utils/src/common/container.ts`.
 * `"remoteLink"` is intentionally omitted — it's deprecated and handled by
 * `prefer-link-over-remote-link`.
 */
const KEYS_BY_VALUE: Record<string, string> = {
  query: "QUERY",
  link: "LINK",
  logger: "LOGGER",
  manager: "MANAGER",
  configModule: "CONFIG_MODULE",
  remoteQuery: "REMOTE_QUERY",
  __pg_connection__: "PG_CONNECTION",
  featureFlagRouter: "FEATURE_FLAG_ROUTER",
}

export const rule = createRule<[], MessageIds>({
  name: "prefer-container-registration-keys",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer `ContainerRegistrationKeys.*` members over magic strings in `resolve(...)` calls.",
    },
    fixable: "code",
    messages: {
      preferRegistrationKey:
        "Use `ContainerRegistrationKeys.{{enumMember}}` instead of the magic string `{{key}}`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const keysLocalNames = new Set<string>()
    let frameworkUtilsImportNode: TSESTree.ImportDeclaration | null = null

    function addKeysImport(fixer: TSESLint.RuleFixer): TSESLint.RuleFix | null {
      if (frameworkUtilsImportNode) {
        const specifiers = frameworkUtilsImportNode.specifiers.filter(
          (s): s is TSESTree.ImportSpecifier =>
            s.type === AST_NODE_TYPES.ImportSpecifier
        )
        if (specifiers.length === 0) {
          return null
        }
        const last = specifiers[specifiers.length - 1]
        return fixer.insertTextAfter(last, `, ${CONTAINER_REGISTRATION_KEYS}`)
      }
      const program = context.sourceCode.ast
      const first = program.body[0]
      const importLine = `import { ${CONTAINER_REGISTRATION_KEYS} } from "${FRAMEWORK_UTILS_SOURCE}"\n`
      if (!first) {
        return fixer.insertTextAfterRange([0, 0], importLine)
      }
      return fixer.insertTextBefore(first, importLine)
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
            specifier.imported.name === CONTAINER_REGISTRATION_KEYS
          ) {
            keysLocalNames.add(specifier.local.name)
          }
        }
      },

      CallExpression(node) {
        if (!isResolveCallee(node.callee)) {
          return
        }
        const arg = node.arguments[0]
        if (!arg) {
          return
        }
        if (arg.type !== AST_NODE_TYPES.Literal) {
          return
        }
        if (typeof arg.value !== "string") {
          return
        }
        const enumMember = KEYS_BY_VALUE[arg.value]
        if (!enumMember) {
          return
        }

        context.report({
          node: arg,
          messageId: "preferRegistrationKey",
          data: { key: arg.value, enumMember },
          fix(fixer) {
            const fixes: TSESLint.RuleFix[] = []
            const localName =
              keysLocalNames.size > 0
                ? (keysLocalNames.values().next().value as string)
                : CONTAINER_REGISTRATION_KEYS
            fixes.push(fixer.replaceText(arg, `${localName}.${enumMember}`))
            if (keysLocalNames.size === 0) {
              const importFix = addKeysImport(fixer)
              if (!importFix) {
                return null
              }
              fixes.push(importFix)
              keysLocalNames.add(CONTAINER_REGISTRATION_KEYS)
            }
            return fixes
          },
        })
      },
    }
  },
})

export default rule
