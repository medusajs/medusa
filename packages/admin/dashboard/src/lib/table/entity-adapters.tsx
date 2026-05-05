import { HttpTypes } from "@medusajs/types"
import { ColumnAdapter } from "../../hooks/table/columns/use-configurable-table-columns"

export const orderColumnAdapter: ColumnAdapter<HttpTypes.AdminOrder> = {
  getColumnAlignment: (column) => {
    if (column.semantic_type === "currency") {
      return "right"
    }
    if (column.semantic_type === "status") {
      return "center"
    }
    if (column.computed?.type === "country_code") {
      return "center"
    }
    return "left"
  },
}

export const productColumnAdapter: ColumnAdapter<HttpTypes.AdminProduct> = {
  getColumnAlignment: (column) => {
    if (column.field === "product_display") {
      return "left"
    }
    if (column.field === "collection.title") {
      return "left"
    }
    if (column.field === "sales_channels_display") {
      return "left"
    }
    if (column.field === "variants_count") {
      return "left"
    }
    if (column.field === "sku") {
      return "center"
    }
    if (column.field === "stock") {
      return "right"
    }
    if (column.semantic_type === "currency") {
      return "right"
    }
    if (column.semantic_type === "status") {
      return "left"
    }
    if (column.computed?.type === "product_info") {
      return "left"
    }
    if (column.computed?.type === "count") {
      return "left"
    }
    if (column.computed?.type === "sales_channels_list") {
      return "left"
    }

    return "left"
  },

  transformCellValue: (_value, row, column) => {
    if (
      column.field === "variants_count" ||
      column.computed?.type === "count"
    ) {
      const count = Array.isArray(row.variants) ? row.variants.length : 0
      return `${count} ${count === 1 ? "variant" : "variants"}`
    }

    if (
      column.field === "product_display" ||
      column.computed?.type === "product_info"
    ) {
      return null
    }

    if (
      column.field === "sales_channels_display" ||
      column.computed?.type === "sales_channels_list"
    ) {
      return null
    }

    if (column.field === "status") {
      return null
    }

    return null
  },
}

export const customerColumnAdapter: ColumnAdapter<HttpTypes.AdminCustomer> = {
  getColumnAlignment: (column) => {
    if (column.field === "orders_count") {
      return "right"
    }
    if (column.semantic_type === "currency") {
      return "right"
    }
    if (column.semantic_type === "status") {
      return "center"
    }

    return "left"
  },

  transformCellValue: (_value, row, column) => {
    if (column.field === "name") {
      const { first_name, last_name } = row
      if (first_name || last_name) {
        return `${first_name || ""} ${last_name || ""}`.trim()
      }
      return "-"
    }

    return null
  },
}

// eslint-disable-next-line max-len
export const inventoryColumnAdapter: ColumnAdapter<HttpTypes.AdminInventoryItem> =
  {
    getColumnAlignment: (column) => {
      if (column.field === "stocked_quantity") {
        return "right"
      }
      if (column.field === "reserved_quantity") {
        return "right"
      }
      if (column.field === "available_quantity") {
        return "right"
      }
      if (column.semantic_type === "status") {
        return "center"
      }

      return "left"
    },
  }

export const entityAdapters = {
  orders: orderColumnAdapter,
  products: productColumnAdapter,
  customers: customerColumnAdapter,
  inventory: inventoryColumnAdapter,
} as const

export type EntityType = keyof typeof entityAdapters

export function getEntityAdapter<TData = any>(
  entity: string
): ColumnAdapter<TData> | undefined {
  return entityAdapters[entity as EntityType] as ColumnAdapter<TData>
}
