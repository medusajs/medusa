import { EntityRepository, Repository } from "typeorm"
import { ClaimTag } from "../models/claim-tag"

@EntityRepository(ClaimTag)
export class ClaimTagRepository extends Repository<ClaimTag> {}
