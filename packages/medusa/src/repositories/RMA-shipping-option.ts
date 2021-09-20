import { EntityRepository, Repository } from "typeorm"
import { RMAShippingOption } from './../models/rma-shipping-option';

@EntityRepository(RMAShippingOption)
export class RMAShippingOptionRepository extends Repository<RMAShippingOption> {}
