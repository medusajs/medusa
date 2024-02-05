import { RequiredEntityData } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Region } from "@models"

export async function createRegions(
  manager: SqlEntityManager,
  data: RequiredEntityData<Region>[]
) {
  const regions = data.map((region) => {
    return manager.create(Region, region)
  })

  await manager.persistAndFlush(regions)

  return regions
}
