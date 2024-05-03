import { RemoteJoinerQuery } from "@medusajs/types"
import {
  ArgumentNode,
  DirectiveNode,
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

interface Directive {
  name: string
  args?: Argument[]
}

interface Entity {
  property: string
  fields: string[]
  args?: Argument[]
  directives?: { [field: string]: Directive[] }
}

class GraphQLParser {
  private ast: DocumentNode

  constructor(input: string, private variables: Record<string, unknown> = {}) {
    this.ast = parse(input)
    this.variables = variables
  }

  private parseValueNode(valueNode: ValueNode): unknown {
    const obj = {}

    switch (valueNode.kind) {
      case Kind.VARIABLE:
        return this.variables ? this.variables[valueNode.name.value] : undefined
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

  private parseDirectives(directives: readonly DirectiveNode[]): Directive[] {
    return directives.map((directive) => ({
      name: directive.name.value,
      args: this.parseArguments(directive.arguments || []),
    }))
  }

  private createDirectivesMap(selectionSet: SelectionSetNode):
    | {
        [field: string]: Directive[]
      }
    | undefined {
    const directivesMap: { [field: string]: Directive[] } = {}
    let hasDirectives = false
    selectionSet.selections.forEach((field) => {
      const fieldName = (field as FieldNode).name.value
      const fieldDirectives = this.parseDirectives(
        (field as FieldNode).directives || []
      )
      if (fieldDirectives.length > 0) {
        hasDirectives = true
        directivesMap[fieldName] = fieldDirectives
      }
    })
    return hasDirectives ? directivesMap : undefined
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

        if (!fieldNode.selectionSet) {
          return
        }

        const propName = fieldNode.name.value
        const entityName = parentName ? `${parentName}.${propName}` : propName

        const nestedEntity: Entity = {
          property: entityName.replace(`${mainService}.`, ""),
          fields: fieldNode.selectionSet.selections.map(
            (field) => (field as FieldNode).name.value
          ),
          args: this.parseArguments(fieldNode.arguments || []),
          directives: this.createDirectivesMap(fieldNode.selectionSet),
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
    const propName = rootFieldNode.name.value

    const remoteJoinConfig: RemoteJoinerQuery = {
      alias: propName,
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
      remoteJoinConfig.directives = this.createDirectivesMap(
        rootFieldNode.selectionSet
      )
      remoteJoinConfig.expands = this.extractEntities(
        rootFieldNode.selectionSet,
        propName,
        propName
      )
    }

    return remoteJoinConfig
  }
}

export default GraphQLParser
