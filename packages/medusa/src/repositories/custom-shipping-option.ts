import { EntityRepository, Repository } from "typeorm"
import { CustomShippingOption } from "./../models/custom-shipping-option"

@EntityRepository(CustomShippingOption)
// eslint-disable-next-line max-len
export class CustomShippingOptionRepository extends Repository<CustomShippingOption> {}
