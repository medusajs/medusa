import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { isAdminComponentFile } from "../../util/admin-scope"

type MessageIds = "mustBeArrowFunction"

function functionDeclarationToArrow(
  context: Parameters<Parameters<typeof createRule>[0]["create"]>[0],
  fn: TSESTree.FunctionDeclaration
): string | null {
  if (!fn.id) {
    return null
  }
  const source = context.sourceCode ?? context.getSourceCode()
  const name = fn.id.name
  const params = fn.params
    .map((p) => source.getText(p as unknown as TSESTree.Node))
    .join(", ")
  const body = source.getText(fn.body as unknown as TSESTree.Node)
  const asyncPrefix = fn.async ? "async " : ""
  return `const ${name} = ${asyncPrefix}(${params}) => ${body}`
}

function anonymousFunctionToArrow(
  context: Parameters<Parameters<typeof createRule>[0]["create"]>[0],
  fn: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression
): string | null {
  const source = context.sourceCode ?? context.getSourceCode()
  const params = fn.params
    .map((p) => source.getText(p as unknown as TSESTree.Node))
    .join(", ")
  const body = source.getText(fn.body as unknown as TSESTree.Node)
  const asyncPrefix = fn.async ? "async " : ""
  return `${asyncPrefix}(${params}) => ${body}`
}

export const rule = createRule<[], MessageIds>({
  name: "admin-component-must-be-arrow-function",
  meta: {
    type: "problem",
    docs: {
      description:
        "Admin widget and UI route components must be arrow functions, not function declarations.",
    },
    messages: {
      mustBeArrowFunction:
        "Admin widget and UI route components must be arrow functions (`const Foo = () => ...`), not function declarations.",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isAdminComponentFile(context.filename)) {
      return {}
    }

    return {
      ExportDefaultDeclaration(node) {
        const decl = node.declaration

        // export default function Foo() {} | export default function () {}
        if (decl.type === AST_NODE_TYPES.FunctionDeclaration) {
          context.report({
            node: decl,
            messageId: "mustBeArrowFunction",
            fix(fixer) {
              if (decl.id) {
                const arrow = functionDeclarationToArrow(context, decl)
                if (!arrow) {
                  return null
                }
                return fixer.replaceText(
                  node,
                  `${arrow}\nexport default ${decl.id.name}`
                )
              }
              const arrow = anonymousFunctionToArrow(context, decl)
              if (!arrow) {
                return null
              }
              return fixer.replaceText(decl, arrow)
            },
          })
          return
        }

        // export default function () {} (parsed as FunctionExpression in some shapes)
        if (decl.type === AST_NODE_TYPES.FunctionExpression) {
          context.report({
            node: decl,
            messageId: "mustBeArrowFunction",
            fix(fixer) {
              const arrow = anonymousFunctionToArrow(context, decl)
              if (!arrow) {
                return null
              }
              return fixer.replaceText(decl, arrow)
            },
          })
          return
        }

        // export default Foo — resolve binding to function declaration
        if (decl.type === AST_NODE_TYPES.Identifier) {
          const scope = context.sourceCode.getScope(node)
          const variable = scope.variables.find((v) => v.name === decl.name)
          if (!variable) {
            return
          }
          for (const def of variable.defs) {
            if (def.node.type === AST_NODE_TYPES.FunctionDeclaration) {
              const fnDecl = def.node as TSESTree.FunctionDeclaration
              context.report({
                node: fnDecl,
                messageId: "mustBeArrowFunction",
                fix(fixer) {
                  const arrow = functionDeclarationToArrow(context, fnDecl)
                  if (!arrow) {
                    return null
                  }
                  return fixer.replaceText(fnDecl, arrow)
                },
              })
            }
          }
        }
      },
    }
  },
})

export default rule
