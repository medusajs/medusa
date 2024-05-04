"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanGraphQLSchema = void 0;
const graphql_1 = require("graphql");
function cleanGraphQLSchema(schema) {
    const extractTypeNameAndKind = (type) => {
        if (type.kind === graphql_1.Kind.NAMED_TYPE) {
            return [type.name.value, type.kind];
        }
        if (type.kind === graphql_1.Kind.NON_NULL_TYPE || type.kind === graphql_1.Kind.LIST_TYPE) {
            return extractTypeNameAndKind(type.type);
        }
        return [null, null];
    };
    const ast = (0, graphql_1.parse)(schema);
    const typeNames = new Set(["String", "Int", "Float", "Boolean", "ID"]);
    const extendedTypes = new Set();
    const kinds = [
        graphql_1.Kind.OBJECT_TYPE_DEFINITION,
        graphql_1.Kind.INTERFACE_TYPE_DEFINITION,
        graphql_1.Kind.ENUM_TYPE_DEFINITION,
        graphql_1.Kind.SCALAR_TYPE_DEFINITION,
        graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION,
        graphql_1.Kind.UNION_TYPE_DEFINITION,
    ];
    ast.definitions.forEach((def) => {
        if (kinds.includes(def.kind)) {
            typeNames.add(def.name.value);
        }
        else if (def.kind === graphql_1.Kind.OBJECT_TYPE_EXTENSION) {
            extendedTypes.add(def.name.value);
        }
    });
    const nonExistingMap = {};
    const parentStack = [];
    /*
      Traverse the graph mapping all the entities + fields and removing the ones that don't exist.
      Extensions are not removed, but marked with a "__extended" key if the main entity doesn't exist. (example: Link modules injecting fields into another module)
    */
    const cleanedAst = (0, graphql_1.visit)(ast, {
        ObjectTypeExtension: {
            enter(node) {
                const typeName = node.name.value;
                parentStack.push(typeName);
                if (!typeNames.has(typeName)) {
                    nonExistingMap[typeName] ?? (nonExistingMap[typeName] = {});
                    nonExistingMap[typeName]["__extended"] = "";
                    return null;
                }
                return;
            },
            leave() {
                parentStack.pop();
            },
        },
        ObjectTypeDefinition: {
            enter(node) {
                parentStack.push(node.name.value);
            },
            leave() {
                parentStack.pop();
            },
        },
        FieldDefinition: {
            leave(node) {
                const [typeName, kind] = extractTypeNameAndKind(node.type);
                if (!typeNames.has(typeName) && kind === graphql_1.Kind.NAMED_TYPE) {
                    const currentParent = parentStack[parentStack.length - 1];
                    nonExistingMap[currentParent] ?? (nonExistingMap[currentParent] = {});
                    nonExistingMap[currentParent][node.name.value] = typeName;
                    return null;
                }
                return;
            },
        },
    });
    // Return the schema and the map of non existing entities and fields
    return {
        schema: (0, graphql_1.print)(cleanedAst),
        notFound: nonExistingMap,
    };
}
exports.cleanGraphQLSchema = cleanGraphQLSchema;
//# sourceMappingURL=clean-graphql-schema.js.map