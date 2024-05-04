"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const _models_1 = require("../models");
class PriceListService extends utils_1.ModulesSdkUtils.internalModuleServiceFactory(_models_1.PriceList) {
    constructor(container) {
        // @ts-ignore
        super(...arguments);
    }
    async create(data, sharedContext) {
        const data_ = Array.isArray(data) ? data : [data];
        const priceLists = this.normalizePriceListDate(data_);
        return await super.create(priceLists, sharedContext);
    }
    // TODO: Add support for selector? and then rm ts ignore
    // @ts-ignore
    async update(data, sharedContext) {
        const data_ = Array.isArray(data) ? data : [data];
        const priceLists = this.normalizePriceListDate(data_);
        return await super.update(priceLists, sharedContext);
    }
    normalizePriceListDate(data) {
        return data.map((priceListData) => {
            if (!!priceListData.starts_at) {
                priceListData.starts_at = (0, utils_1.GetIsoStringFromDate)(priceListData.starts_at);
            }
            if (!!priceListData.ends_at) {
                priceListData.ends_at = (0, utils_1.GetIsoStringFromDate)(priceListData.ends_at);
            }
            return priceListData;
        });
    }
}
exports.default = PriceListService;
