import { EntityRepository, Repository } from "typeorm"

import { OrderEdit } from "../models/order-edit"

@EntityRepository(OrderEdit)
export class OrderEditRepository extends Repository<OrderEdit> {}
