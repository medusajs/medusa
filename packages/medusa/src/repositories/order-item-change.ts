import { EntityRepository, Repository } from "typeorm"

import { OrderItemChange } from "../models/order-item-change"

@EntityRepository(OrderItemChange)
export class OrderItemChangeRepository extends Repository<OrderItemChange> {}
