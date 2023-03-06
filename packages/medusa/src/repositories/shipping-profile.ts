import { dataSource } from "../loaders/database"
import { ShippingProfile } from "../models"

export const ShippingProfileRepository =
  dataSource.getRepository(ShippingProfile)
export default ShippingProfileRepository
