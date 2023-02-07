import { EntityRepository, In, Repository } from "typeorm"

import { ShippingOption } from "../models"
import { dataSource } from "../loaders/database"

export const ShippingOptionRepository = dataSource
  .getRepository(ShippingOption)
  .extend({
    async upsertShippingProfile(
      shippingOptionIds: string[],
      shippingProfileId: string
    ): Promise<ShippingOption[]> {
      await this.createQueryBuilder()
        .update(ShippingOption)
        .set({ profile_id: shippingProfileId })
        .where({ id: In(shippingOptionIds) })
        .execute()

      return this.findByIds(shippingOptionIds)
    },
  })

export default ShippingOptionRepository
