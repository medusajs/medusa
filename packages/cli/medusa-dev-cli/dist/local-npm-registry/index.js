var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const startVerdaccio = require(`verdaccio`).default;
const fs = require(`fs-extra`);
const _ = require(`lodash`);
let VerdaccioInitPromise = null;
const { verdaccioConfig } = require(`./verdaccio-config`);
const { publishPackage } = require(`./publish-package`);
const { installPackages } = require(`./install-packages`);
const startServer = () => {
    if (VerdaccioInitPromise) {
        return VerdaccioInitPromise;
    }
    console.log(`Starting local verdaccio server`);
    // clear storage
    fs.removeSync(verdaccioConfig.storage);
    VerdaccioInitPromise = new Promise((resolve) => {
        startVerdaccio(verdaccioConfig, verdaccioConfig.port, verdaccioConfig.storage, `1.0.0`, `medusa-dev`, (webServer, addr, pkgName, pkgVersion) => {
            // console.log(webServer)
            webServer.listen(addr.port || addr.path, addr.host, () => {
                console.log(`Started local verdaccio server`);
                resolve();
            });
        });
    });
    return VerdaccioInitPromise;
};
exports.startVerdaccio = startServer;
exports.publishPackagesLocallyAndInstall = ({ packagesToPublish, localPackages, packageNameToPath, ignorePackageJSONChanges, yarnWorkspaceRoot, externalRegistry, root, }) => __awaiter(this, void 0, void 0, function* () {
    yield startServer();
    const versionPostFix = Date.now();
    const newlyPublishedPackageVersions = {};
    for (const packageName of packagesToPublish) {
        newlyPublishedPackageVersions[packageName] = yield publishPackage({
            packageName,
            packagesToPublish,
            packageNameToPath,
            versionPostFix,
            ignorePackageJSONChanges,
            root,
        });
    }
    const packagesToInstall = _.intersection(packagesToPublish, localPackages);
    yield installPackages({
        packagesToInstall,
        yarnWorkspaceRoot,
        newlyPublishedPackageVersions,
        externalRegistry,
    });
});
//# sourceMappingURL=index.js.map