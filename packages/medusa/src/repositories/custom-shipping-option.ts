import { dataSource } from "../loaders/database"
import { CustomShippingOption } from "../models"

export const CustomShippingOptionRepository =
  dataSource.getRepository(CustomShippingOption)
export default CustomShippingOptionRepository
