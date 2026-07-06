import type { TSESTree, TSESLint } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { toKebab } from "../../util/strings"
import {
  createWorkflowSdkBindings,
  isInWorkflowConstructor,
  trackWorkflowSdkImports,
  WorkflowSdkBindings,
} from "../../util/workflow-scope"

type MessageIds = "duplicateStepId"

const SDK_HELPER_NAMES: ReadonlySet<string> = new Set([
  "transform",
  "when",
  "parallelize",
  "createHook",
  "createStep",
  "createWorkflow",
])

const stepBaseName = (calleeName: string): string => {
  const kebab = toKebab(calleeName)
  return kebab.endsWith("-step") ? kebab.slice(0, -"-step".length) : kebab
}

type StepCall = {
  node: TSESTree.CallExpression
  calleeName: string
  effectiveKey: string
  hasConfig: boolean
}

const findConfigCall = (
  call: TSESTree.CallExpression
): TSESTree.CallExpression | null => {
  const parent = call.parent
  if (!parent || parent.type !== AST_NODE_TYPES.MemberExpression) {
    return null
  }
  if (parent.object !== call) {
    return null
  }
  if (parent.computed) {
    return null
  }
  if (parent.property.type !== AST_NODE_TYPES.Identifier) {
    return null
  }
  if (parent.property.name !== "config") {
    return null
  }
  const grand = parent.parent
  if (!grand || grand.type !== AST_NODE_TYPES.CallExpression) {
    return null
  }
  if (grand.callee !== parent) {
    return null
  }
  return grand
}

/**
 * Sentinel returned when a `.config({ name })` is present but its `name` value
 * isn't a static string literal (e.g. a variable or expression). The developer
 * explicitly set a name, so the call must not be treated as a bare duplicate —
 * we just can't compare its value statically.
 */
const DYNAMIC_CONFIG_NAME = Symbol("dynamic-config-name")

const extractConfigName = (
  configCall: TSESTree.CallExpression
): string | typeof DYNAMIC_CONFIG_NAME | null => {
  const arg = configCall.arguments[0]
  if (!arg || arg.type !== AST_NODE_TYPES.ObjectExpression) {
    return null
  }
  for (const prop of arg.properties) {
    if (prop.type !== AST_NODE_TYPES.Property) {
      continue
    }
    if (prop.computed) {
      continue
    }
    const keyName =
      prop.key.type === AST_NODE_TYPES.Identifier
        ? prop.key.name
        : prop.key.type === AST_NODE_TYPES.Literal &&
          typeof prop.key.value === "string"
        ? prop.key.value
        : null
    if (keyName !== "name") {
      continue
    }
    if (
      prop.value.type === AST_NODE_TYPES.Literal &&
      typeof prop.value.value === "string"
    ) {
      return prop.value.value
    }
    // A `name` is set, but not to a literal we can compare — treat as dynamic.
    return DYNAMIC_CONFIG_NAME
  }
  return null
}

export const rule = createRule<[], MessageIds>({
  name: "no-duplicate-step-id-in-workflow",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow invoking the same step factory more than once in a `createWorkflow` constructor without renaming subsequent calls via `.config({ name })`. Steps registered with the same ID throw at runtime.",
    },
    messages: {
      duplicateStepId:
        'Step "{{key}}" is invoked more than once in this workflow. Rename this call with `.config({ name: "<unique-id>" })` so each step has a unique ID.',
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const bindings: WorkflowSdkBindings = createWorkflowSdkBindings()
    const callsByWorkflow = new Map<TSESTree.Node, StepCall[]>()

    const isStepInvocation = (node: TSESTree.CallExpression): boolean => {
      if (node.callee.type !== AST_NODE_TYPES.Identifier) {
        return false
      }
      const name = node.callee.name
      if (SDK_HELPER_NAMES.has(name)) {
        return false
      }
      if (bindings.transform.has(name)) {
        return false
      }
      if (bindings.when.has(name)) {
        return false
      }
      if (bindings.createStep.has(name)) {
        return false
      }
      if (bindings.createWorkflow.has(name)) {
        return false
      }
      return true
    }

    return {
      ImportDeclaration(node) {
        trackWorkflowSdkImports(node, bindings)
      },
      CallExpression(node) {
        if (bindings.createWorkflow.size === 0) {
          return
        }
        if (!isStepInvocation(node)) {
          return
        }
        if (!isInWorkflowConstructor(node, bindings)) {
          return
        }

        // Identify the enclosing workflow constructor to scope the bucket.
        let fn: TSESTree.Node | undefined = node.parent
        while (fn) {
          if (
            fn.type === AST_NODE_TYPES.ArrowFunctionExpression ||
            fn.type === AST_NODE_TYPES.FunctionExpression ||
            fn.type === AST_NODE_TYPES.FunctionDeclaration
          ) {
            break
          }
          fn = fn.parent
        }
        if (!fn) {
          return
        }

        if (node.callee.type !== AST_NODE_TYPES.Identifier) {
          return
        }
        const calleeName = node.callee.name

        const configCall = findConfigCall(node)
        const configuredName = configCall ? extractConfigName(configCall) : null

        // A literal name groups by value; a dynamic name (variable/expression)
        // gets a per-call unique key so it never collides; no name falls back
        // to the bare factory identifier.
        const effectiveKey =
          configuredName === DYNAMIC_CONFIG_NAME
            ? `DYNAMIC:${node.range[0]}`
            : configuredName !== null
            ? `NAMED:${configuredName}`
            : `BARE:${calleeName}`

        const bucket = callsByWorkflow.get(fn) ?? []
        bucket.push({
          node,
          calleeName,
          effectiveKey,
          hasConfig: configCall !== null,
        })
        callsByWorkflow.set(fn, bucket)
      },
      "Program:exit"() {
        for (const calls of callsByWorkflow.values()) {
          const groups = new Map<string, StepCall[]>()
          for (const c of calls) {
            const g = groups.get(c.effectiveKey) ?? []
            g.push(c)
            groups.set(c.effectiveKey, g)
          }

          for (const group of groups.values()) {
            if (group.length < 2) {
              continue
            }
            const base = stepBaseName(group[0].calleeName)
            // Leave the first call untouched; flag every subsequent
            // duplicate and offer a deterministic .config rename.
            for (let i = 1; i < group.length; i++) {
              const dup = group[i]
              const displayKey = dup.effectiveKey.startsWith("NAMED:")
                ? dup.effectiveKey.slice("NAMED:".length)
                : stepBaseName(dup.calleeName)

              const suggestedName = `${base || dup.calleeName}-${i + 1}`

              const fix = dup.hasConfig
                ? undefined
                : (fixer: TSESLint.RuleFixer) =>
                    fixer.insertTextAfter(
                      dup.node,
                      `.config({ name: "${suggestedName}" })`
                    )

              context.report({
                node: dup.node,
                messageId: "duplicateStepId",
                data: { key: displayKey },
                ...(fix ? { fix } : {}),
              })
            }
          }
        }
      },
    }
  },
})

export default rule
