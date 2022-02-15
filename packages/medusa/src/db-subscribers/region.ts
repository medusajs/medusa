import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from "typeorm"
import { Region } from ".."

@EventSubscriber()
export class RegionSubscriber implements EntitySubscriberInterface<Region> {
  listenTo(): typeof Region {
    return Region
  }

  async afterUpdate(event: UpdateEvent<Region>): Promise<void> {
    const updatedRegion = await event.manager.findOne(
      Region,
      event.databaseEntity.id,
      { withDeleted: true }
    )

    console.log("Updated resource: ", updatedRegion)
  }
}
