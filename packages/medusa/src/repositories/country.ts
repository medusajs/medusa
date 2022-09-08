import { EntityRepository, Repository } from "typeorm"
import { Country } from "../models/country"

@EntityRepository(Country)
export class CountryRepository extends Repository<Country> {}
