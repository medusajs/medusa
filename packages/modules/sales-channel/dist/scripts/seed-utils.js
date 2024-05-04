"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSalesChannels = void 0;
const _models_1 = require("../models");
async function createSalesChannels(manager, data) {
    const channels = data.map((channel) => {
        return manager.create(_models_1.SalesChannel, channel);
    });
    await manager.persistAndFlush(channels);
    return channels;
}
exports.createSalesChannels = createSalesChannels;
