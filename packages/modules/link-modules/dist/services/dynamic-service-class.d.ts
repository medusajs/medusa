import { Constructor, ILinkModule, ModuleJoinerConfig } from "@medusajs/types";
export declare function getModuleService(joinerConfig: ModuleJoinerConfig): Constructor<ILinkModule>;
export declare function getReadOnlyModuleService(joinerConfig: ModuleJoinerConfig): {
    new (): {
        __joinerConfig(): ModuleJoinerConfig;
    };
};
