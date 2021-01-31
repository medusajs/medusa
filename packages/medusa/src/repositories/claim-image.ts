import { EntityRepository, Repository } from "typeorm"
import { ClaimImage } from "../models/claim-image"

@EntityRepository(ClaimImage)
export class ClaimImageRepository extends Repository<ClaimImage> {}
