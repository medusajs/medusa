import { EntityRepository, Repository } from "typeorm"
import { ShippingOptionRequirement } from "../models/shipping-option-requirement"

@EntityRepository(ShippingOptionRequirement)
export class ShippingOptionRequirementRepository extends Repository<ShippingOptionRequirement> {}
