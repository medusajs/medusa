import { EntityRepository, Repository } from "typeorm"
import { Refund } from "../models/refund"

@EntityRepository(Refund)
export class RefundRepository extends Repository<Refund> {}
