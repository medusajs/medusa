import { LoaderOptions, ModulesSdkTypes } from "@medusajs/types";
export declare function run({ options, logger, path, }: Partial<Pick<LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>, "options" | "logger">> & {
    path: string;
}): Promise<void>;
