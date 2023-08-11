import { TaxProvider } from "../models"
import { dataSource } from "../loaders/database"

export const TaxProviderRepository = dataSource.getRepository(TaxProvider)
export default TaxProviderRepository
