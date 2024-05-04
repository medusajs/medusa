export type TraversePackagesDepsReturn = {
    /**
     * Lookup table to check dependants for given package.
     * Used to determine which packages need to be published.
     */
    depTree: any;
};
/**
 * @typedef {Object} TraversePackagesDepsReturn
 * @property {Object} depTree Lookup table to check dependants for given package.
 * Used to determine which packages need to be published.
 * @example
 * ```
 * {
 *   "medusa-cli": Set(["medusa"]),
 *   "medusa-telemetry": Set(["medusa", "medusa-cli"]),
 * }
 * ```
 */
/**
 * Compile final list of packages to watch
 * This will include packages explicitly defined packages and all their dependencies
 * Also creates dependency graph that is used later to determine which packages
 * would need to be published when their dependencies change
 * @param {Object} $0
 * @param {String} $0.root Path to root of medusa monorepo repository
 * @param {String[]} $0.packages Initial array of packages to watch
 * This can be extracted from project dependencies or explicitly set by `--packages` flag
 * @param {String[]} $0.monoRepoPackages Array of packages in medusa monorepo
 * @param {String[]} [$0.seenPackages] Array of packages that were already traversed.
 * This makes sure dependencies are extracted one time for each package and avoid any
 * infinite loops.
 * @param {DepTree} [$0.depTree] Used internally to recursively construct dependency graph.
 * @return {TraversePackagesDepsReturn}
 */
export function traversePackagesDeps({ packages, monoRepoPackages, seenPackages, depTree, packageNameToPath, }: {
    root: string;
    packages: string[];
    monoRepoPackages: string[];
    seenPackages?: string[] | undefined;
    depTree?: any;
}): TraversePackagesDepsReturn;
