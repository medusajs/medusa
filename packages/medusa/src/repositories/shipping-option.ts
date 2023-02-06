import { EntityRepository, In, Repository } from "typeorm"
import { ShippingOption } from "../models/shipping-option"

@EntityRepository(ShippingOption)
export class ShippingOptionRepository extends Repository<ShippingOption> {
  public async upsertShippingProfile(
    ids: string[],
    shippingProfileId: string
  ): Promise<ShippingOption[]> {
    await this.createQueryBuilder()
      .update(ShippingOption)
      .set({ profile_id: shippingProfileId })
      .where({ id: In(ids) })
      .execute()

    return this.findByIds(ids)
  }
}
