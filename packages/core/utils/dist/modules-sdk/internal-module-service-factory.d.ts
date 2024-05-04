import { ModulesSdkTypes } from "@medusajs/types";
export declare function internalModuleServiceFactory<TContainer extends object = object>(model: any): {
    new <TEntity extends object = any>(container: TContainer): ModulesSdkTypes.InternalModuleService<TEntity, TContainer>;
};
