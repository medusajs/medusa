import { LoaderOptions } from "@medusajs/modules-sdk";
import { InternalModuleDeclaration, ModuleJoinerConfig, ModulesSdkTypes } from "@medusajs/types";
export declare function containerLoader(entity: any, joinerConfig: ModuleJoinerConfig): ({ options, container, }: LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions>, moduleDeclaration?: InternalModuleDeclaration) => Promise<void>;
