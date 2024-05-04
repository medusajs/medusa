import { ExternalModuleDeclaration } from "@medusajs/modules-sdk";
import { ICacheService } from "@medusajs/types";
import { InMemoryCacheModuleOptions } from "../types";
export declare const initialize: (options?: InMemoryCacheModuleOptions | ExternalModuleDeclaration) => Promise<ICacheService>;
