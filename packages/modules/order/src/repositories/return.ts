import { DALUtils } from "@medusajs/framework/utils"
import { Return } from "@models"
import { setFindMethods } from "../utils/base-repository-find"

export class ReturnRepository extends DALUtils.mikroOrmBaseRepositoryFactory<Return>(
  Return
) {}

setFindMethods(ReturnRepository, Return)
