import { EntityRepository, Repository } from "typeorm"
import { ShippingProfile } from "../models/shipping-profile"

@EntityRepository(ShippingProfile)
export class ShippingProfileRepository extends Repository<ShippingProfile> {}
