import * as path from "path"
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { toPosix } from "../../util/filename"
import { isUnderApiDir } from "../../util/api-route"

type MessageIds =
  | "singularFilename"
  | "wrongDirectory"
  | "missingDefineMiddlewares"

const SINGULAR_BASENAMES = new Set(["middleware.ts", "middleware.js"])
const PLURAL_BASENAMES = new Set(["middlewares.ts", "middlewares.js"])
const DEFINE_MIDDLEWARES = "defineMiddlewares"

function isCanonicalLocation(filename: string): boolean {
  const posix = toPosix(filename)
  return (
    /(^|\/)src\/api\/middlewares\.(ts|js)$/.test(posix) ||
    /(^|\/)api\/middlewares\.(ts|js)$/.test(posix)
  )
}

function isDefineMiddlewaresCall(node: TSESTree.Node): boolean {
  return (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.Identifier &&
    node.callee.name === DEFINE_MIDDLEWARES
  )
}

export const rule = createRule<[], MessageIds>({
  name: "middlewares-file-location-and-name",
  meta: {
    type: "problem",
    docs: {
      description:
        "Medusa middlewares must be defined in `src/api/middlewares.{ts,js}` with a default export of `defineMiddlewares(...)`. Other filenames or locations are ignored by the framework.",
    },
    messages: {
      singularFilename:
        "Middleware file must be named `middlewares.{ts,js}` (plural). The framework only loads `src/api/middlewares.{ts,js}`; `middleware.{ts,js}` is ignored.",
      wrongDirectory:
        "Middleware file must live at `src/api/middlewares.{ts,js}`. The framework does not load `defineMiddlewares(...)` from other locations.",
      missingDefineMiddlewares:
        "`src/api/middlewares.{ts,js}` must have a default export of `defineMiddlewares(...)`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    if (!filename || filename.startsWith("<")) return {}

    const basename = path.basename(filename)
    const isSingular = SINGULAR_BASENAMES.has(basename)
    const isPlural = PLURAL_BASENAMES.has(basename)

    if (!isSingular && !isPlural) return {}

    const canonical = isPlural && isCanonicalLocation(filename)

    let defaultExport: TSESTree.ExportDefaultDeclaration | null = null
    let definesMiddlewares = false

    return {
      ExportDefaultDeclaration(node) {
        defaultExport = node
        if (isDefineMiddlewaresCall(node.declaration as TSESTree.Node)) {
          definesMiddlewares = true
        }
      },

      CallExpression(node) {
        if (isDefineMiddlewaresCall(node)) {
          definesMiddlewares = true
        }
      },

      "Program:exit"(program) {
        // Singular `middleware.{ts,js}` under api/ — always wrong name.
        if (isSingular && isUnderApiDir(filename)) {
          if (definesMiddlewares) {
            context.report({ node: program, messageId: "singularFilename" })
          }
          return
        }

        // Plural `middlewares.{ts,js}` in the wrong directory.
        if (isPlural && !canonical) {
          if (definesMiddlewares) {
            context.report({ node: program, messageId: "wrongDirectory" })
          }
          return
        }

        // Canonical location — must default-export defineMiddlewares(...).
        if (canonical) {
          if (
            !defaultExport ||
            !isDefineMiddlewaresCall(
              (defaultExport as TSESTree.ExportDefaultDeclaration)
                .declaration as TSESTree.Node
            )
          ) {
            context.report({
              node: defaultExport ?? program,
              messageId: "missingDefineMiddlewares",
            })
          }
        }
      },
    }
  },
})

export default rule
