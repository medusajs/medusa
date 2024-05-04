/**
 * Load the repositories from the custom repositories object. If a repository is not
 * present in the custom repositories object, the default repository will be used.
 *
 * @param customRepositories
 * @param container
 */
export declare function loadCustomRepositories({ defaultRepositories, customRepositories, container, }: {
    defaultRepositories: any;
    customRepositories: any;
    container: any;
}): void;
