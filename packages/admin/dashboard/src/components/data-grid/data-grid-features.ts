import {
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  tableFeatures,
} from "@tanstack/react-table"

export const dataGridFeatures = tableFeatures({
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
  columnVisibilityFeature,
})

export type DataGridFeatures = typeof dataGridFeatures
