import { EntityRepository, Repository } from "typeorm"
import { OrderEdit } from "../models"

@EntityRepository(OrderEdit)
export class OrderEditRepository extends Repository<OrderEdit> {}
