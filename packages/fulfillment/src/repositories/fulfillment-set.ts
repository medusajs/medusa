/*
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

    return await promiseAll(
      data.map(async (fulfillmentSetData) => {
        const { service_zones, ...fulfillmentSetDataOnly } = fulfillmentSetData
        const fulfillmentSet = manager.create(
          FulfillmentSet,
          fulfillmentSetDataOnly
        )

        console.log(JSON.stringify(service_zones, null, 2))
        if (service_zones?.length) {
          console.log(JSON.stringify(fulfillmentSet.service_zones, null, 2))
          fulfillmentSet.service_zones.add(
            service_zones.map((serviceZone) =>
              manager.create(ServiceZone, serviceZone)
            )
          )
        }

        manager.persist(fulfillmentSet)
        return fulfillmentSet
      })
    )
  }
}
*/
