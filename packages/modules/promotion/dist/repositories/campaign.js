"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignRepository = void 0;
const utils_1 = require("@medusajs/utils");
const _models_1 = require("../models");
class CampaignRepository extends utils_1.DALUtils.mikroOrmBaseRepositoryFactory(_models_1.Campaign) {
    async create(data, context = {}) {
        const manager = this.getActiveManager(context);
        const promotionIdsToUpsert = [];
        const campaignIdentifierPromotionsMap = new Map();
        data.forEach((campaignData) => {
            const campaignPromotionIds = campaignData.promotions?.map((p) => p.id) || [];
            promotionIdsToUpsert.push(...campaignPromotionIds);
            campaignIdentifierPromotionsMap.set(campaignData.campaign_identifier, campaignPromotionIds);
            delete campaignData.promotions;
        });
        const existingPromotions = await manager.find(_models_1.Promotion, {
            id: promotionIdsToUpsert,
        });
        const existingPromotionsMap = new Map(existingPromotions.map((promotion) => [promotion.id, promotion]));
        const createdCampaigns = await super.create(data, context);
        for (const createdCampaign of createdCampaigns) {
            const campaignPromotionIds = campaignIdentifierPromotionsMap.get(createdCampaign.campaign_identifier) || [];
            for (const campaignPromotionId of campaignPromotionIds) {
                const promotion = existingPromotionsMap.get(campaignPromotionId);
                if (!promotion) {
                    continue;
                }
                createdCampaign.promotions.add(promotion);
            }
        }
        return createdCampaigns;
    }
    async update(data, context = {}) {
        const manager = this.getActiveManager(context);
        const promotionIdsToUpsert = [];
        const campaignIds = [];
        const campaignPromotionIdsMap = new Map();
        data.forEach(({ update: campaignData }) => {
            const campaignPromotionIds = campaignData.promotions?.map((p) => p.id);
            campaignIds.push(campaignData.id);
            if (campaignPromotionIds) {
                promotionIdsToUpsert.push(...campaignPromotionIds);
                campaignPromotionIdsMap.set(campaignData.id, campaignPromotionIds);
            }
            delete campaignData.promotions;
        });
        const existingCampaigns = await manager.find(_models_1.Campaign, { id: campaignIds }, { populate: ["promotions"] });
        const promotionIds = existingCampaigns
            .map((campaign) => campaign.promotions?.map((p) => p.id))
            .flat(1)
            .concat(promotionIdsToUpsert);
        const existingPromotions = await manager.find(_models_1.Promotion, {
            id: promotionIds,
        });
        const existingCampaignsMap = new Map(existingCampaigns.map((campaign) => [campaign.id, campaign]));
        const existingPromotionsMap = new Map(existingPromotions.map((promotion) => [promotion.id, promotion]));
        const updatedCampaigns = await super.update(data, context);
        for (const updatedCampaign of updatedCampaigns) {
            const upsertPromotionIds = campaignPromotionIdsMap.get(updatedCampaign.id);
            if (!upsertPromotionIds) {
                continue;
            }
            const existingPromotionIds = (existingCampaignsMap.get(updatedCampaign.id)?.promotions || []).map((p) => p.id);
            for (const existingPromotionId of existingPromotionIds) {
                const promotion = existingPromotionsMap.get(existingPromotionId);
                if (!promotion) {
                    continue;
                }
                if (!upsertPromotionIds.includes(existingPromotionId)) {
                    updatedCampaign.promotions.remove(promotion);
                }
            }
            for (const promotionIdToAdd of upsertPromotionIds) {
                const promotion = existingPromotionsMap.get(promotionIdToAdd);
                if (!promotion) {
                    continue;
                }
                if (existingPromotionIds.includes(promotionIdToAdd)) {
                    continue;
                }
                else {
                    updatedCampaign.promotions.add(promotion);
                }
            }
        }
        return updatedCampaigns;
    }
}
exports.CampaignRepository = CampaignRepository;
