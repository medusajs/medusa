import { ExternalModuleDeclaration, InternalModuleDeclaration } from "@medusajs/modules-sdk";
import { ModulesSdkTypes } from "@medusajs/types";
import { IWorkflowEngineService } from "@medusajs/workflows-sdk";
import { InitializeModuleInjectableDependencies } from "../types";
export declare const initialize: (options?: ModulesSdkTypes.ModuleServiceInitializeOptions | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions | ExternalModuleDeclaration | InternalModuleDeclaration, injectedDependencies?: InitializeModuleInjectableDependencies) => Promise<IWorkflowEngineService>;
//# sourceMappingURL=index.d.ts.map