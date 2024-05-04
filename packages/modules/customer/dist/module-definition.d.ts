import { ModuleExports } from "@medusajs/types";
export declare const revertMigration: ({ options, logger, }?: Pick<import("@medusajs/modules-sdk").LoaderOptions<import("@medusajs/modules-sdk").ModuleServiceInitializeOptions>, "options" | "logger"> | undefined) => Promise<void>;
export declare const runMigrations: ({ options, logger, }?: Pick<import("@medusajs/modules-sdk").LoaderOptions<import("@medusajs/modules-sdk").ModuleServiceInitializeOptions>, "options" | "logger"> | undefined) => Promise<void>;
export declare const moduleDefinition: ModuleExports;
