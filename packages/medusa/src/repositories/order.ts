import { EntityRepository, Repository } from "typeorm"
import { Order } from "../models/order"

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {}
