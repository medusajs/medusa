import { EntityRepository, Repository } from "typeorm"
import { Region } from "../models/region"

@EntityRepository(Region)
export class RegionRepository extends Repository<Region> {}
