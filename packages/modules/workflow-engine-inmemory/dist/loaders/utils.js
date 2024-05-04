"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const utils_1 = require("../utils");
exports.default = async ({ container }) => {
    container.register({
        inMemoryDistributedTransactionStorage: (0, awilix_1.asClass)(utils_1.InMemoryDistributedTransactionStorage).singleton(),
    });
};
