import { LoaderOptions, MedusaContainer } from "@medusajs/types";
type RepositoryLoaderOptions = {
    moduleModels: Record<string, any>;
    moduleRepositories?: Record<string, any>;
    customRepositories: Record<string, any>;
    container: MedusaContainer;
};
type ServiceLoaderOptions = {
    moduleModels: Record<string, any>;
    moduleServices: Record<string, any>;
    container: MedusaContainer;
};
/**
 * Factory for creating a container loader for a module.
 *
 * @param moduleModels
 * @param moduleServices
 * @param moduleRepositories
 * @param customRepositoryLoader The default repository loader is based on mikro orm. If you want to use a custom repository loader, you can pass it here.
 */
export declare function moduleContainerLoaderFactory({ moduleModels, moduleServices, moduleRepositories, customRepositoryLoader, }: {
    moduleModels: Record<string, any>;
    moduleServices: Record<string, any>;
    moduleRepositories?: Record<string, any>;
    customRepositoryLoader?: (options: RepositoryLoaderOptions) => void;
}): ({ container, options }: LoaderOptions) => Promise<void>;
/**
 * Load the services from the module services object. If a service is not
 * present a default service will be created for the model.
 *
 * @param moduleModels
 * @param moduleServices
 * @param container
 */
export declare function loadModuleServices({ moduleModels, moduleServices, container, }: ServiceLoaderOptions): void;
/**
 * Load the repositories from the custom repositories object. If a repository is not
 * present in the custom repositories object, the default repository will be used from the module repository.
 * If none are present, a default repository will be created for the model.
 *
 * @param moduleModels
 * @param moduleRepositories
 * @param customRepositories
 * @param container
 */
export declare function loadModuleRepositories({ moduleModels, moduleRepositories, customRepositories, container, }: RepositoryLoaderOptions): void;
export {};
