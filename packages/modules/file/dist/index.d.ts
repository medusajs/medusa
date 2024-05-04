import { moduleDefinition } from "./module-definition";
export * from "./types";
export * from "./services";
export declare const initialize: (options?: import("@medusajs/modules-sdk").ModuleServiceInitializeOptions | import("@medusajs/modules-sdk").ModuleServiceInitializeCustomDataLayerOptions | import("@medusajs/modules-sdk").InternalModuleDeclaration | import("@medusajs/modules-sdk").ExternalModuleDeclaration | undefined, injectedDependencies?: any) => Promise<unknown>;
export declare const runMigrations: ((options: import("@medusajs/modules-sdk").LoaderOptions<any>, moduleDeclaration?: import("@medusajs/modules-sdk").InternalModuleDeclaration | undefined) => Promise<void>) | undefined;
export declare const revertMigration: ((options: import("@medusajs/modules-sdk").LoaderOptions<any>, moduleDeclaration?: import("@medusajs/modules-sdk").InternalModuleDeclaration | undefined) => Promise<void>) | undefined;
export default moduleDefinition;
