import { DALUtils } from "@medusajs/utils"
import { ApplicationMethod } from "@models"

export class ApplicationMethodRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  ApplicationMethod
) {}
