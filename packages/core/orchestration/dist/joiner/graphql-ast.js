"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
class GraphQLParser {
    constructor(input, variables = {}) {
        this.variables = variables;
        this.ast = (0, graphql_1.parse)(input);
        this.variables = variables;
    }
    parseValueNode(valueNode) {
        const obj = {};
        switch (valueNode.kind) {
            case graphql_1.Kind.VARIABLE:
                return this.variables ? this.variables[valueNode.name.value] : undefined;
            case graphql_1.Kind.INT:
                return parseInt(valueNode.value, 10);
            case graphql_1.Kind.FLOAT:
                return parseFloat(valueNode.value);
            case graphql_1.Kind.BOOLEAN:
                return Boolean(valueNode.value);
            case graphql_1.Kind.STRING:
            case graphql_1.Kind.ENUM:
                return valueNode.value;
            case graphql_1.Kind.NULL:
                return null;
            case graphql_1.Kind.LIST:
                return valueNode.values.map((v) => this.parseValueNode(v));
            case graphql_1.Kind.OBJECT:
                for (const field of valueNode.fields) {
                    obj[field.name.value] = this.parseValueNode(field.value);
                }
                return obj;
            default:
                return undefined;
        }
    }
    parseArguments(args) {
        if (!args.length) {
            return;
        }
        return args.map((arg) => {
            const value = this.parseValueNode(arg.value);
            return {
                name: arg.name.value,
                value: value,
            };
        });
    }
    parseDirectives(directives) {
        return directives.map((directive) => ({
            name: directive.name.value,
            args: this.parseArguments(directive.arguments || []),
        }));
    }
    createDirectivesMap(selectionSet) {
        const directivesMap = {};
        let hasDirectives = false;
        selectionSet.selections.forEach((field) => {
            const fieldName = field.name.value;
            const fieldDirectives = this.parseDirectives(field.directives || []);
            if (fieldDirectives.length > 0) {
                hasDirectives = true;
                directivesMap[fieldName] = fieldDirectives;
            }
        });
        return hasDirectives ? directivesMap : undefined;
    }
    extractEntities(node, parentName = "", mainService = "") {
        const entities = [];
        node.selections.forEach((selection) => {
            if (selection.kind === "Field") {
                const fieldNode = selection;
                if (!fieldNode.selectionSet) {
                    return;
                }
                const propName = fieldNode.name.value;
                const entityName = parentName ? `${parentName}.${propName}` : propName;
                const nestedEntity = {
                    property: entityName.replace(`${mainService}.`, ""),
                    fields: fieldNode.selectionSet.selections.map((field) => field.name.value),
                    args: this.parseArguments(fieldNode.arguments || []),
                    directives: this.createDirectivesMap(fieldNode.selectionSet),
                };
                entities.push(nestedEntity);
                entities.push(...this.extractEntities(fieldNode.selectionSet, entityName, mainService));
            }
        });
        return entities;
    }
    parseQuery() {
        const queryDefinition = this.ast.definitions.find((definition) => definition.kind === "OperationDefinition");
        if (!queryDefinition) {
            throw new Error("No query found");
        }
        const rootFieldNode = queryDefinition.selectionSet
            .selections[0];
        const propName = rootFieldNode.name.value;
        const remoteJoinConfig = {
            alias: propName,
            fields: [],
            expands: [],
        };
        if (rootFieldNode.arguments) {
            remoteJoinConfig.args = this.parseArguments(rootFieldNode.arguments);
        }
        if (rootFieldNode.selectionSet) {
            remoteJoinConfig.fields = rootFieldNode.selectionSet.selections.map((field) => field.name.value);
            remoteJoinConfig.directives = this.createDirectivesMap(rootFieldNode.selectionSet);
            remoteJoinConfig.expands = this.extractEntities(rootFieldNode.selectionSet, propName, propName);
        }
        return remoteJoinConfig;
    }
}
exports.default = GraphQLParser;
//# sourceMappingURL=graphql-ast.js.map