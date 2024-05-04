import { moduleDefinition } from "./module-definition";
export default moduleDefinition;
export declare const runMigrations: ({ options, logger, }?: Pick<import("@medusajs/modules-sdk").LoaderOptions<import("@medusajs/modules-sdk").ModuleServiceInitializeOptions>, "options" | "logger"> | undefined) => Promise<void>;
export declare const revertMigration: ({ options, logger, }?: Pick<import("@medusajs/modules-sdk").LoaderOptions<import("@medusajs/modules-sdk").ModuleServiceInitializeOptions>, "options" | "logger"> | undefined) => Promise<void>;
export * from "./initialize";
export * from "./loaders";
//# sourceMappingURL=index.d.ts.map