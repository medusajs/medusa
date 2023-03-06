import { In } from "typeorm"
import { dataSource } from "../loaders/database"
import { ShippingOption } from "../models"

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
