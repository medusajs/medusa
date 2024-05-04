import { JoinerRelationship, ModuleJoinerConfig } from "@medusajs/types";
import { EntitySchema } from "@mikro-orm/core";
export declare function generateEntity(joinerConfig: ModuleJoinerConfig, primary: JoinerRelationship, foreign: JoinerRelationship): EntitySchema<any, never>;
