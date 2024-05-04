import { JoinerRelationship, LoaderOptions, ModuleJoinerConfig, ModuleServiceInitializeOptions } from "@medusajs/types";
export declare function getMigration(joinerConfig: ModuleJoinerConfig, serviceName: string, primary: JoinerRelationship, foreign: JoinerRelationship): ({ options, logger, }?: Pick<LoaderOptions<ModuleServiceInitializeOptions>, "options" | "logger">) => Promise<void>;
