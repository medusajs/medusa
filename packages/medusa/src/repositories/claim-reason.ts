import { EntityRepository, Repository } from "typeorm"
import { ClaimReason } from "../models/claim-reason"

@EntityRepository(ClaimReason)
export class ClaimReasonRepository extends Repository<ClaimReason> {}