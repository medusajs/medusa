import { Context } from "@medusajs/types";
import { DALUtils } from "@medusajs/utils";
import { Campaign } from "../models";
import { CreateCampaignDTO, UpdateCampaignDTO } from "../types";
declare const CampaignRepository_base: new ({ manager }: {
    manager: any;
}) => DALUtils.MikroOrmBaseRepository<Campaign>;
export declare class CampaignRepository extends CampaignRepository_base {
    create(data: CreateCampaignDTO[], context?: Context): Promise<Campaign[]>;
    update(data: {
        entity: Campaign;
        update: UpdateCampaignDTO;
    }[], context?: Context): Promise<Campaign[]>;
}
export {};
//# sourceMappingURL=campaign.d.ts.map