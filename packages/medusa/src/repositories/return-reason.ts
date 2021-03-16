import { EntityRepository, Repository } from "typeorm"
import { ReturnReason } from "../models/return-reason"

@EntityRepository(ReturnReason)
export class ReturnReasonRepository extends Repository<ReturnReason> {}
