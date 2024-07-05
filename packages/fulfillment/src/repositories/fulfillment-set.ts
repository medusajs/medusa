/*
import { Context, FulfillmentTypes } from "@medusajs/types"
import { DALUtils, promiseAll } from "@medusajs/utils"
import { FulfillmentSet, ServiceZone } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"

interface CreateFulfillmentSetDTO
  extends FulfillmentTypes.CreateFulfillmentSetDTO {
  service_zones: { id: string; name: string }[]
}

export class FulfillmentSetRepository extends DALUtils.mikroOrmBaseRepositoryFactory<FulfillmentSet>(
  FulfillmentSet
) {
  async update(
    data: {
      entity: FulfillmentSet
      update: FulfillmentTypes.FulfillmentSetDTO
    }[],
    context?: Context
  ): Promise<FulfillmentSet[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    // init all service zones collections
    await promiseAll(
      data.map(async ({ entity }) => {
        return await entity.service_zones.init()
      })
    )

    const flfillmentSetsToUpdate = data.map(({ entity, update }) => {
      const { service_zones, ...restToUpdate } = update

      const currentServiceZones = entity.service_zones.getItems()
      const serviceZonesToDetach = currentServiceZones.filter(
        (serviceZone) =>
          !update.service_zones.find(
            (newServiceZone) => newServiceZone.id === serviceZone.id
          )
      )
      const serviceZonesToAttach = update.service_zones.filter(
        (newServiceZone) =>
          !currentServiceZones.find(
            (serviceZone) => serviceZone.id === newServiceZone.id
          )
      )

      entity.service_zones.remove(serviceZonesToDetach)
      entity.service_zones.add(serviceZonesToAttach as unknown as ServiceZone[])

      return manager.assign(entity, restToUpdate)
    })

    manager.persist(flfillmentSetsToUpdate)

    return flfillmentSetsToUpdate
  }
}
*/
