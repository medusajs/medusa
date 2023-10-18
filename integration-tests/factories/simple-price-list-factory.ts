import {
  CustomerGroup,
  MoneyAmount,
  PriceList,
  PriceListStatus,
  PriceListType,
} from "@medusajs/medusa"

import { DataSource } from "typeorm"
import faker from "faker"
import { simpleCustomerGroupFactory } from "./simple-customer-group-factory"
import { ProductVariantMoneyAmount } from "@medusajs/medusa"

type ProductListPrice = {
  variant_id: string
  currency_code: string
  region_id: string
  amount: number
  min_quantity?: number
  max_quantity?: number
}

export type PriceListFactoryData = {
  id?: string
  name?: string
  description?: string
  type?: PriceListType
  status?: PriceListStatus
  starts_at?: Date
  ends_at?: Date
  customer_groups?: string[]
  prices?: ProductListPrice[]
  includes_tax?: boolean
}

export const simplePriceListFactory = async (
  dataSource: DataSource,
  data: PriceListFactoryData = {},
  seed?: number
): Promise<PriceList> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const listId = data.id || `simple-price-list-${Math.random() * 1000}`

  let customerGroups: CustomerGroup[] = []
  if (typeof data.customer_groups !== "undefined") {
    customerGroups = await Promise.all(
      data.customer_groups.map((group) =>
        simpleCustomerGroupFactory(dataSource, { id: group })
      )
    )
  }

  const toCreate = {
    id: listId,
    name: data.name || faker.commerce.productName(),
    description: data.description || "Some text",
    status: data.status || PriceListStatus.ACTIVE,
    type: data.type || PriceListType.OVERRIDE,
    starts_at: data.starts_at || null,
    ends_at: data.ends_at || null,
    customer_groups: customerGroups,
    includes_tax: data.includes_tax,
  }

  const toSave = manager.create(PriceList, toCreate)
  const toReturn = await manager.save(toSave) as PriceList

  if (typeof data.prices !== "undefined") {
    toReturn.prices = await Promise.all(data.prices.map(async (ma) => {
      const factoryData = {
        ...ma,
        price_list_id: listId,
      }
      const toSave: MoneyAmount = manager.create(MoneyAmount, factoryData)
      await manager.save(toSave)
      
      await manager.insert(ProductVariantMoneyAmount, {
        id: `${ma.variant_id}-${toSave.id}`,
        variant_id: ma.variant_id,
        money_amount_id: toSave.id,
      })

      return toSave
    }))
  }


  return toReturn
}
