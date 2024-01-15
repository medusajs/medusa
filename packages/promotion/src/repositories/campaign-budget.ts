import { DALUtils } from "@medusajs/utils"
import { CampaignBudget } from "@models"
import { CreateCampaignBudgetDTO, UpdateCampaignBudgetDTO } from "@types"

export class CampaignBudgetRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  CampaignBudget,
  {
    create: CreateCampaignBudgetDTO
    update: UpdateCampaignBudgetDTO
  }
>(CampaignBudget) {}
