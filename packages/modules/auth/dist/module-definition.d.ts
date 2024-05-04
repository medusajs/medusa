import { ModuleExports } from "@medusajs/types";
export declare const runMigrations: ({ options, logger, }?: Pick<import("@medusajs/types").LoaderOptions<import("@medusajs/types").ModuleServiceInitializeOptions>, "options" | "logger"> | undefined) => Promise<void>;
export declare const revertMigration: ({ options, logger, }?: Pick<import("@medusajs/types").LoaderOptions<import("@medusajs/types").ModuleServiceInitializeOptions>, "options" | "logger"> | undefined) => Promise<void>;
export declare const moduleDefinition: ModuleExports;
