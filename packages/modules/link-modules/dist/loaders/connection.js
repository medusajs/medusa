"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionLoader = void 0;
const utils_1 = require("@medusajs/utils");
function connectionLoader(entity) {
    return async ({ options, container, logger, }, moduleDeclaration) => {
        const pathToMigrations = __dirname + "/../migrations";
        await utils_1.ModulesSdkUtils.mikroOrmConnectionLoader({
            moduleName: "link_module",
            entities: [entity],
            container,
            options,
            moduleDeclaration,
            logger,
            pathToMigrations,
        });
    };
}
exports.connectionLoader = connectionLoader;
