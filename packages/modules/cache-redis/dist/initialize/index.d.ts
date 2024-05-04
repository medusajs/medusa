import { ExternalModuleDeclaration } from "@medusajs/modules-sdk";
import { ICacheService } from "@medusajs/types";
import { RedisCacheModuleOptions } from "../types";
export declare const initialize: (options?: RedisCacheModuleOptions | ExternalModuleDeclaration) => Promise<ICacheService>;
