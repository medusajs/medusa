import {
  IEventBusService,
  IInventoryService,
  IStockLocationService,
  InventoryItemDTO,
  InventoryLevelDTO,
  RemoteQueryFunction,
  ReservationItemDTO,
  ReserveQuantityContext,
} from "@medusajs/types"
import {
  FlagRouter,
  MedusaError,
  MedusaV2Flag,
  isDefined,
  promiseAll,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { EntityManager, In } from "typeorm"
import { LineItem, Product, ProductVariant } from "../models"
import { PricedProduct, PricedVariant } from "../types/pricing"

import { TransactionBaseService } from "../interfaces"
import { ProductVariantInventoryItem } from "../models/product-variant-inventory-item"
import { getSetDifference } from "../utils/diff-set"
import ProductVariantService from "./product-variant"
import SalesChannelInventoryService from "./sales-channel-inventory"
import SalesChannelLocationService from "./sales-channel-location"

type InjectedDependencies = {
  manager: EntityManager
  salesChannelLocationService: SalesChannelLocationService
  salesChannelInventoryService: SalesChannelInventoryService
  productVariantService: ProductVariantService
  eventBusService: IEventBusService
  featureFlagRouter: FlagRouter
  remoteQuery: RemoteQueryFunction
}

type AvailabilityContext = {
  variantInventoryMap?: Map<string, ProductVariantInventoryItem[]>
  inventoryLocationMap?: Map<string, InventoryLevelDTO[]>
}

class ProductVariantInventoryService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly salesChannelLocationService_: SalesChannelLocationService
  protected readonly salesChannelInventoryService_: SalesChannelInventoryService
  protected readonly productVariantService_: ProductVariantService
  protected readonly eventBusService_: IEventBusService
  protected readonly featureFlagRouter_: FlagRouter
  protected readonly remoteQuery_: RemoteQueryFunction

  protected get inventoryService_(): IInventoryService {
    return this.__container__.inventoryService
  }

  protected get stockLocationService_(): IStockLocationService {
    return this.__container__.stockLocationService
  }

  constructor({
    salesChannelLocationService,
    salesChannelInventoryService,
    productVariantService,
    eventBusService,
    featureFlagRouter,
    remoteQuery,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.salesChannelLocationService_ = salesChannelLocationService
    this.salesChannelInventoryService_ = salesChannelInventoryService
    this.productVariantService_ = productVariantService
    this.eventBusService_ = eventBusService
    this.featureFlagRouter_ = featureFlagRouter
    this.remoteQuery_ = remoteQuery
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

    if (locationIds.length === 0) {
      return false
    }

    const hasInventory = await promiseAll(
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
   * @returns the variant inventory item
   */
  async attachInventoryItem(
    attachments: {
      /**
       * variant id
       */
      variantId: string
      /**
       * inventory item id
       */
      inventoryItemId: string
      /**
       * quantity of variant to attach
       */
      requiredQuantity?: number
    }[]
  ): Promise<ProductVariantInventoryItem[]>
  async attachInventoryItem(
    variantId: string,
    inventoryItemId: string,
    requiredQuantity?: number
  ): Promise<ProductVariantInventoryItem[]>
  async attachInventoryItem(
    variantIdOrAttachments:
      | string
      | {
          variantId: string
          inventoryItemId: string
          requiredQuantity?: number
        }[],
    inventoryItemId?: string,
    requiredQuantity?: number
  ): Promise<ProductVariantInventoryItem[]> {
    const data = Array.isArray(variantIdOrAttachments)
      ? variantIdOrAttachments
      : [
          {
            variantId: variantIdOrAttachments,
            inventoryItemId: inventoryItemId!,
            requiredQuantity,
          },
        ]

    const invalidDataEntries = data.filter(
      (d) => typeof d.requiredQuantity === "number" && d.requiredQuantity < 1
    )

    if (invalidDataEntries.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `"requiredQuantity" must be greater than 0, the following entries are invalid: ${invalidDataEntries
          .map((d) => JSON.stringify(d))
          .join(", ")}`
      )
    }

    // Verify that variant exists
    let variants
    if (this.featureFlagRouter_.isFeatureEnabled(MedusaV2Flag.key)) {
      variants = await this.remoteQuery_(
        remoteQueryObjectFromString({
          entryPoint: "variants",
          variables: {
            id: data.map((d) => d.variantId),
          },
          fields: ["id"],
        })
      )
    } else {
      variants = await this.productVariantService_
        .withTransaction(this.activeManager_)
        .list(
          {
            id: data.map((d) => d.variantId),
          },
          {
            select: ["id"],
          }
        )
    }

    const foundVariantIds = new Set(variants.map((v) => v.id))
    const requestedVariantIds = new Set(data.map((v) => v.variantId))
    if (foundVariantIds.size !== requestedVariantIds.size) {
      const difference = getSetDifference(requestedVariantIds, foundVariantIds)

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Variants not found for the following ids: ${[...difference].join(
          ", "
        )}`
      )
    }

    // Verify that item exists
    const [inventoryItems] = await this.inventoryService_.listInventoryItems(
      {
        id: data.map((d) => d.inventoryItemId),
      },
      {
        select: ["id"],
      },
      {
        transactionManager: this.activeManager_,
      }
    )

    const foundInventoryItemIds = new Set(inventoryItems.map((v) => v.id))
    const requestedInventoryItemIds = new Set(
      data.map((v) => v.inventoryItemId)
    )

    if (foundInventoryItemIds.size !== requestedInventoryItemIds.size) {
      const difference = getSetDifference(
        requestedInventoryItemIds,
        foundInventoryItemIds
      )

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory items not found for the following ids: ${[
          ...difference,
        ].join(", ")}`
      )
    }

    const variantInventoryRepo = this.activeManager_.getRepository(
      ProductVariantInventoryItem
    )

    const existingAttachments = await variantInventoryRepo.find({
      where: data.map((d) => ({
        variant_id: d.variantId,
        inventory_item_id: d.inventoryItemId,
      })),
    })

    const existingMap: Map<string, Set<string>> = existingAttachments.reduce(
      (acc, curr) => {
        const existingSet = acc.get(curr.variant_id) || new Set()
        existingSet.add(curr.inventory_item_id)
        acc.set(curr.variant_id, existingSet)
        return acc
      },
      new Map()
    )

    const toCreate = (
      await promiseAll(
        data.map(async (d) => {
          if (existingMap.get(d.variantId)?.has(d.inventoryItemId)) {
            return null
          }

          return variantInventoryRepo.create({
            variant_id: d.variantId,
            inventory_item_id: d.inventoryItemId,
            required_quantity: d.requiredQuantity ?? 1,
          })
        })
      )
    ).filter(
      (
        tc: ProductVariantInventoryItem | null
      ): tc is ProductVariantInventoryItem => !!tc
    )

    const createdVariantInventoryItems = await variantInventoryRepo.save(
      toCreate
    )

    return createdVariantInventoryItems
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
      line_item_id: context.lineItemId,
    }

    const variantInventory = await this.listByVariant(variantId)

    if (variantInventory.length === 0) {
      return
    }

    let locationId = context.locationId
    const moduleContext = {
      transactionManager: this.activeManager_,
    }

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
        await this.inventoryService_.listInventoryLevels(
          {
            location_id: locationIds,
            inventory_item_id: variantInventory[0].inventory_item_id,
          },
          undefined,
          moduleContext
        )

      if (count === 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Must provide location_id or sales_channel_id to a Sales Channel that has associated locations with inventory levels"
        )
      }

      locationId = locations[0].location_id
    }

    const reservationItems =
      await this.inventoryService_.createReservationItems(
        variantInventory.map((inventoryPart) => {
          const itemQuantity = inventoryPart.required_quantity * quantity

          return {
            ...toReserve,
            location_id: locationId as string,
            inventory_item_id: inventoryPart.inventory_item_id,
            quantity: itemQuantity,
          }
        }),
        moduleContext
      )

    return reservationItems.flat()
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

    const context = {
      transactionManager: this.activeManager_,
    }
    const [reservations, reservationCount] =
      await this.inventoryService_.listReservationItems(
        {
          line_item_id: lineItemId,
        },
        {
          order: { created_at: "DESC" },
        },
        context
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
        await this.inventoryService_.deleteReservationItem(
          exactReservation.id,
          context
        )
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
          reservationsToDelete.map((r) => r.id),
          context
        )
      }

      if (reservationToUpdate) {
        await this.inventoryService_.updateReservationItem(
          reservationToUpdate.id,
          {
            quantity: reservationToUpdate.quantity - remainingQuantity,
          },
          context
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

      const context = {
        transactionManager: this.activeManager_,
      }

      const [inventoryLevels, inventoryLevelCount] =
        await this.inventoryService_.listInventoryLevels(
          {
            inventory_item_id: pvInventoryItems.map((i) => i.inventory_item_id),
            location_id: locationId,
          },
          undefined,
          context
        )

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
    lineItemId: string | string[],
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

    const itemIds = Array.isArray(lineItemId) ? lineItemId : [lineItemId]
    await this.inventoryService_.deleteReservationItemsByLineItem(itemIds, {
      transactionManager: this.activeManager_,
    })
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

    await promiseAll(
      variantInventory.map(async (inventoryPart) => {
        const itemQuantity = inventoryPart.required_quantity * quantity
        return await this.inventoryService_.adjustInventory(
          inventoryPart.inventory_item_id,
          locationId,
          itemQuantity,
          {
            transactionManager: this.activeManager_,
          }
        )
      })
    )
  }

  async setVariantAvailability(
    variants: ProductVariant[] | PricedVariant[],
    salesChannelId: string | string[] | undefined,
    availabilityContext: AvailabilityContext = {}
  ): Promise<ProductVariant[] | PricedVariant[]> {
    if (!this.inventoryService_) {
      return variants
    }

    const { variantInventoryMap, inventoryLocationMap } =
      await this.getAvailabilityContext(
        variants.map((v) => v.id),
        salesChannelId,
        availabilityContext
      )

    return variants.map((variant) => {
      if (!variant.id) {
        return variant
      }

      variant.purchasable = variant.allow_backorder

      if (!variant.manage_inventory) {
        variant.purchasable = true
        return variant
      }

      const variantInventory = variantInventoryMap.get(variant.id) || []

      if (!variantInventory.length) {
        delete variant.inventory_quantity
        variant.purchasable = true
        return variant
      }

      if (!salesChannelId) {
        delete variant.inventory_quantity
        variant.purchasable = false
        return variant
      }

      const locations =
        inventoryLocationMap.get(variantInventory[0].inventory_item_id) ?? []

      variant.inventory_quantity = locations.reduce(
        (acc, next) => acc + (next.stocked_quantity - next.reserved_quantity),
        0
      )

      variant.purchasable =
        variant.inventory_quantity > 0 || variant.allow_backorder

      return variant
    })
  }

  private async getAvailabilityContext(
    variants: string[],
    salesChannelId: string | string[] | undefined,
    existingContext: AvailabilityContext = {}
  ): Promise<Required<AvailabilityContext>> {
    let variantInventoryMap = existingContext.variantInventoryMap
    let inventoryLocationMap = existingContext.inventoryLocationMap

    if (!variantInventoryMap) {
      variantInventoryMap = new Map()
      const variantInventories = await this.listByVariant(variants)

      variantInventories.forEach((inventory) => {
        const variantId = inventory.variant_id
        const currentInventories = variantInventoryMap!.get(variantId) || []
        currentInventories.push(inventory)
        variantInventoryMap!.set(variantId, currentInventories)
      })
    }

    const locationIds: string[] = []

    if (salesChannelId && !inventoryLocationMap) {
      const locations = await this.salesChannelLocationService_
        .withTransaction(this.activeManager_)
        .listLocationIds(salesChannelId)
      locationIds.push(...locations)
    }

    if (!inventoryLocationMap) {
      inventoryLocationMap = new Map()
    }

    if (locationIds.length) {
      const [locationLevels] = await this.inventoryService_.listInventoryLevels(
        {
          location_id: locationIds,
          inventory_item_id: [
            ...new Set(
              Array.from(variantInventoryMap.values())
                .flat()
                .map((i) => i.inventory_item_id)
            ),
          ],
        },
        {},
        {
          transactionManager: this.activeManager_,
        }
      )

      locationLevels.reduce((acc, curr) => {
        if (!acc.has(curr.inventory_item_id)) {
          acc.set(curr.inventory_item_id, [])
        }
        acc.get(curr.inventory_item_id)!.push(curr)

        return acc
      }, inventoryLocationMap)
    }

    return {
      variantInventoryMap,
      inventoryLocationMap,
    }
  }

  async setProductAvailability(
    products: (Product | PricedProduct)[],
    salesChannelId: string | string[] | undefined
  ): Promise<(Product | PricedProduct)[]> {
    if (!this.inventoryService_) {
      return products
    }

    const variantIds: string[] = products
      .flatMap((p) => p.variants.map((v: { id?: string }) => v.id) ?? [])
      .filter((v): v is string => !!v)

    const availabilityContext = await this.getAvailabilityContext(
      variantIds,
      salesChannelId
    )

    return await promiseAll(
      products.map(async (product) => {
        if (!product.variants || product.variants.length === 0) {
          return product
        }

        product.variants = await this.setVariantAvailability(
          product.variants,
          salesChannelId,
          availabilityContext
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
      ...(await promiseAll(
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
