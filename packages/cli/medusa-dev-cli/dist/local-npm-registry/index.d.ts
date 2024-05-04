export { startServer as startVerdaccio };
export function publishPackagesLocallyAndInstall({ packagesToPublish, localPackages, packageNameToPath, ignorePackageJSONChanges, yarnWorkspaceRoot, externalRegistry, root, }: {
    packagesToPublish: any;
    localPackages: any;
    packageNameToPath: any;
    ignorePackageJSONChanges: any;
    yarnWorkspaceRoot: any;
    externalRegistry: any;
    root: any;
}): Promise<void>;
declare function startServer(): any;
