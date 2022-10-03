import { CustomShippingOption } from "../models"
import { dataSource } from "../loaders/database"

export const CustomShippingOptionRepository =
  dataSource.getRepository(CustomShippingOption)
export default CustomShippingOptionRepository
