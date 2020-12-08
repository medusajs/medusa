import { EntityRepository, Repository } from "typeorm"
import { Discount } from "../models/discount"

@EntityRepository(Discount)
export class DiscountRepository extends Repository<Discount> {}
