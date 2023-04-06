import { Country } from "../models/country"
import { dataSource } from "../loaders/database"

export const CountryRepository = dataSource.getRepository(Country)
export default CountryRepository
