import { ModuleJoinerConfig, ModuleJoinerRelationship } from "@medusajs/types";
export declare function generateGraphQLSchema(joinerConfig: ModuleJoinerConfig, primary: ModuleJoinerRelationship, foreign: ModuleJoinerRelationship, { logger }?: {
    logger: any;
}): string;
