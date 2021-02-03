import { EntityRepository, Repository } from "typeorm"
import { ClaimItem } from "../models/claim-item"

@EntityRepository(ClaimItem)
export class ClaimItemRepository extends Repository<ClaimItem> {}
