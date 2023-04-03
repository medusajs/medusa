import { EntityManager, In } from "typeorm"
import {
  ICacheService,
  IInventoryService,
  IStockLocationService,
  InventoryItemDTO,
  ReservationItemDTO,
  ReserveQuantityContext,
} from "@medusajs/types"
import { LineItem, Product, ProductVariant } from "../models"
import { MedusaError, TransactionBaseService, isDefined } from "@medusajs/utils"
import { PricedProduct, PricedVariant } from "../types/pricing"

import { ProductVariantInventoryItem } from "../models/product-variant-inventory-item"
import ProductVariantService from "./product-variant"
import SalesChannelInventoryService from "./sales-channel-inventory"
import SalesChannelLocationService from "./sales-channel-location"

type InjectedDependencies = {
  manager: EntityManager
  salesChannelLocationService: SalesChannelLocationService
  salesChannelInventoryService: SalesChannelInventoryService
  productVariantService: ProductVariantService
  stockLocationService: IStockLocationService
  inventoryService: IInventoryService
}

class ProductVariantInventoryService extends TransactionBaseService {
  protected readonly salesChannelLocationService_: SalesChannelLocationService
  protected readonly salesChannelInventoryService_: SalesChannelInventoryService
  protected readonly productVariantService_: ProductVariantService
  protected readonly stockLocationService_: IStockLocationService
  protected readonly inventoryService_: IInventoryService
  protected readonly cacheService_: ICacheService

  constructor({
    stockLocationService,
    salesChannelLocationService,
    salesChannelInventoryService,
    productVariantService,
    inventoryService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.salesChannelLocationService_ = salesChannelLocationService
    this.salesChannelInventoryService_ = salesChannelInventoryService
    this.stockLocationService_ = stockLocationService
    this.productVariantService_ = productVariantService
    this.inventoryService_ = inventoryService
  }

  /**
   * confirms if requested inventory is available
   * @param variantId id of the variant to confirm inventory for
   * @param quantity quantity of inventory to confirm is available
   * @param context optionally include a sales channel if applicable
   * @returns boolean indicating if inventory is available
   */
  async confirmInventory(
    variantId: string,
    quantity: number,
    context: { salesChannelId?: string | null } = {}
  ): Promise<Boolean> {
    if (!variantId) {
      return true
    }

    const productVariant = await this.productVariantService_
      .withTransaction(this.activeManager_)
      .retrieve(variantId, {
        select: [
          "id",
          "allow_backorder",
          "manage_inventory",
          "inventory_quantity",
        ],
      })

    // If the variant allows backorders or if inventory isn't managed we
    // don't need to check inventory
    if (productVariant.allow_backorder || !productVariant.manage_inventory) {
      return true
    }

    if (!this.inventoryService_) {
      return productVariant.inventory_quantity >= quantity
    }

    const variantInventory = await this.listByVariant(variantId)

    // If there are no inventory items attached to the variant we default
    // to true
    if (variantInventory.length === 0) {
      return true
    }

    let locationIds: string[] = []
    if (context.salesChannelId) {
      locationIds = await this.salesChannelLocationService_.listLocationIds(
        context.salesChannelId
      )
    } else {
      const stockLocations = await this.stockLocationService_.list(
        {},
        { select: ["id"] }
      )
      locationIds = stockLocations.map((l) => l.id)
    }

    const hasInventory = await Promise.all(
      variantInventory.map(async (inventoryPart) => {
        const itemQuantity = inventoryPart.required_quantity * quantity
        return await this.inventoryService_.confirmInventory(
          inventoryPart.inventory_item_id,
          locationIds,
          itemQuantity
        )
      })
    )

    return hasInventory.every(Boolean)
  }

  /**
   * Retrieves a product variant inventory item by its inventory item ID and variant ID.
   *
   * @param inventoryItemId - The ID of the inventory item to retrieve.
   * @param variantId - The ID of the variant to retrieve.
   * @returns A promise that resolves with the product variant inventory item.
   */
  async retrieve(
    inventoryItemId: string,
    variantId: string
  ): Promise<ProductVariantInventoryItem> {
    const variantInventoryRepo = this.activeManager_.getRepository(
      ProductVariantInventoryItem
    )

    const variantInventory = await variantInventoryRepo.findOne({
      where: { inventory_item_id: inventoryItemId, variant_id: variantId },
    })

    if (!variantInventory) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory item with id ${inventoryItemId} not found`
      )
    }

    return variantInventory
  }

  /**
   * list registered inventory items
   * @param itemIds list inventory item ids
   * @returns list of inventory items
   */
  async listByItem(itemIds: string[]): Promise<ProductVariantInventoryItem[]> {
    const variantInventoryRepo = this.activeManager_.getRepository(
      ProductVariantInventoryItem
    )

    const variantInventory = await variantInventoryRepo.find({
      where: { inventory_item_id: In(itemIds) },
    })

    return variantInventory
  }

  /**
   * List inventory items for a specific variant
   * @param variantId variant id
   * @returns variant inventory items for the variant id
   */
  public async listByVariant(
    variantId: string | string[]
  ): Promise<ProductVariantInventoryItem[]> {
    const variantInventoryRepo = this.activeManager_.getRepository(
      ProductVariantInventoryItem
    )

    const ids = Array.isArray(variantId) ? variantId : [variantId]

    const variantInventory = await variantInventoryRepo.find({
      where: { variant_id: In(ids) },
    })

    return variantInventory
  }

  /**
   * lists variant by inventory item id
   * @param itemId item id
   * @returns a list of product variants that are associated with the item id
   */
  async listVariantsByItem(itemId: string): Promise<ProductVariant[]> {
    if (!this.inventoryService_) {
      return []
    }

    const variantInventory = await this.listByItem([itemId])
    const items = await this.productVariantService_.list({
      id: variantInventory.map((i) => i.variant_id),
    })

    return items
  }

  /**
   * lists inventory items for a given variant
   * @param variantId variant id
   * @returns lidt of inventory items for the variant
   */
  async listInventoryItemsByVariant(
    variantId: string
  ): Promise<InventoryItemDTO[]> {
    if (!this.inventoryService_) {
      return []
    }

    const variantInventory = await this.listByVariant(variantId)
    const [items] = await this.inventoryService_.listInventoryItems({
      id: variantInventory.map((i) => i.inventory_item_id),
    })

    return items
  }

  /**
   * Attach a variant to an inventory item
   * @param variantId variant id
   * @param inventoryItemId inventory item id
   * @param requiredQuantity quantity of variant to attach
   * @returns the variant inventory item
   */
  async attachInventoryItem(
    variantId: string,
    inventoryItemId: string,
    requiredQuantity?: number
  ): Promise<ProductVariantInventoryItem> {
    // Verify that variant exists
    await this.productVariantService_
      .withTransaction(this.activeManager_)
      .retrieve(variantId, {
        select: ["id"],
      })

    // Verify that item exists
    await this.inventoryService_.retrieveInventoryItem(
      inventoryItemId,
      {
        select: ["id"],
      },
      { transactionManager: this.activeManager_ }
    )

    const variantInventoryRepo = this.activeManager_.getRepository(
      ProductVariantInventoryItem
    )

    const existing = await variantInventoryRepo.findOne({
      where: {
        variant_id: variantId,
        inventory_item_id: inventoryItemId,
      },
    })

    if (existing) {
      return existing
    }

    let quantityToStore = 1
    if (typeof requiredQuantity !== "undefined") {
      if (requiredQuantity < 1) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Quantity must be greater than 0"
        )
      } else {
        quantityToStore = requiredQuantity
      }
    }

    const variantInventory = variantInventoryRepo.create({
      variant_id: variantId,
      inventory_item_id: inventoryItemId,
      required_quantity: quantityToStore,
    })

    return await variantInventoryRepo.save(variantInventory)
  }

  /**
   * Remove a variant from an inventory item
   * @param variantId variant id or undefined if all the variants will be affected
   * @param inventoryItemId inventory item id
   */
  async detachInventoryItem(
    inventoryItemId: string,
    variantId?: string
  ): Promise<void> {
    const variantInventoryRepo = this.activeManager_.getRepository(
      ProductVariantInventoryItem
    )

    const where: any = {
      inventory_item_id: inventoryItemId,
    }
    if (variantId) {
      where.variant_id = variantId
    }

    const varInvItems = await variantInventoryRepo.find({
      where,
    })

    if (varInvItems.length) {
      await variantInventoryRepo.remove(varInvItems)
    }
  }

  /**
   * Reserves a quantity of a variant
   * @param variantId variant id
   * @param quantity quantity to reserve
   * @param context optional parameters
   */
  async reserveQuantity(
    variantId: string,
    quantity: number,
    context: ReserveQuantityContext = {}
  ): Promise<void | ReservationItemDTO[]> {
    if (!this.inventoryService_) {
      return this.atomicPhase_(async (manager) => {
        const variantServiceTx =
          this.productVariantService_.withTransaction(manager)
        const variant = await variantServiceTx.retrieve(variantId, {
          select: ["id", "inventory_quantity"],
        })
        await variantServiceTx.update(variant.id, {
          inventory_quantity: variant.inventory_quantity - quantity,
        })
        return
      })
    }

    const toReserve = {
      type: "order",
      line_item_id: context.lineItemId,
    }

    const variantInventory = await this.listByVariant(variantId)

    if (variantInventory.length === 0) {
      return
    }

    let locationId = context.locationId
    if (!isDefined(locationId) && context.salesChannelId) {
      const locationIds = await this.salesChannelLocationService_
        .withTransaction(this.activeManager_)
        .listLocationIds(context.salesChannelId)

      if (!locationIds.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Must provide location_id or sales_channel_id to a Sales Channel that has associated Stock Locations"
        )
      }

      const [locations, count] =
        await this.inventoryService_.listInventoryLevels({
          location_id: locationIds,
          inventory_item_id: variantInventory[0].inventory_item_id,
        })

      if (count === 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Must provide location_id or sales_channel_id to a Sales Channel that has associated locations with inventory levels"
        )
      }

      locationId = locations[0].location_id
    }

    return await Promise.all(
      variantInventory.map(async (inventoryPart) => {
        const itemQuantity = inventoryPart.required_quantity * quantity
        return await this.inventoryService_.createReservationItem({
          ...toReserve,
          location_id: locationId as string,
          inventory_item_id: inventoryPart.inventory_item_id,
          quantity: itemQuantity,
        })
      })
    )
  }

  /**
   * Adjusts the quantity of reservations for a line item by a given amount.
   * @param {string} lineItemId - The ID of the line item
   * @param {string} variantId - The ID of the variant
   * @param {string} locationId - The ID of the location to prefer adjusting quantities at
   * @param {number} quantity - The amount to adjust the quantity by
   */
  async adjustReservationsQuantityByLineItem(
    lineItemId: string,
    variantId: string,
    locationId: string,
    quantity: number
  ): Promise<void> {
    if (!this.inventoryService_) {
      return this.atomicPhase_(async (manager) => {
        const variantServiceTx =
          this.productVariantService_.withTransaction(manager)
        const variant = await variantServiceTx.retrieve(variantId, {
          select: ["id", "inventory_quantity", "manage_inventory"],
        })

        if (!variant.manage_inventory) {
          return
        }

        await variantServiceTx.update(variantId, {
          inventory_quantity: variant.inventory_quantity - quantity,
        })
      })
    }

    if (quantity > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "You can only reduce reservation quantities using adjustReservationsQuantityByLineItem. If you wish to reserve more use update or create."
      )
    }

    const [reservations, reservationCount] =
      await this.inventoryService_.listReservationItems(
        {
          line_item_id: lineItemId,
        },
        {
          order: { created_at: "DESC" },
        }
      )

    reservations.sort((a, _) => {
      if (a.location_id === locationId) {
        return -1
      }
      return 0
    })

    if (reservationCount) {
      const inventoryItems = await this.listByVariant(variantId)
      const productVariantInventory = inventoryItems[0]

      const deltaUpdate = Math.abs(
        quantity * productVariantInventory.required_quantity
      )

      const exactReservation = reservations.find(
        (r) => r.quantity === deltaUpdate && r.location_id === locationId
      )
      if (exactReservation) {
        await this.inventoryService_.deleteReservationItem(exactReservation.id)
        return
      }

      let remainingQuantity = deltaUpdate

      const reservationsToDelete: ReservationItemDTO[] = []
      let reservationToUpdate: ReservationItemDTO | null = null
      for (const reservation of reservations) {
        if (reservation.quantity <= remainingQuantity) {
          remainingQuantity -= reservation.quantity
          reservationsToDelete.push(reservation)
        } else {
          reservationToUpdate = reservation
          break
        }
      }

      if (reservationsToDelete.length) {
        await this.inventoryService_.deleteReservationItem(
          reservationsToDelete.map((r) => r.id)
        )
      }

      if (reservationToUpdate) {
        await this.inventoryService_.updateReservationItem(
          reservationToUpdate.id,
          {
            quantity: reservationToUpdate.quantity - remainingQuantity,
          }
        )
      }
    }
  }

  /**
   * Validate stock at a location for fulfillment items
   * @param items Fulfillment Line items to validate quantities for
   * @param locationId Location to validate stock at
   * @returns nothing if successful, throws error if not
   */
  async validateInventoryAtLocation(
    items: Omit<LineItem, "beforeInsert">[],
    locationId: string
  ) {
    if (!this.inventoryService_) {
      return
    }

    const itemsToValidate = items.filter((item) => !!item.variant_id)

    for (const item of itemsToValidate) {
      const pvInventoryItems = await this.listByVariant(item.variant_id!)

      if (!pvInventoryItems.length) {
        continue
      }

      const [inventoryLevels, inventoryLevelCount] =
        await this.inventoryService_.listInventoryLevels({
          inventory_item_id: pvInventoryItems.map((i) => i.inventory_item_id),
          location_id: locationId,
        })

      if (!inventoryLevelCount) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Inventory item for ${item.title} not found at location`
        )
      }

      const pviMap: Map<string, ProductVariantInventoryItem> = new Map(
        pvInventoryItems.map((pvi) => [pvi.inventory_item_id, pvi])
      )

      for (const inventoryLevel of inventoryLevels) {
        const pvInventoryItem = pviMap.get(inventoryLevel.inventory_item_id)

        if (
          !pvInventoryItem ||
          pvInventoryItem.required_quantity * item.quantity >
            inventoryLevel.stocked_quantity
        ) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Insufficient stock for item: ${item.title}`
          )
        }
      }
    }
  }

  /**
   * delete a reservation of variant quantity
   * @param lineItemId line item id
   * @param variantId variant id
   * @param quantity quantity to release
   */
  async deleteReservationsByLineItem(
    lineItemId: string,
    variantId: string,
    quantity: number
  ): Promise<void> {
    if (!this.inventoryService_) {
      return this.atomicPhase_(async (manager) => {
        const productVariantServiceTx =
          this.productVariantService_.withTransaction(manager)
        const variant = await productVariantServiceTx.retrieve(variantId, {
          select: ["id", "inventory_quantity", "manage_inventory"],
        })

        if (!variant.manage_inventory) {
          return
        }

        await productVariantServiceTx.update(variantId, {
          inventory_quantity: variant.inventory_quantity + quantity,
        })
      })
    }

    await this.inventoryService_.deleteReservationItemsByLineItem(lineItemId)
  }

  /**
   * Adjusts inventory of a variant on a location
   * @param variantId variant id
   * @param locationId location id
   * @param quantity quantity to adjust
   */
  async adjustInventory(
    variantId: string,
    locationId: string,
    quantity: number
  ): Promise<void> {
    if (!this.inventoryService_) {
      return this.atomicPhase_(async (manager) => {
        const productVariantServiceTx =
          this.productVariantService_.withTransaction(manager)
        const variant = await productVariantServiceTx.retrieve(variantId, {
          select: ["id", "inventory_quantity", "manage_inventory"],
        })

        if (!variant.manage_inventory) {
          return
        }

        await productVariantServiceTx.update(variantId, {
          inventory_quantity: variant.inventory_quantity + quantity,
        })
      })
    }

    const variantInventory = await this.listByVariant(variantId)

    if (variantInventory.length === 0) {
      return
    }

    await Promise.all(
      variantInventory.map(async (inventoryPart) => {
        const itemQuantity = inventoryPart.required_quantity * quantity
        return await this.inventoryService_.adjustInventory(
          inventoryPart.inventory_item_id,
          locationId,
          itemQuantity
        )
      })
    )
  }

  async setVariantAvailability(
    variants: ProductVariant[] | PricedVariant[],
    salesChannelId: string | string[] | undefined
  ): Promise<ProductVariant[] | PricedVariant[]> {
    if (!this.inventoryService_) {
      return variants
    }

    return await Promise.all(
      variants.map(async (variant) => {
        if (!variant.id) {
          return variant
        }

        if (!salesChannelId) {
          delete variant.inventory_quantity
          return variant
        }

        // first get all inventory items required for a variant
        const variantInventory = await this.listByVariant(variant.id)

        if (!variantInventory.length) {
          variant.inventory_quantity = 0
          return variant
        }

        const locationIds =
          await this.salesChannelLocationService_.listLocationIds(
            salesChannelId
          )

        const [locations] = await this.inventoryService_.listInventoryLevels({
          location_id: locationIds,
          inventory_item_id: variantInventory[0].inventory_item_id,
        })

        variant.inventory_quantity = locations.reduce(
          (acc, next) => acc + (next.stocked_quantity || 0),
          0
        )

        return variant
      })
    )
  }

  async setProductAvailability(
    products: (Product | PricedProduct)[],
    salesChannelId: string | string[] | undefined
  ): Promise<(Product | PricedProduct)[]> {
    return await Promise.all(
      products.map(async (product) => {
        if (!product.variants || product.variants.length === 0) {
          return product
        }

        product.variants = await this.setVariantAvailability(
          product.variants,
          salesChannelId
        )

        return product
      })
    )
  }

  /**
   * Get the quantity of a variant from a list of variantInventoryItems
   * The inventory quantity of the variant should be equal to the inventory
   * item with the smallest stock, adjusted for quantity required to fulfill
   * the given variant.
   *
   * @param variantInventoryItems List of inventoryItems for a given variant, These must all be for the same variant
   * @param channelId Sales channel id to fetch availability for
   * @returns The available quantity of the variant from the inventoryItems
   */
  async getVariantQuantityFromVariantInventoryItems(
    variantInventoryItems: ProductVariantInventoryItem[],
    channelId: string
  ): Promise<number> {
    const variantItemsAreMixed = variantInventoryItems.some(
      (inventoryItem) =>
        inventoryItem.variant_id !== variantInventoryItems[0].variant_id
    )

    if (variantInventoryItems.length && variantItemsAreMixed) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "All variant inventory items must belong to the same variant"
      )
    }

    const salesChannelInventoryServiceTx =
      this.salesChannelInventoryService_.withTransaction(this.activeManager_)

    return Math.min(
      ...(await Promise.all(
        variantInventoryItems.map(async (variantInventory) => {
          // get the total available quantity for the given sales channel
          // divided by the required quantity to account for how many of the
          // variant we can fulfill at the current time. Take the minimum we
          // can fulfill and set that as quantity
          return (
            // eslint-disable-next-line max-len
            (await salesChannelInventoryServiceTx.retrieveAvailableItemQuantity(
              channelId,
              variantInventory.inventory_item_id
            )) / variantInventory.required_quantity
          )
        })
      ))
    )
  }
}

export default ProductVariantInventoryService
