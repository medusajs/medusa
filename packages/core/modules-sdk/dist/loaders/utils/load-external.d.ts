import { Logger, MedusaContainer, ModuleResolution } from "@medusajs/types";
export declare function loadExternalModule(container: MedusaContainer, resolution: ModuleResolution, logger: Logger): Promise<{
    error?: Error;
} | void>;
