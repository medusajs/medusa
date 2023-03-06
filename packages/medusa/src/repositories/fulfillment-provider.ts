import { dataSource } from "../loaders/database"
import { FulfillmentProvider } from "../models"

export const FulfillmentProviderRepository =
  dataSource.getRepository(FulfillmentProvider)
export default FulfillmentProviderRepository
