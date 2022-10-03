import { FulfillmentProvider } from "../models"
import { dataSource } from "../loaders/database"

export const FulfillmentProviderRepository =
  dataSource.getRepository(FulfillmentProvider)
export default FulfillmentProviderRepository
