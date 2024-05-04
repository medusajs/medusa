import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types";
import * as providers from "../providers";
declare const _default: ({ container, options, }: LoaderOptions<(ModulesSdkTypes.ModuleServiceInitializeOptions | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions) & {
    providers: ModuleProvider[];
}>) => Promise<void>;
export default _default;
