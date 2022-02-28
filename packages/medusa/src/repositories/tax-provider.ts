import { EntityRepository, Repository } from "typeorm"
import { TaxProvider } from "../models/tax-provider"

@EntityRepository(TaxProvider)
export class TaxProviderRepository extends Repository<TaxProvider> {}
