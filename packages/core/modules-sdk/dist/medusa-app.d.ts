import { RemoteFetchDataCallback } from "@medusajs/orchestration";
import { MedusaAppOptions, MedusaAppOutput } from "@medusajs/types";
export declare function loadModules(modulesConfig: any, sharedContainer: any, migrationOnly?: boolean, loaderOnly?: boolean, workerMode?: "shared" | "worker" | "server"): Promise<{}>;
export declare function MedusaApp(options?: MedusaAppOptions<RemoteFetchDataCallback>): Promise<MedusaAppOutput>;
export declare function MedusaAppMigrateUp(options?: MedusaAppOptions<RemoteFetchDataCallback>): Promise<void>;
