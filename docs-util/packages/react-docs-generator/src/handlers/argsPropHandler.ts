import { utils, DocumentationBuilder, NodePath } from "react-docgen"
import { ComponentNode } from "react-docgen/dist/resolver/index.js"
import { getDocblock } from "react-docgen/dist/utils/docblock.js"
import TypedocManager from "../classes/typedoc-manager.js"
import emptyPropDescriptor from "../utils/empty-prop-descriptor.js"
import { Node } from "@babel/core"
import isEmptyPropDescriptor from "../utils/is-empty-prop-descriptor.js"

function resolveDocumentation(
  documentation: DocumentationBuilder,
  path: NodePath<ComponentNode>,
  typedocManager?: TypedocManager
) {
  if (!path.isObjectExpression() && !path.isObjectPattern()) {
    return
  }
  path.get("properties").forEach((propertyPath) => {
    if (propertyPath.isSpreadElement() || propertyPath.isRestElement()) {
      const resolvedValuePath = utils.resolveToValue(
        propertyPath.get("argument")
      ) as NodePath<ComponentNode>
      resolveDocumentation(documentation, resolvedValuePath)
    } else if (
      propertyPath.isObjectProperty() ||
      propertyPath.isObjectMethod()
    ) {
      const propertyName = utils.getPropertyName(propertyPath)
      const propDescriptor = propertyName
        ? documentation.getPropDescriptor(propertyName)
        : undefined
      const description =
        propDescriptor?.description || getDocblock(propertyPath)
      const propExists = propertyName !== null && propDescriptor !== undefined
      const shouldRemoveProp =
        description?.includes("@ignore") ||
        (!description &&
          (!propDescriptor || isEmptyPropDescriptor(propDescriptor)))

      // remove property if it doesn't have a description or
      // if its description includes the `@ignore` tag.
      if (!propExists || shouldRemoveProp) {
        if (shouldRemoveProp && propExists) {
          // prop is removed if its descriptor is empty,
          // so we empty it to remove it.
          emptyPropDescriptor(propDescriptor)
        }
        return
      }
      // set description
      utils.setPropDescription(documentation, propertyPath)

      // set type if missing
      if (!propDescriptor.tsType && typedocManager) {
        const typeAnnotation = utils.getTypeAnnotation(path)
        if (typeAnnotation?.isTSTypeReference) {
          const typeName = typeAnnotation.get("typeName")
          if (
            !Array.isArray(typeName) &&
            typeName.hasNode() &&
            typeName.isIdentifier()
          ) {
            const tsType = typedocManager.resolveChildType(
              typeName.node.name,
              propertyName
            )

            if (tsType) {
              propDescriptor.tsType = tsType
            }
          }
        }
      } else if (
        propDescriptor.tsType &&
        typedocManager?.doesOnlyHaveName(propDescriptor.tsType)
      ) {
        // see if the type needs to be resolved.
        const typeReflection = typedocManager?.getReflectionByName(
          propDescriptor.tsType.name
        )
        if (typeReflection && typeReflection.type) {
          propDescriptor.tsType =
            typedocManager?.getTsType(typeReflection.type) ||
            propDescriptor.tsType
        }
      }
    }
  })
}

/**
 * A handler that resolves props from arguments and
 * sets their description, type, etc...
 */
const argsPropHandler = (
  documentation: DocumentationBuilder,
  componentDefinition: NodePath<ComponentNode>,
  typedocManager?: TypedocManager
) => {
  let componentParams: NodePath<Node>[] = []
  if (componentDefinition.isCallExpression()) {
    const args = componentDefinition.get("arguments")
    args.forEach((arg) => {
      const params = arg.get("params")
      if (Array.isArray(params)) {
        componentParams.push(...params)
      } else {
        componentParams.push(params)
      }
    })
  } else if (componentDefinition.isArrowFunctionExpression()) {
    componentParams = componentDefinition.get("params")
  }

  componentParams.forEach((param) => {
    const resolvedParam = utils.resolveToValue(param) as NodePath<ComponentNode>

    if (!resolvedParam) {
      return
    }

    // set description and type of prop
    resolveDocumentation(documentation, resolvedParam, typedocManager)
  })
}

export default argsPropHandler
