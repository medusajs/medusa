import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  FunctionNode,
  findVariableInScope,
  isFunctionNode,
} from "../../util/ast"

type MessageIds = "mustBeAsync"

/**
 * Resolves an identifier (the local binding of a default export) to the
 * function it refers to — either a `function` declaration or a `const x = () =>`
 * / `const x = function () {}` initializer. Returns `null` when the binding
 * isn't a project-local function (e.g. a re-export from another module).
 */
function resolveFunctionFromIdentifier(
  scope: TSESLint.Scope.Scope | null,
  identifier: TSESTree.Identifier
): FunctionNode | null {
  const variable = findVariableInScope(scope, identifier.name)
  if (!variable) {
    return null
  }

  for (const def of variable.defs) {
    if (def.node.type === AST_NODE_TYPES.FunctionDeclaration) {
      return def.node
    }
    if (
      def.node.type === AST_NODE_TYPES.VariableDeclarator &&
      isFunctionNode(def.node.init)
    ) {
      return def.node.init
    }
  }

  return null
}

export const rule = createRule<[], MessageIds>({
  name: "subscriber-default-export-must-be-async",
  meta: {
    type: "problem",
    docs: {
      description:
        "The default-exported subscriber handler function must be async.",
    },
    fixable: "code",
    messages: {
      mustBeAsync:
        "The default-exported subscriber handler must be an async function. Subscribers receive an event and are always awaited by the framework.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    function checkFunction(fn: FunctionNode) {
      if (fn.async) {
        return
      }
      context.report({
        node: fn,
        messageId: "mustBeAsync",
        fix(fixer) {
          return fixer.insertTextBefore(fn, "async ")
        },
      })
    }

    return {
      ExportDefaultDeclaration(node: TSESTree.ExportDefaultDeclaration) {
        const decl = node.declaration

        // export default (async) function () {} | export default (async) () => {}
        if (isFunctionNode(decl)) {
          checkFunction(decl)
          return
        }

        // export default handler — resolve the binding to its function.
        if (decl.type === AST_NODE_TYPES.Identifier) {
          const fn = resolveFunctionFromIdentifier(
            sourceCode.getScope(node),
            decl
          )
          if (fn) {
            checkFunction(fn)
          }
        }
      },
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration) {
        // `export { default } from "./impl"` re-exports another module's
        // binding — we can't resolve it locally, so skip (no false positive).
        if (node.source) {
          return
        }

        for (const spec of node.specifiers) {
          if (
            spec.exported.type !== AST_NODE_TYPES.Identifier ||
            spec.exported.name !== "default"
          ) {
            continue
          }

          // `export { handler as default }` — resolve `handler`.
          const fn = resolveFunctionFromIdentifier(
            sourceCode.getScope(node),
            spec.local
          )
          if (fn) {
            checkFunction(fn)
          }
          return
        }
      },
    }
  },
})

export default rule
