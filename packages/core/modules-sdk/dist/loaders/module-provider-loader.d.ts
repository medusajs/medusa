import { MedusaContainer, ModuleProvider } from "@medusajs/types";
export declare function moduleProviderLoader({ container, providers, registerServiceFn, }: {
    container: MedusaContainer;
    providers: ModuleProvider[];
    registerServiceFn?: (klass: any, container: MedusaContainer, pluginDetails: any) => Promise<void>;
}): Promise<void>;
export declare function loadModuleProvider(container: MedusaContainer, provider: ModuleProvider, registerServiceFn?: (klass: any, container: any, pluginDetails: any) => Promise<void>): Promise<any[]>;
