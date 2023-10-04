import { Kind, parse, print, visit } from "graphql"

export function cleanGraphQLSchema(schema: string): {
  schema: string
  notFound: Record<string, Record<string, string>>
} {
  const extractTypeNameAndKind = (type) => {
    if (type.kind === Kind.NAMED_TYPE) {
      return [type.name.value, type.kind]
    }
    if (type.kind === Kind.NON_NULL_TYPE || type.kind === Kind.LIST_TYPE) {
      return extractTypeNameAndKind(type.type)
    }
    return [null, null]
  }

  const ast = parse(schema)

  const typeNames = new Set(["String", "Int", "Float", "Boolean", "ID"])
  const extendedTypes = new Set()

  const kinds = [
    Kind.OBJECT_TYPE_DEFINITION,
    Kind.INTERFACE_TYPE_DEFINITION,
    Kind.ENUM_TYPE_DEFINITION,
    Kind.SCALAR_TYPE_DEFINITION,
    Kind.INPUT_OBJECT_TYPE_DEFINITION,
    Kind.UNION_TYPE_DEFINITION,
  ]
  ast.definitions.forEach((def: any) => {
    if (kinds.includes(def.kind)) {
      typeNames.add(def.name.value)
    } else if (def.kind === Kind.OBJECT_TYPE_EXTENSION) {
      extendedTypes.add(def.name.value)
    }
  })

  const nonExistingMap: Record<string, Record<string, string>> = {}
  const parentStack: string[] = []

  /*
    Traverse the graph mapping all the entities + fields and removing the ones that don't exist.
    Extensions are not removed, but marked with a "__extended" key if the main entity doesn't exist. (example: Link modules injecting fields into another module)
  */
  const cleanedAst = visit(ast, {
    ObjectTypeExtension: {
      enter(node) {
        const typeName = node.name.value

        parentStack.push(typeName)
        if (!typeNames.has(typeName)) {
          nonExistingMap[typeName] ??= {}
          nonExistingMap[typeName]["__extended"] = ""
          return null
        }
        return
      },
      leave() {
        parentStack.pop()
      },
    },
    ObjectTypeDefinition: {
      enter(node) {
        parentStack.push(node.name.value)
      },
      leave() {
        parentStack.pop()
      },
    },
    FieldDefinition: {
      leave(node) {
        const [typeName, kind] = extractTypeNameAndKind(node.type)

        if (!typeNames.has(typeName) && kind === Kind.NAMED_TYPE) {
          const currentParent = parentStack[parentStack.length - 1]

          nonExistingMap[currentParent] ??= {}
          nonExistingMap[currentParent][node.name.value] = typeName
          return null
        }
        return
      },
    },
  })

  // Return the schema and the map of non existing entities and fields
  return {
    schema: print(cleanedAst),
    notFound: nonExistingMap,
  }
}
