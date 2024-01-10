import { DALUtils } from "@medusajs/utils"

import { SalesChannel } from "@models"

export class SalesChannelRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  SalesChannel
) {}
