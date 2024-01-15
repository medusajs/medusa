import { DALUtils } from "@medusajs/utils"
import { Campaign } from "@models"
import { CreateCampaignDTO, UpdateCampaignDTO } from "@types"

export class CampaignRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Campaign,
  {
    create: CreateCampaignDTO
    update: UpdateCampaignDTO
  }
>(Campaign) {}
