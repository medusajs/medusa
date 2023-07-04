import { RemoteJoinerQuery } from "@medusajs/types"
import {
  ArgumentNode,
  DocumentNode,
  FieldNode,
  Kind,
  OperationDefinitionNode,
  SelectionSetNode,
  ValueNode,
  parse,
} from "graphql"

interface Argument {
  name: string
  value?: unknown
}

interface Entity {
  property: string
  fields: string[]
  args?: Argument[]
}

class GraphQLParser {
  private ast: DocumentNode

  constructor(input: string, private variables?: { [key: string]: unknown }) {
    this.ast = parse(input)
    this.variables = variables || {}
  }

  private parseValueNode(valueNode: ValueNode): unknown {
    switch (valueNode.kind) {
      case Kind.VARIABLE:
        const variableName = valueNode.name.value
        return this.variables ? this.variables[variableName] : undefined
      case Kind.INT:
        return parseInt(valueNode.value, 10)
      case Kind.FLOAT:
        return parseFloat(valueNode.value)
      case Kind.BOOLEAN:
        return Boolean(valueNode.value)
      case Kind.STRING:
      case Kind.ENUM:
        return valueNode.value
      case Kind.NULL:
        return null
      case Kind.LIST:
        return valueNode.values.map((v) => this.parseValueNode(v))
      case Kind.OBJECT:
        let obj = {}
        for (const field of valueNode.fields) {
          obj[field.name.value] = this.parseValueNode(field.value)
        }
        return obj
      default:
        return undefined
    }
  }

  private parseArguments(
    args: readonly ArgumentNode[]
  ): Argument[] | undefined {
    if (!args.length) {
      return
    }

    return args.map((arg) => {
      const value = this.parseValueNode(arg.value)

      return {
        name: arg.name.value,
        value: value,
      }
    })
  }

  private extractEntities(
    node: SelectionSetNode,
    parentName = "",
    mainService = ""
  ): Entity[] {
    const entities: Entity[] = []

    node.selections.forEach((selection) => {
      if (selection.kind === "Field") {
        const fieldNode = selection as FieldNode

        if (fieldNode.selectionSet) {
          const entityName = parentName
            ? `${parentName}.${fieldNode.name.value}`
            : fieldNode.name.value

          const nestedEntity: Entity = {
            property: entityName.replace(`${mainService}.`, ""),
            fields: fieldNode.selectionSet.selections.map(
              (field) => (field as FieldNode).name.value
            ),
            args: this.parseArguments(fieldNode.arguments!),
          }

          entities.push(nestedEntity)
          entities.push(
            ...this.extractEntities(
              fieldNode.selectionSet,
              entityName,
              mainService
            )
          )
        }
      }
    })

    return entities
  }

  public parseQuery(): RemoteJoinerQuery {
    const queryDefinition = this.ast.definitions.find(
      (definition) => definition.kind === "OperationDefinition"
    ) as OperationDefinitionNode

    if (!queryDefinition) {
      throw new Error("No query found")
    }

    const rootFieldNode = queryDefinition.selectionSet
      .selections[0] as FieldNode

    const remoteJoinConfig: RemoteJoinerQuery = {
      service: rootFieldNode.name.value,
      fields: [],
      expands: [],
    }

    if (rootFieldNode.arguments) {
      remoteJoinConfig.args = this.parseArguments(rootFieldNode.arguments)
    }

    if (rootFieldNode.selectionSet) {
      remoteJoinConfig.fields = rootFieldNode.selectionSet.selections.map(
        (field) => (field as FieldNode).name.value
      )
      remoteJoinConfig.expands = this.extractEntities(
        rootFieldNode.selectionSet,
        rootFieldNode.name.value,
        rootFieldNode.name.value
      )
    }

    return remoteJoinConfig
  }
}

export default GraphQLParser
