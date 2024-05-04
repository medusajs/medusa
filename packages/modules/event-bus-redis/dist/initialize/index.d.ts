import { ExternalModuleDeclaration } from "@medusajs/modules-sdk";
import { IEventBusService } from "@medusajs/types";
import { EventBusRedisModuleOptions } from "../types";
export declare const initialize: (options?: EventBusRedisModuleOptions | ExternalModuleDeclaration) => Promise<IEventBusService>;
