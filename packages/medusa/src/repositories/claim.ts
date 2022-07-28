 import { EntityRepository, Repository } from "typeorm"
import { ClaimOrder } from "../models/claim-order"

@EntityRepository(ClaimOrder)
export class ClaimRepository extends Repository<ClaimOrder> {}
