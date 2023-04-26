import {
  ICacheService,
  IEventBusService,
  IInventoryService,
  IStockLocationService,
  ReservationItemDTO,
  ReserveQuantityContext,
} from "@medusajs/types"
import {
  LineItem,
  Product,
  ProductVariant,
  ProductVariantInventoryItem,
} from "../models"
import { MedusaError, isDefined } from "@medusajs/utils"
import { PricedProduct, PricedVariant } from "../types/pricing"
import {
  ProductVariantInventoryService,
  ProductVariantService,
  SalesChannelInventoryService,
  SalesChannelLocationService,
} from "../services"

import { EntityManager } from "typeorm"
import { AbstractInventoryLocationStrategy } from "../interfaces/inventory-location"

type InjectedDependencies = {
  manager: EntityManager
  inventoryService: IInventoryService
  productVariantService: ProductVariantService
  productVariantInventoryService: ProductVariantInventoryService
  eventBusService: IEventBusService
  stockLocationService: IStockLocationService
  salesChannelLocationService: SalesChannelLocationService
  salesChannelInventoryService: SalesChannelInventoryService
  cacheService: ICacheService
}

class InventoryLocationStrategy extends AbstractInventoryLocationStrategy {
  protected readonly manager_: EntityManager
  protected readonly productVariantService_: ProductVariantService
  // eslint-disable-next-line max-len
  protected readonly productVariantInventoryService_: ProductVariantInventoryService
  protected readonly salesChannelLocationService_: SalesChannelLocationService
  protected readonly salesChannelInventoryService_: SalesChannelInventoryService

  protected readonly inventoryService_: IInventoryService
  protected readonly stockLocationService_: IStockLocationService
  protected readonly eventBusService_: IEventBusService
  protected readonly cacheService_: ICacheService

  constructor({
    manager,
    inventoryService,
    productVariantInventoryService,
    eventBusService,
    productVariantService,
    stockLocationService,
    salesChannelLocationService,
    salesChannelInventoryService,
    cacheService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])
    this.manager_ = manager
    this.inventoryService_ = inventoryService
    this.productVariantInventoryService_ = productVariantInventoryService
    this.eventBusService_ = eventBusService
    this.productVariantService_ = productVariantService
    this.stockLocationService_ = stockLocationService
    this.salesChannelLocationService_ = salesChannelLocationService
    this.salesChannelInventoryService_ = salesChannelInventoryService
    this.cacheService_ = cacheService
  }

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

    const variantInventory =
      await this.productVariantInventoryService_.listByVariant(variantId)

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
        { select: ["id"] },
        {
          transactionManager: this.activeManager_,
        }
      )
      locationIds = stockLocations.map((l) => l.id)
    }

    const hasInventory = await Promise.all(
      variantInventory.map(async (inventoryPart) => {
        const itemQuantity = inventoryPart.required_quantity * quantity
        return await this.inventoryService_.confirmInventory(
          inventoryPart.inventory_item_id,
          locationIds,
          itemQuantity,
          {
            transactionManager: this.activeManager_,
          }
        )
      })
    )

    return hasInventory.every(Boolean)
  }
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

    const variantInventory =
      await this.productVariantInventoryService_.listByVariant(variantId)

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
        await this.inventoryService_.listInventoryLevels(
          {
            location_id: locationIds,
            inventory_item_id: variantInventory[0].inventory_item_id,
          },
          {},
          {
            transactionManager: this.activeManager_,
          }
        )

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
        return await this.inventoryService_.createReservationItem(
          {
            ...toReserve,
            location_id: locationId as string,
            inventory_item_id: inventoryPart.inventory_item_id,
            quantity: itemQuantity,
          },
          {
            transactionManager: this.activeManager_,
          }
        )
      })
    )
  }
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
        },
        {
          transactionManager: this.activeManager_,
        }
      )

    reservations.sort((a, _) => {
      if (a.location_id === locationId) {
        return -1
      }
      return 0
    })

    if (reservationCount) {
      const inventoryItems =
        await this.productVariantInventoryService_.listByVariant(variantId)
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
          {
            transactionManager: this.activeManager_,
          }
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
          {
            transactionManager: this.activeManager_,
          }
        )
      }

      if (reservationToUpdate) {
        await this.inventoryService_.updateReservationItem(
          reservationToUpdate.id,
          {
            quantity: reservationToUpdate.quantity - remainingQuantity,
          },
          {
            transactionManager: this.activeManager_,
          }
        )
      }
    }
  }
  async validateInventoryAtLocation(
    items: Omit<LineItem, "beforeInsert">[],
    locationId: string
  ): Promise<void> {
    if (!this.inventoryService_) {
      return
    }

    const itemsToValidate = items.filter((item) => !!item.variant_id)

    for (const item of itemsToValidate) {
      const pvInventoryItems =
        await this.productVariantInventoryService_.listByVariant(
          item.variant_id!
        )

      if (!pvInventoryItems.length) {
        continue
      }

      const [inventoryLevels, inventoryLevelCount] =
        await this.inventoryService_.listInventoryLevels(
          {
            inventory_item_id: pvInventoryItems.map((i) => i.inventory_item_id),
            location_id: locationId,
          },
          {},
          {
            transactionManager: this.activeManager_,
          }
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

    await this.inventoryService_.deleteReservationItemsByLineItem(lineItemId, {
      transactionManager: this.activeManager_,
    })
  }

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

    const variantInventory =
      await this.productVariantInventoryService_.listByVariant(variantId)

    if (variantInventory.length === 0) {
      return
    }

    await Promise.all(
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
    variantInventoryMap: Map<string, ProductVariantInventoryItem[]> = new Map()
  ): Promise<ProductVariant[] | PricedVariant[]> {
    if (!this.inventoryService_) {
      return variants
    }

    if (!variantInventoryMap.size) {
      const variantInventories =
        await this.productVariantInventoryService_.listByVariant(
          variants.map((v) => v.id)
        )

      variantInventories.forEach((inventory) => {
        const variantId = inventory.variant_id
        const currentInventories = variantInventoryMap.get(variantId) || []
        currentInventories.push(inventory)
        variantInventoryMap.set(variantId, currentInventories)
      })
    }

    return await Promise.all(
      variants.map(async (variant) => {
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

        const locationIds =
          await this.salesChannelLocationService_.listLocationIds(
            salesChannelId
          )

        const [locations] = await this.inventoryService_.listInventoryLevels(
          {
            location_id: locationIds,
            inventory_item_id: variantInventory[0].inventory_item_id,
          },
          {},
          {
            transactionManager: this.activeManager_,
          }
        )

        variant.inventory_quantity = locations.reduce(
          (acc, next) => acc + (next.stocked_quantity - next.reserved_quantity),
          0
        )

        variant.purchasable =
          variant.inventory_quantity > 0 || variant.allow_backorder

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

export default InventoryLocationStrategy
