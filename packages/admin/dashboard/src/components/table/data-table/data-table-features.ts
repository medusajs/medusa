import {
  columnVisibilityFeature,
  createExpandedRowModel,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from "@tanstack/react-table"

export const dataTableFeatures = tableFeatures({
  columnVisibilityFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  expandedRowModel: createExpandedRowModel(),
})

export type DataTableFeatures = typeof dataTableFeatures
