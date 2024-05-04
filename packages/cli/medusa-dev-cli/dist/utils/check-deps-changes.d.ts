export function checkDepsChanges({ newPath, packageName, monoRepoPackages, isInitialScan, ignoredPackageJSON, packageNameToPath, }: {
    newPath: any;
    packageName: any;
    monoRepoPackages: any;
    isInitialScan: any;
    ignoredPackageJSON: any;
    packageNameToPath: any;
}): Promise<{
    didDepsChanged: boolean;
    packageNotInstalled: boolean;
}>;
