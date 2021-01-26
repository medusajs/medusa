import { EntityRepository, Repository } from "typeorm"
import { ShippingMethod } from "../models/shipping-method"

@EntityRepository(ShippingMethod)
export class ShippingMethodRepository extends Repository<ShippingMethod> {}
