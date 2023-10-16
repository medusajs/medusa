import {
  ExtendedFindConfig,
  FilterableInventoryItemProps,
  FindConfig,
} from "@medusajs/types"
import { objectToStringPath } from "@medusajs/utils"
import { EntityManager, FindOptionsWhere, Brackets } from "typeorm"

import { InventoryItem } from "../models"
import { buildQuery } from "./build-query"

export function getListQuery(
  manager: EntityManager,
  selector: FilterableInventoryItemProps = {},
  config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 }
) {
  const inventoryItemRepository = manager.getRepository(InventoryItem)

  const { q, ...selectorRest } = selector
  const query = buildQuery(
    selectorRest,
    config
  ) as ExtendedFindConfig<InventoryItem> & {
    where: FindOptionsWhere<
      InventoryItem & {
        location_id?: string
      }
    >
  }

  const queryBuilder = inventoryItemRepository.createQueryBuilder("inv_item")

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

  if (q) {
    queryBuilder.where(query.where).andWhere(
      new Brackets((qb) => {
        qb.where("inv_item.sku ILike :q", { q: `%${q}%` })
          .orWhere("inv_item.description ILike :q", { q: `%${q}%` })
          .orWhere("inv_item.title ILike :q", { q: `%${q}%` })
      })
    )
  } else {
    queryBuilder.where(query.where)
  }

  if (query.take) {
    queryBuilder.take(query.take)
  }

  if (query.skip) {
    queryBuilder.skip(query.skip)
  }

  if (query.select) {
    const legacySelect = objectToStringPath(query.select)
    queryBuilder.select(legacySelect.map((s) => "inv_item." + s))
  }

  if (query.withDeleted) {
    queryBuilder.withDeleted()
  }

  if (query.order) {
    const toSelect: string[] = []
    const parsed = Object.entries(query.order).reduce((acc, [k, v]) => {
      const key = `inv_item.${k}`
      if (!query.select?.[k]) {
        toSelect.push(key)
      }
      acc[key] = v
      return acc
    }, {})
    queryBuilder.addSelect(toSelect)
    queryBuilder.orderBy(parsed)
  }

  return queryBuilder
}
