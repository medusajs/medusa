import { JoinerRelationship, ModuleJoinerConfig, ModuleLoaderFunction } from "@medusajs/types";
export declare function getLoaders({ joinerConfig, primary, foreign, }: {
    joinerConfig: ModuleJoinerConfig;
    primary: JoinerRelationship;
    foreign: JoinerRelationship;
}): ModuleLoaderFunction[];
