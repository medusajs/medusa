/**
 * Recursively get set of packages that depend on given package.
 * Set also includes passed package.
 */
export function getDependantPackages({ packageName, depTree, packagesToPublish, }: {
    packageName: any;
    depTree: any;
    packagesToPublish?: Set<any> | undefined;
}): Set<any>;
