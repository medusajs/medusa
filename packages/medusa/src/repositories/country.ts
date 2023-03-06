import { dataSource } from "../loaders/database"
import { Country } from "../models/country"

export const CountryRepository = dataSource.getRepository(Country)
export default CountryRepository
