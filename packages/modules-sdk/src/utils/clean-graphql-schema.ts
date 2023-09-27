import { Kind, parse, print, visit } from "graphql"

export function cleanGraphQLSchema(schema: string): {
  schema: string
  notFound: Record<string, Record<string, string>>
} {
  const extractTypeName = (type) => {
    if (type.kind === Kind.NAMED_TYPE) {
      return type.name.value
    }
    if (type.kind === Kind.NON_NULL_TYPE || type.kind === Kind.LIST_TYPE) {
      return extractTypeName(type.type)
    }
    return null
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

  const cleanedAst = visit(ast, {
    ObjectTypeExtension: {
      enter(node) {
        const typeName = node.name.value
        if (!typeNames.has(typeName)) {
          nonExistingMap[typeName] ??= {}
          nonExistingMap[typeName]["__extended"] = ""
          return null
        }
        return
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
        const typeName = extractTypeName(node.type)

        if (!typeNames.has(typeName) && node.type.kind === Kind.NAMED_TYPE) {
          const currentParent = parentStack[parentStack.length - 1]

          nonExistingMap[currentParent] ??= {}
          nonExistingMap[currentParent][node.name.value] = typeName
          return null
        }
        return
      },
    },
  })

  return {
    schema: print(cleanedAst),
    notFound: nonExistingMap,
  }
}
