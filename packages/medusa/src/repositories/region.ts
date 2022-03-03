import { EntityRepository, In, Repository } from "typeorm"
import { Region } from "../models/region"

@EntityRepository(Region)
export class RegionRepository extends Repository<Region> {
  public async bulkValidateIds(ids: string[]) {
    const regions = await this.find({
      where: {
        id: In(ids),
      },
      select: ["id"],
    })
    return regions.map((region) => region.id)
  }
}
