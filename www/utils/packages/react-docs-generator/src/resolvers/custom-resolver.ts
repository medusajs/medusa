import { visitors } from "@babel/traverse"
import { utils, builtinResolvers, FileState, NodePath } from "react-docgen"
import { ComponentNodePath } from "react-docgen/dist/resolver/index.js"
import TypedocManager from "../classes/typedoc-manager.js"

type State = {
  foundDefinitions: Set<ComponentNodePath>
}
/**
 * This resolver extends react-docgen's FindAllDefinitionsResolver
 * + adds the ability to resolve variable components such as:
 *
 * ```tsx
 * const Value = SelectPrimitive.Value
 * Value.displayName = "Select.Value"
 * ```
 */
export default class CustomResolver
  implements builtinResolvers.FindAllDefinitionsResolver
{
  private typedocManager: TypedocManager
  constructor(typedocManager: TypedocManager) {
    this.typedocManager = typedocManager
  }
  resolve(file: FileState): ComponentNodePath[] {
    const state = {
      foundDefinitions: new Set<ComponentNodePath>(),
    }
    file.traverse(
      visitors.explode({
        FunctionDeclaration: { enter: this.statelessVisitor },
        FunctionExpression: { enter: this.statelessVisitor },
        ObjectMethod: { enter: this.statelessVisitor },
        ArrowFunctionExpression: { enter: this.statelessVisitor },
        ClassExpression: { enter: this.classVisitor },
        ClassDeclaration: { enter: this.classVisitor },
        VariableDeclaration: {
          enter: (path, state: State) => {
            const found = path.node.declarations.some((declaration) => {
              if (
                "name" in declaration.id &&
                this.typedocManager.isReactComponent(declaration.id.name) &&
                declaration.init
              ) {
                const init = path.get("declarations")[0].get("init")
                if (init.isMemberExpression()) {
                  state.foundDefinitions.add(
                    path as unknown as ComponentNodePath
                  )
                  return true
                }

                return false
              }
            })

            if (found) {
              return path.skip()
            }
          },
        },
        CallExpression: {
          enter: (path, state: State) => {
            const argument = path.get("arguments")[0]
            if (!argument) {
              return
            }
            if (utils.isReactForwardRefCall(path)) {
              // If the the inner function was previously identified as a component
              // replace it with the parent node
              const inner = utils.resolveToValue(argument) as ComponentNodePath
              state.foundDefinitions.delete(inner)
              state.foundDefinitions.add(path)
              // Do not traverse into arguments
              return path.skip()
            } else if (utils.isReactCreateClassCall(path)) {
              const resolvedPath = utils.resolveToValue(argument)
              if (resolvedPath.isObjectExpression()) {
                state.foundDefinitions.add(resolvedPath)
              }
              // Do not traverse into arguments
              return path.skip()
            }
          },
        },
      }),
      state
    )
    return Array.from(state.foundDefinitions)
  }

  classVisitor(path: NodePath, state: State) {
    if (utils.isReactComponentClass(path)) {
      utils.normalizeClassDefinition(path)
      state.foundDefinitions.add(path)
    }
    path.skip()
  }
  statelessVisitor(path: NodePath, state: State) {
    if (utils.isStatelessComponent(path)) {
      state.foundDefinitions.add(path)
    }
    path.skip()
  }
}
