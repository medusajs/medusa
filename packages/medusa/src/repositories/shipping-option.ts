import { EntityRepository, Repository } from "typeorm"
import { ShippingOption } from "../models/shipping-option"

@EntityRepository(ShippingOption)
export class ShippingOptionRepository extends Repository<ShippingOption> {}
