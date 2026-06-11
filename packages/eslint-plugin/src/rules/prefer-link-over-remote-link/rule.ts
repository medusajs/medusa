import type { TSESTree, TSESLint } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { TYPES_SOURCES } from "../../constants"

type MessageIds =
  | "remoteLinkString"
  | "remoteLinkRegistrationKey"
  | "remoteLinkTypeImport"

const REMOTE_LINK_TYPE_RENAMES: Record<string, string> = {
  RemoteLink: "Link",
  IRemoteLink: "ILink",
}

function isResolveCallee(callee: TSESTree.Expression): boolean {
  if (callee.type === "Identifier" && callee.name === "resolve") return true
  if (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.property.type === "Identifier" &&
    callee.property.name === "resolve"
  ) {
    return true
  }
  return false
}

export const rule = createRule<[], MessageIds>({
  name: "prefer-link-over-remote-link",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "`RemoteLink` is deprecated since Medusa v2.2.0; use `Link` instead.",
    },
    fixable: "code",
    messages: {
      remoteLinkString:
        '`"remoteLink"` is deprecated. Resolve `"link"` (or `ContainerRegistrationKeys.LINK`) instead.',
      remoteLinkRegistrationKey:
        "`ContainerRegistrationKeys.REMOTE_LINK` is deprecated. Use `ContainerRegistrationKeys.LINK` instead.",
      remoteLinkTypeImport:
        "`{{name}}` is deprecated. Import `{{replacement}}` from `@medusajs/framework/types` instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        if (typeof node.source.value !== "string") return
        if (!TYPES_SOURCES.has(node.source.value)) return
        for (const specifier of node.specifiers) {
          if (specifier.type !== "ImportSpecifier") continue
          if (specifier.imported.type !== "Identifier") continue
          const importedName = specifier.imported.name
          const replacement = REMOTE_LINK_TYPE_RENAMES[importedName]
          if (!replacement) continue
          context.report({
            node: specifier.imported,
            messageId: "remoteLinkTypeImport",
            data: { name: importedName, replacement },
            fix(fixer: TSESLint.RuleFixer) {
              // Only safe to rewrite when the local binding is the same as the
              // imported name (no alias) — otherwise renaming the imported part
              // would break references to the local alias elsewhere in the file.
              if (specifier.local.name !== importedName) {
                return fixer.replaceText(specifier.imported, replacement)
              }
              return fixer.replaceText(specifier, replacement)
            },
          })
        }
      },

      CallExpression(node) {
        if (!isResolveCallee(node.callee)) return
        const arg = node.arguments[0]
        if (!arg) return

        if (arg.type === "Literal" && arg.value === "remoteLink") {
          context.report({
            node: arg,
            messageId: "remoteLinkString",
            fix(fixer) {
              const raw = arg.raw
              const quote = raw[0] === "'" ? "'" : '"'
              return fixer.replaceText(arg, `${quote}link${quote}`)
            },
          })
          return
        }

        if (
          arg.type === "MemberExpression" &&
          !arg.computed &&
          arg.property.type === "Identifier" &&
          arg.property.name === "REMOTE_LINK"
        ) {
          context.report({
            node: arg,
            messageId: "remoteLinkRegistrationKey",
            fix(fixer) {
              return fixer.replaceText(arg.property, "LINK")
            },
          })
        }
      },
    }
  },
})

export default rule
