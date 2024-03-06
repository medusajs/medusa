import { Context, DAL, InventoryNext } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { ReservationItem } from "../models/reservation-item"
import { ReservationItemRepository } from "@repositories"
import { isDefined } from "@medusajs/utils"

type InjectedDependencies = {
  reservationItemRepository: ReservationItemRepository
}

export default class ReservationItemService<
  TEntity extends ReservationItem = ReservationItem
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  ReservationItem
)<TEntity> {
  protected readonly reservationItemRepository_: ReservationItemRepository

  constructor(container: InjectedDependencies) {
    super(container)

    this.reservationItemRepository_ = container.reservationItemRepository
  }

  @InjectTransactionManager("reservationItemRepository_")
  async deleteByLineItem(
    lineItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    await this.reservationItemRepository_.softDelete(
      { line_item_id: lineItemId },
      context
    )
  }

  /**
   * Deletes reservation items by location ID.
   * @param locationId - The ID of the location to delete reservations for.
   * @param context
   */
  @InjectTransactionManager("reservationItemRepository_")
  async deleteByLocationId(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    await this.reservationItemRepository_.softDelete(
      { location_id: locationId },
      context
    )
  }
}
