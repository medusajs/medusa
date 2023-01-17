import { EntityManager, ILike } from "typeorm"
import {
  buildLegacySelectOrRelationsFrom,
  buildQuery,
  FilterableInventoryItemProps,
  FindConfig,
} from "@medusajs/medusa"
import { InventoryItem } from "../models"

export function getListQuery(
  manager: EntityManager,
  selector: FilterableInventoryItemProps = {},
  config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 }
) {
  const inventoryItemRepository = manager.getRepository(InventoryItem)

  const { q, ...selectorRest } = selector
  const query = buildQuery<FilterableInventoryItemProps, InventoryItem & { location_id?: string | string[] }>(selectorRest, config)

  const queryBuilder = inventoryItemRepository.createQueryBuilder("inv_item")

  if (q) {
    query.where.sku = ILike(`%${q}%`)
  }

  if ("location_id" in query.where) {
    const locationIds = Array.isArray(selector.location_id)
      ? selector.location_id
      : [selector.location_id]

    queryBuilder.innerJoin(
      "inventory_level",
      "level",
      "level.inventory_item_id = inv_item.id AND level.location_id IN (:...locationIds)",
      { locationIds }
    )

    delete query.where.location_id
  }

  if (query.take) {
    queryBuilder.take(query.take)
  }

  if (query.skip) {
    queryBuilder.skip(query.skip)
  }

  if (query.where) {
    queryBuilder.where(query.where)
  }

  if (query.select) {
    const legacySelect = buildLegacySelectOrRelationsFrom(query.select)
    queryBuilder.select(legacySelect.map((s) => "inv_item." + s))
  }

  if (query.order) {
    const toSelect: string[] = []
    const parsed = Object.entries(query.order).reduce((acc, [k, v]) => {
      const key = `inv_item.${k}`
      toSelect.push(key)
      acc[key] = v
      return acc
    }, {})
    queryBuilder.addSelect(toSelect)
    queryBuilder.orderBy(parsed)
  }

  return queryBuilder
}
