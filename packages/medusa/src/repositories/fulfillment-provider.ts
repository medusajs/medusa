import { EntityRepository, Repository } from "typeorm"
import { FulfillmentProvider } from "../models/fulfillment-provider"

@EntityRepository(FulfillmentProvider)
export class FulfillmentProviderRepository extends Repository<
  FulfillmentProvider
> {}
