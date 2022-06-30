import { EntityRepository, Repository } from "typeorm"
import { ProductTaxRate } from "../models/product-tax-rate"

@EntityRepository(ProductTaxRate)
export class ProductTaxRateRepository extends Repository<ProductTaxRate> {}
