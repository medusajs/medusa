"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignRepository = exports.BaseRepository = void 0;
var utils_1 = require("@medusajs/utils");
Object.defineProperty(exports, "BaseRepository", { enumerable: true, get: function () { return utils_1.MikroOrmBaseRepository; } });
var campaign_1 = require("./campaign");
Object.defineProperty(exports, "CampaignRepository", { enumerable: true, get: function () { return campaign_1.CampaignRepository; } });
