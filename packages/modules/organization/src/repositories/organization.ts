import { DALUtils } from "@medusajs/framework/utils"

export class OrganizationRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "Organization"
) {}
