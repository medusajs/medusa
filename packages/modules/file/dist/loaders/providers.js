"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_sdk_1 = require("@medusajs/modules-sdk");
const _services_1 = require("../services");
const _types_1 = require("../types");
const awilix_1 = require("awilix");
const registrationFn = async (klass, container, pluginOptions) => {
    Object.entries(pluginOptions.config || []).map(([name, config]) => {
        const key = _services_1.FileProviderService.getRegistrationIdentifier(klass, name);
        container.register({
            [_types_1.FileProviderRegistrationPrefix + key]: (0, awilix_1.asFunction)((cradle) => new klass(cradle, config), {
                lifetime: klass.LIFE_TIME || awilix_1.Lifetime.SINGLETON,
            }),
        });
        container.registerAdd(_types_1.FileProviderIdentifierRegistrationName, (0, awilix_1.asValue)(key));
    });
};
exports.default = async ({ container, options, }) => {
    await (0, modules_sdk_1.moduleProviderLoader)({
        container,
        providers: options?.providers || [],
        registerServiceFn: registrationFn,
    });
};
