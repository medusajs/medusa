import { EntityRepository, Repository } from "typeorm"
import { Fulfillment } from "../models/fulfillment"

@EntityRepository(Fulfillment)
export class FulfillmentRepository extends Repository<Fulfillment> {}
