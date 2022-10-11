import { EntityRepository, Repository } from "typeorm"
import { FulfillmentProvider } from "../models/fulfillment-provider"

@EntityRepository(FulfillmentProvider)
// eslint-disable-next-line max-len
export class FulfillmentProviderRepository extends Repository<FulfillmentProvider> {}
