import { ShippingProfile } from "../models"
import { dataSource } from "../loaders/database"

export const ShippingProfileRepository =
  dataSource.getRepository(ShippingProfile)
