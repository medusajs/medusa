import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"

type MessageIds = "useFrameworkEntrypoint" | "noInternalImport"

/**
 * Deprecated standalone packages whose contents moved into
 * `@medusajs/framework/*` subpaths. Importing them still works today but is
 * discouraged — the framework entry points are the supported surface.
 */
const OLD_PACKAGE_REWRITES: Record<string, string> = {
  "@medusajs/utils": "@medusajs/framework/utils",
  "@medusajs/types": "@medusajs/framework/types",
  "@medusajs/workflows-sdk": "@medusajs/framework/workflows-sdk",
  "@medusajs/modules-sdk": "@medusajs/framework/modules-sdk",
  "@medusajs/orchestration": "@medusajs/framework/orchestration",
}

/**
 * Deep import into a `@medusajs/*` package's compiled build output, e.g.
 * `@medusajs/medusa/dist/...` or `@medusajs/framework/dist/...`. Requires a
 * path segment that is exactly `dist` so package names like
 * `@medusajs/some-dist-thing` aren't matched.
 */
const MEDUSA_DIST_IMPORT = /^@medusajs\/[^/]+\/(?:[^/]+\/)*dist(?:\/|$)/

function check(
  context: Parameters<Parameters<typeof createRule>[0]["create"]>[0],
  source: TSESTree.StringLiteral | null | undefined
) {
  if (!source) {
    return
  }
  const value = source.value
  if (typeof value !== "string") {
    return
  }

  const replacement = OLD_PACKAGE_REWRITES[value]
  if (replacement) {
    context.report({
      node: source,
      messageId: "useFrameworkEntrypoint",
      data: { source: value, replacement },
      fix(fixer) {
        const quote = source.raw[0]
        return fixer.replaceText(source, `${quote}${replacement}${quote}`)
      },
    })
    return
  }

  if (MEDUSA_DIST_IMPORT.test(value)) {
    context.report({
      node: source,
      messageId: "noInternalImport",
      data: { source: value },
    })
  }
}

export const rule = createRule<[], MessageIds>({
  name: "import-from-framework-not-internal",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Use the public `@medusajs/framework/*` entry points; don't import from a package's internal `dist/` build output or from deprecated standalone packages.",
    },
    messages: {
      useFrameworkEntrypoint:
        "Import from `{{ replacement }}` instead of the deprecated `{{ source }}` package.",
      noInternalImport:
        "Don't import from internal build output `{{ source }}`. Use a public `@medusajs/framework/*` entry point instead.",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        check(context, node.source)
      },
      ExportNamedDeclaration(node) {
        if (node.source && node.source.type === AST_NODE_TYPES.Literal) {
          check(context, node.source as TSESTree.StringLiteral)
        }
      },
      ExportAllDeclaration(node) {
        check(context, node.source)
      },
    }
  },
})

export default rule
