import { PromotionDTO } from "@medusajs/types"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const usePromotionTableColumns = () => {
  return useMemo<ColumnDef<PromotionDTO>[]>(() => [], [])
}
