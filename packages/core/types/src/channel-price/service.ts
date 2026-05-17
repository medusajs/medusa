import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { ChannelPriceDTO, FilterableChannelPriceProps } from "./common"

/**
 * The main service interface for the Channel Price Module.
 */
export interface IChannelPriceModuleService extends IModuleService {
  /**
   * This method creates channel prices.
   */
  createChannelPrices(
    data: unknown[],
    sharedContext?: Context
  ): Promise<ChannelPriceDTO[]>

  /**
   * This method creates a channel price.
   */
  createChannelPrices(
    data: unknown,
    sharedContext?: Context
  ): Promise<ChannelPriceDTO>

  /**
   * This method updates a channel price.
   */
  updateChannelPrices(
    id: string,
    data: unknown,
    sharedContext?: Context
  ): Promise<ChannelPriceDTO>

  /**
   * This method updates channel prices matching the specified filters.
   */
  updateChannelPrices(
    selector: FilterableChannelPriceProps,
    data: unknown,
    sharedContext?: Context
  ): Promise<ChannelPriceDTO[]>

  /**
   * This method deletes channel prices by their IDs.
   */
  deleteChannelPrices(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a channel price by its ID.
   */
  deleteChannelPrices(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a channel price by its ID.
   */
  retrieveChannelPrice(
    id: string,
    config?: FindConfig<ChannelPriceDTO>,
    sharedContext?: Context
  ): Promise<ChannelPriceDTO>

  /**
   * This method retrieves a list of channel prices.
   */
  listChannelPrices(
    filters?: FilterableChannelPriceProps,
    config?: FindConfig<ChannelPriceDTO>,
    sharedContext?: Context
  ): Promise<ChannelPriceDTO[]>

  /**
   * This method retrieves a paginated list of channel prices along with the total count.
   */
  listAndCountChannelPrices(
    filters?: FilterableChannelPriceProps,
    config?: FindConfig<ChannelPriceDTO>,
    sharedContext?: Context
  ): Promise<[ChannelPriceDTO[], number]>
}
