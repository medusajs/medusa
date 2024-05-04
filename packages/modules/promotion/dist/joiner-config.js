"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const _models_1 = require("./models");
exports.LinkableKeys = {
    promotion_id: _models_1.Promotion.name,
    campaign_id: _models_1.Campaign.name,
    promotion_rule_id: _models_1.PromotionRule.name,
};
exports.entityNameToLinkableKeysMap = (0, utils_1.generateLinkableKeysMap)(exports.LinkableKeys);
exports.joinerConfig = {
    serviceName: modules_sdk_1.Modules.PROMOTION,
    primaryKeys: ["id"],
    linkableKeys: exports.LinkableKeys,
    alias: [
        {
            name: ["promotion", "promotions"],
            args: {
                entity: _models_1.Promotion.name,
            },
        },
        {
            name: ["campaign", "campaigns"],
            args: {
                entity: _models_1.Campaign.name,
                methodSuffix: "Campaigns",
            },
        },
        {
            name: ["promotion_rule", "promotion_rules"],
            args: {
                entity: _models_1.PromotionRule.name,
                methodSuffix: "PromotionRules",
            },
        },
    ],
};
