import { Context, FulfillmentTypes } from "@medusajs/types"
import { DALUtils, promiseAll } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { FulfillmentSet, ServiceZone } from "@models"

interface CreateFulfillmentSetDTO
  extends FulfillmentTypes.CreateFulfillmentSetDTO {
  service_zones: { id: string; name: string }[]
}

export class FulfillmentSetRepository extends DALUtils.mikroOrmBaseRepositoryFactory<FulfillmentSet>(
  FulfillmentSet
) {
  async create(
    data: CreateFulfillmentSetDTO[],
    context: Context = {}
  ): Promise<FulfillmentSet[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const fulfillmentSets = await promiseAll(
      data.map(async (fulfillmentSetData) => {
        const { service_zones, ...fulfillmentSetDataOnly } = fulfillmentSetData
        const fulfillmentSet = manager.create(
          FulfillmentSet,
          fulfillmentSetDataOnly
        )

        // Manager the many to many between the relationship
        if (service_zones?.length) {
          await fulfillmentSet.service_zones.init({ populate: true })
          const fulfillmentSetServiceZones = new Set(
            fulfillmentSet.service_zones.getItems().map(({ id }) => id)
          )

          const serviceZoneToAttach = service_zones
            .filter(({ id }) => !fulfillmentSetServiceZones.has(id))
            .map(({ id }) => ({ id }))
          const serviceZoneToDetach = fulfillmentSet.service_zones
            .getItems()
            .filter(({ id }) => !service_zones.some((s) => s.id === id))

          fulfillmentSet.service_zones.add(
            serviceZoneToAttach.map(({ id }) =>
              manager.create(ServiceZone, { id } as any)
            )
          )
          fulfillmentSet.service_zones.remove(serviceZoneToDetach)
        }

        manager.persist(fulfillmentSet)
        return fulfillmentSet
      })
    )

    return fulfillmentSets
  }
}
