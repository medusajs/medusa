import type { TSESTree, TSESLint } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  FRAMEWORK_UTILS_SOURCE,
  MODULES_BY_VALUE,
  MODULES_ENUM,
} from "../../constants"
import { isResolveCallee } from "../../util/container"

type MessageIds = "preferModulesEnum"

export const rule = createRule<[], MessageIds>({
  name: "prefer-modules-enum",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer `Modules.*` enum members over magic module-name strings in `resolve(...)` calls.",
    },
    fixable: "code",
    messages: {
      preferModulesEnum:
        "Use `Modules.{{enumMember}}` instead of the magic string `{{key}}`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const modulesLocalNames = new Set<string>()
    let frameworkUtilsImportNode: TSESTree.ImportDeclaration | null = null

    function addModulesImport(
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
        return fixer.insertTextAfter(last, `, ${MODULES_ENUM}`)
      }
      const program = context.sourceCode.ast
      const first = program.body[0]
      const importLine = `import { ${MODULES_ENUM} } from "${FRAMEWORK_UTILS_SOURCE}"\n`
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
            specifier.imported.name === MODULES_ENUM
          ) {
            modulesLocalNames.add(specifier.local.name)
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
        const enumMember = MODULES_BY_VALUE[arg.value]
        if (!enumMember) {
          return
        }

        context.report({
          node: arg,
          messageId: "preferModulesEnum",
          data: { key: arg.value, enumMember },
          fix(fixer) {
            const fixes: TSESLint.RuleFix[] = []
            const localName =
              modulesLocalNames.size > 0
                ? (modulesLocalNames.values().next().value as string)
                : MODULES_ENUM
            fixes.push(fixer.replaceText(arg, `${localName}.${enumMember}`))
            if (modulesLocalNames.size === 0) {
              const importFix = addModulesImport(fixer)
              if (!importFix) {
                return null
              }
              fixes.push(importFix)
              modulesLocalNames.add(MODULES_ENUM)
            }
            return fixes
          },
        })
      },
    }
  },
})

export default rule
