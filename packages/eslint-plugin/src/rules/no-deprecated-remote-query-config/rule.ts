import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { FRAMEWORK_HTTP_SOURCE } from "../../constants"

type MessageIds = "deprecatedRemoteQueryConfig"

const DEPRECATED_PROPERTY = "remoteQueryConfig"
const REPLACEMENT_PROPERTY = "queryConfig"

const REQUEST_TYPE_NAMES: ReadonlySet<string> = new Set([
  "MedusaRequest",
  "AuthenticatedMedusaRequest",
  "MedusaStoreRequest",
])

const HTTP_HANDLER_NAMES: ReadonlySet<string> = new Set([
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
])

type FunctionNode =
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression
  | TSESTree.ArrowFunctionExpression

function getEnclosingFunction(node: TSESTree.Node): FunctionNode | null {
  let current: TSESTree.Node | undefined = node.parent
  while (current) {
    if (
      current.type === AST_NODE_TYPES.FunctionDeclaration ||
      current.type === AST_NODE_TYPES.FunctionExpression ||
      current.type === AST_NODE_TYPES.ArrowFunctionExpression
    ) {
      return current
    }
    current = current.parent
  }
  return null
}

function getParamName(param: TSESTree.Parameter): string | null {
  if (param.type === AST_NODE_TYPES.Identifier) {
    return param.name
  }
  if (
    param.type === AST_NODE_TYPES.AssignmentPattern &&
    param.left.type === AST_NODE_TYPES.Identifier
  ) {
    return param.left.name
  }
  return null
}

function getParamTypeAnnotation(
  param: TSESTree.Parameter
): TSESTree.TSTypeAnnotation | undefined {
  if (param.type === AST_NODE_TYPES.Identifier) {
    return param.typeAnnotation
  }
  if (param.type === AST_NODE_TYPES.AssignmentPattern) {
    return param.left.type === AST_NODE_TYPES.Identifier
      ? param.left.typeAnnotation
      : undefined
  }
  return undefined
}

function typeReferencesRequest(
  typeAnnotation: TSESTree.TSTypeAnnotation | undefined,
  requestLocalNames: ReadonlySet<string>
): boolean {
  if (!typeAnnotation) {
    return false
  }
  const typeNode = typeAnnotation.typeAnnotation
  if (typeNode.type !== AST_NODE_TYPES.TSTypeReference) {
    return false
  }
  const name = typeNode.typeName
  if (
    name.type === AST_NODE_TYPES.Identifier &&
    requestLocalNames.has(name.name)
  ) {
    return true
  }
  // Support `HttpTypes.MedusaRequest`, `HttpTypes.AuthenticatedMedusaRequest`.
  if (
    name.type === AST_NODE_TYPES.TSQualifiedName &&
    name.right.type === AST_NODE_TYPES.Identifier &&
    REQUEST_TYPE_NAMES.has(name.right.name)
  ) {
    return true
  }
  return false
}

function isExportedHandler(fn: FunctionNode): boolean {
  if (fn.type === AST_NODE_TYPES.FunctionDeclaration) {
    if (
      fn.parent?.type === AST_NODE_TYPES.ExportNamedDeclaration &&
      fn.id &&
      HTTP_HANDLER_NAMES.has(fn.id.name)
    ) {
      return true
    }
    return false
  }
  // Arrow / function expression: must be initializer of an exported VariableDeclarator.
  const parent = fn.parent
  if (parent?.type !== AST_NODE_TYPES.VariableDeclarator) {
    return false
  }
  if (parent.id.type !== AST_NODE_TYPES.Identifier) {
    return false
  }
  if (!HTTP_HANDLER_NAMES.has(parent.id.name)) {
    return false
  }
  const decl = parent.parent
  if (decl?.type !== AST_NODE_TYPES.VariableDeclaration) {
    return false
  }
  return decl.parent?.type === AST_NODE_TYPES.ExportNamedDeclaration
}

export const rule = createRule<[], MessageIds>({
  name: "no-deprecated-remote-query-config",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow `req.remoteQueryConfig`; use `req.queryConfig` instead (deprecated since Medusa v2.2.0).",
    },
    fixable: "code",
    messages: {
      deprecatedRemoteQueryConfig:
        "`remoteQueryConfig` is deprecated; use `queryConfig` instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const requestLocalNames = new Set<string>()

    return {
      ImportDeclaration(node) {
        if (node.source.value !== FRAMEWORK_HTTP_SOURCE) {
          return
        }
        for (const specifier of node.specifiers) {
          if (
            specifier.type === AST_NODE_TYPES.ImportSpecifier &&
            specifier.imported.type === AST_NODE_TYPES.Identifier &&
            REQUEST_TYPE_NAMES.has(specifier.imported.name)
          ) {
            requestLocalNames.add(specifier.local.name)
          }
        }
      },

      MemberExpression(node) {
        if (node.computed) {
          return
        }
        if (node.property.type !== AST_NODE_TYPES.Identifier) {
          return
        }
        if (node.property.name !== DEPRECATED_PROPERTY) {
          return
        }
        if (node.object.type !== AST_NODE_TYPES.Identifier) {
          return
        }

        const objectName = node.object.name

        let matched = false
        let fn: FunctionNode | null = getEnclosingFunction(node)
        while (fn) {
          const param = fn.params.find((p) => getParamName(p) === objectName)
          if (param) {
            if (
              typeReferencesRequest(
                getParamTypeAnnotation(param),
                requestLocalNames
              )
            ) {
              matched = true
              break
            }
            if (
              fn.params[0] === param &&
              (objectName === "req" || objectName === "request") &&
              isExportedHandler(fn)
            ) {
              matched = true
              break
            }
            // The name is bound by this function but doesn't satisfy either
            // signal — stop walking; an outer scope's `req` is shadowed.
            break
          }
          fn = getEnclosingFunction(fn)
        }

        if (!matched) {
          return
        }

        context.report({
          node: node.property,
          messageId: "deprecatedRemoteQueryConfig",
          fix(fixer) {
            return fixer.replaceText(node.property, REPLACEMENT_PROPERTY)
          },
        })
      },
    }
  },
})

export default rule
