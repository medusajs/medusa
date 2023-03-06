import { dataSource } from "../loaders/database"
import { TaxProvider } from "../models"

export const TaxProviderRepository = dataSource.getRepository(TaxProvider)
export default TaxProviderRepository
