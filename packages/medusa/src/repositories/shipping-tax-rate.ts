import { EntityRepository, Repository } from "typeorm"
import { ShippingTaxRate } from "../models/shipping-tax-rate"

@EntityRepository(ShippingTaxRate)
export class ShippingTaxRateRepository extends Repository<ShippingTaxRate> {}
