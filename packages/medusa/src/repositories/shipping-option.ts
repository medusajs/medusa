import { EntityRepository, In, Repository } from "typeorm"
import { ShippingOption } from "../models/shipping-option"

@EntityRepository(ShippingOption)
export class ShippingOptionRepository extends Repository<ShippingOption> {
  public async upsertShippingProfile(
    shippingOptionIds: string[],
    shippingProfileId: string
  ): Promise<ShippingOption[]> {
    await this.createQueryBuilder()
      .update(ShippingOption)
      .set({ profile_id: shippingProfileId })
      .where({ id: In(shippingOptionIds) })
      .execute()

    return this.findByIds(shippingOptionIds)
  }
}
