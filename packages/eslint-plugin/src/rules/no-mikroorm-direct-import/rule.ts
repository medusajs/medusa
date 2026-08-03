import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"

type MessageIds = "useFrameworkReexport" | "noDirectMikroOrmImport"

/**
 * Prefix shared by every `@mikro-orm/*` package, including the trailing slash.
 */
const MIKRO_ORM_PREFIX = "@mikro-orm/"

/**
 * The `@mikro-orm/*` subpackages that `@medusajs/framework` re-exports as of
 * v2.11.0 (`@medusajs/framework/mikro-orm/<sub>`). Imports of these can be
 * rewritten automatically. Other `@mikro-orm/*` subpaths are still flagged, but
 * without an autofix because there is no guaranteed framework re-export to point
 * them at.
 */
const MIKRO_ORM_REEXPORTED_SUBPATHS: ReadonlySet<string> = new Set([
  "cli",
  "core",
  "knex",
  "migrations",
  "postgresql",
])

/** `awilix` is re-exported wholesale as `@medusajs/framework/awilix`. */
const AWILIX_SOURCE = "awilix"
const AWILIX_REEXPORT = "@medusajs/framework/awilix"

function rewriteSource(value: string): string | null {
  if (value === AWILIX_SOURCE) {
    return AWILIX_REEXPORT
  }

  if (value.startsWith(MIKRO_ORM_PREFIX)) {
    const rest = value.slice(MIKRO_ORM_PREFIX.length)
    if (MIKRO_ORM_REEXPORTED_SUBPATHS.has(rest)) {
      return `@medusajs/framework/mikro-orm/${rest}`
    }
  }

  return null
}

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

  const isMikroOrm = value.startsWith(MIKRO_ORM_PREFIX)
  if (value !== AWILIX_SOURCE && !isMikroOrm) {
    return
  }

  const replacement = rewriteSource(value)
  if (replacement) {
    context.report({
      node: source,
      messageId: "useFrameworkReexport",
      data: { source: value, replacement },
      fix(fixer) {
        const quote = source.raw[0]
        return fixer.replaceText(source, `${quote}${replacement}${quote}`)
      },
    })
    return
  }

  // A `@mikro-orm/*` subpath that the framework doesn't re-export — flag it but
  // leave the rewrite to the developer.
  context.report({
    node: source,
    messageId: "noDirectMikroOrmImport",
    data: { source: value },
  })
}

export const rule = createRule<[], MessageIds>({
  name: "no-mikroorm-direct-import",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Don't import MikroORM or awilix directly. As of Medusa v2.11, they're bundled into `@medusajs/framework`; use the `@medusajs/framework/mikro-orm/*` and `@medusajs/framework/awilix` re-exports.",
    },
    messages: {
      useFrameworkReexport:
        "Import from `{{ replacement }}` instead of `{{ source }}`. MikroORM and awilix are re-exported by `@medusajs/framework` as of Medusa v2.11.",
      noDirectMikroOrmImport:
        "Don't import directly from `{{ source }}`. As of Medusa v2.11, MikroORM is bundled into `@medusajs/framework` — use a `@medusajs/framework/mikro-orm/*` re-export.",
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
