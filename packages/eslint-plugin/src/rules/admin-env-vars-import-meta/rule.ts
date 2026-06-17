import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { isAdminFile } from "../../util/admin-scope"

type MessageIds = "useImportMetaEnv"

/**
 * True when `process` resolves to a local binding (a function param, a
 * `const process = ...`, an import, etc.) rather than the Node.js global.
 * In that case `process.env` isn't the Node env object and must not be flagged.
 */
function processBindingIsLocal(scope: TSESLint.Scope.Scope | null): boolean {
  let current = scope
  while (current) {
    const variable = current.variables.find((v) => v.name === "process")
    if (variable) {
      // `defs.length > 0` means a real declaration in user code, i.e. a shadow.
      // The Node global, if present, is a variable with no defs.
      return variable.defs.length > 0
    }
    current = current.upper
  }
  return false
}

export const rule = createRule<[], MessageIds>({
  name: "admin-env-vars-import-meta",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Admin code is bundled for the browser by Vite — use `import.meta.env` instead of `process.env` for environment variables.",
    },
    fixable: "code",
    messages: {
      useImportMetaEnv:
        "Admin code runs in the browser via Vite, where `process.env` is undefined. Use `import.meta.env` (e.g. `import.meta.env.VITE_*`) instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Scope to the admin dashboard tree; `process.env` is fine everywhere else
    // (including API admin routes under `src/api/admin/`).
    if (!isAdminFile(context.filename)) {
      return {}
    }

    return {
      MemberExpression(node: TSESTree.MemberExpression) {
        // Match the `process.env` member expression itself (not `process.env.X`,
        // whose `.object` is this node). Reporting here covers both bare
        // `process.env` access and any `process.env.FOO` lookup in one place.
        if (node.computed) {
          return
        }
        if (
          node.object.type !== AST_NODE_TYPES.Identifier ||
          node.object.name !== "process"
        ) {
          return
        }
        if (
          node.property.type !== AST_NODE_TYPES.Identifier ||
          node.property.name !== "env"
        ) {
          return
        }

        if (processBindingIsLocal(context.sourceCode.getScope(node))) {
          return
        }

        context.report({
          node,
          messageId: "useImportMetaEnv",
          fix(fixer) {
            return fixer.replaceText(node, "import.meta.env")
          },
        })
      },
    }
  },
})

export default rule
