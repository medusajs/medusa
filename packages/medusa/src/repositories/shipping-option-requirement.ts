import { EntityRepository, Repository } from "typeorm"
import { ShippingOptionRequirement } from "../models/shipping-option-requirement"

@EntityRepository(ShippingOptionRequirement)
// eslint-disable-next-line max-len
export class ShippingOptionRequirementRepository extends Repository<ShippingOptionRequirement> {}
