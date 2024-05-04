import { ModuleServiceInitializeOptions } from "@medusajs/types";
type Options = ModuleServiceInitializeOptions["database"];
/**
 * Create a new knex (pg in the future) connection which can be reused and shared
 * @param options
 */
export declare function createPgConnection(options: Options): import("@mikro-orm/knex").Knex<any, any>;
export {};
