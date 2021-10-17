import { EntityRepository, Repository } from "typeorm"
import { CustomShippingOption } from './../models/custom-shipping-option';

@EntityRepository(CustomShippingOption)
export class CustomShippingOptionRepository extends Repository<CustomShippingOption> {}
