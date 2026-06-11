import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils"
import * as ts from "typescript"
import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  isResponseConstructor,
  trackWorkflowSdkImports,
} from "../../util/workflow-scope"

type MessageIds = "nonSerializableInResponse"

const NON_SERIALIZABLE_CLASSES = new Set(["Map", "Set", "WeakMap", "WeakSet"])

const PRIMITIVE_FLAGS =
  ts.TypeFlags.Any |
  ts.TypeFlags.Unknown |
  ts.TypeFlags.Never |
  ts.TypeFlags.Null |
  ts.TypeFlags.Undefined |
  ts.TypeFlags.Void |
  ts.TypeFlags.StringLike |
  ts.TypeFlags.NumberLike |
  ts.TypeFlags.BooleanLike |
  ts.TypeFlags.BigIntLike |
  ts.TypeFlags.ESSymbolLike

const MAX_DEPTH = 5

function getTypeName(type: ts.Type): string | undefined {
  return type.aliasSymbol?.name ?? type.getSymbol()?.name
}

function collectNonSerializable(
  type: ts.Type,
  checker: ts.TypeChecker,
  location: ts.Node,
  visited: Set<ts.Type>,
  depth: number,
  found: Set<string>
): void {
  if (depth > MAX_DEPTH) return
  if (visited.has(type)) return
  visited.add(type)

  if (type.flags & PRIMITIVE_FLAGS) return

  const name = getTypeName(type)
  if (name && NON_SERIALIZABLE_CLASSES.has(name)) {
    found.add(name)
    return
  }

  if (type.isUnion() || type.isIntersection()) {
    for (const t of type.types) {
      collectNonSerializable(t, checker, location, visited, depth, found)
    }
    return
  }

  const numericIndex = checker.getIndexTypeOfType(type, ts.IndexKind.Number)
  if (numericIndex) {
    collectNonSerializable(
      numericIndex,
      checker,
      location,
      visited,
      depth + 1,
      found
    )
  }

  for (const prop of type.getProperties()) {
    if (prop.flags & ts.SymbolFlags.Method) continue
    const propType = checker.getTypeOfSymbolAtLocation(prop, location)
    collectNonSerializable(
      propType,
      checker,
      location,
      visited,
      depth + 1,
      found
    )
  }
}

export const rule = createRule<[], MessageIds>({
  name: "no-non-serializable-step-return",
  meta: {
    type: "problem",
    docs: {
      description:
        "Step and workflow responses must be serializable — disallow `Map`, `Set`, `WeakMap`, and `WeakSet` values inside `new StepResponse(...)` / `new WorkflowResponse(...)`.",
      requiresTypeChecking: true,
    },
    messages: {
      nonSerializableInResponse:
        "`{{className}}` is not serializable and cannot be returned from a step or workflow. Use a plain object or array instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const bindings = createWorkflowSdkBindings()
    const services = ESLintUtils.getParserServices(context)
    const checker = services.program.getTypeChecker()

    return {
      ImportDeclaration(node) {
        trackWorkflowSdkImports(node, bindings)
      },

      NewExpression(node) {
        if (
          bindings.stepResponse.size === 0 &&
          bindings.workflowResponse.size === 0
        ) {
          return
        }
        if (!isResponseConstructor(node, bindings)) return

        for (const arg of node.arguments) {
          if (arg.type === AST_NODE_TYPES.SpreadElement) continue
          const tsNode = services.esTreeNodeToTSNodeMap.get(arg as TSESTree.Node)
          const type = checker.getTypeAtLocation(tsNode)
          const found = new Set<string>()
          collectNonSerializable(type, checker, tsNode, new Set(), 0, found)
          for (const className of found) {
            context.report({
              node: arg,
              messageId: "nonSerializableInResponse",
              data: { className },
            })
          }
        }
      },
    }
  },
})

export default rule
