import {
  EntitySubscriberInterface,
  EventSubscriber,
  In,
  UpdateEvent,
} from "typeorm"
import { Region } from ".."
import { Country } from "../models/country"

@EventSubscriber()
export class RegionSubscriber implements EntitySubscriberInterface<Region> {
  listenTo(): typeof Region {
    return Region
  }

  async afterUpdate(event: UpdateEvent<Region>): Promise<void> {
    const updatedRegion = await event.manager.findOne(
      Region,
      event.databaseEntity.id,
      { withDeleted: true, relations: ["countries"] }
    )

    if (updatedRegion?.countries.length) {
      const countryIds = updatedRegion.countries.map((c) => c.id)

      await event.manager.update(
        Country,
        {
          id: In(countryIds),
        },
        {
          region_id: undefined,
        }
      )
    }
  }
}
