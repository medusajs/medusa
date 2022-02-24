import { EntityRepository, Repository } from "typeorm"
import { ShippingMethodTaxLine } from "../models/shipping-method-tax-line"

@EntityRepository(ShippingMethodTaxLine)
export class ShippingMethodTaxLineRepository extends Repository<ShippingMethodTaxLine> {}
