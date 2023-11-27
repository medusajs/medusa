import { ShippingProfile } from "../models"
import { dataSource } from "../loaders/database"

export const ShippingProfileRepository = dataSource
  .getRepository(ShippingProfile)
  .extend({
    async findByProducts(
      productIds: string | string[]
    ): Promise<{ [product_id: string]: ShippingProfile[] }> {
      productIds = Array.isArray(productIds) ? productIds : [productIds]

      const shippingProfiles = await this.createQueryBuilder("sp")
        .select("*")
        .innerJoin("product_shipping_profile", "psp", "psp.profile_id = sp.id")
        .where("psp.product_id IN (:...productIds)", { productIds })
        .execute()

      return shippingProfiles.reduce((acc, productShippingProfile) => {
        acc[productShippingProfile.product_id] ??= []
        acc[productShippingProfile.product_id].push(productShippingProfile)
        return acc
      }, {})
    },
  })
export default ShippingProfileRepository
