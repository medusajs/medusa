"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const utils_1 = require("../utils");
exports.default = async ({ container, dataLoaderOnly }) => {
    container.register({
        redisDistributedTransactionStorage: (0, awilix_1.asClass)(utils_1.RedisDistributedTransactionStorage).singleton(),
        dataLoaderOnly: (0, awilix_1.asValue)(!!dataLoaderOnly),
    });
};
