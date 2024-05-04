import { AuthModuleProviderConfig, LoaderOptions, ModulesSdkTypes } from "@medusajs/types";
type AuthModuleProviders = {
    providers: AuthModuleProviderConfig[];
};
declare const _default: ({ container, options, }: LoaderOptions<(ModulesSdkTypes.ModuleServiceInitializeOptions | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions) & AuthModuleProviders>) => Promise<void>;
export default _default;
