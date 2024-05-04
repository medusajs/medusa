import { RemoteJoinerQuery } from "@medusajs/types";
declare class GraphQLParser {
    private variables;
    private ast;
    constructor(input: string, variables?: Record<string, unknown>);
    private parseValueNode;
    private parseArguments;
    private parseDirectives;
    private createDirectivesMap;
    private extractEntities;
    parseQuery(): RemoteJoinerQuery;
}
export default GraphQLParser;
