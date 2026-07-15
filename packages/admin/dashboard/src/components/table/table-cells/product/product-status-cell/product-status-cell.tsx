import { useTranslation } from "react-i18next"

import { HttpTypes } from "@medusajs/types"
import { DataTableStatusIndicator } from "../../../../data-table/components/data-table-status-cell/data-table-status-cell"

type ProductStatusCellProps = {
  status: HttpTypes.AdminProductStatus
}

export const ProductStatusCell = ({ status }: ProductStatusCellProps) => {
  const { t } = useTranslation()

  const [color, text] = {
    draft: ["grey", t("products.productStatus.draft")],
    proposed: ["orange", t("products.productStatus.proposed")],
    published: ["green", t("products.productStatus.published")],
    rejected: ["red", t("products.productStatus.rejected")],
  }[status] as ["grey" | "orange" | "green" | "red", string]

  return (
    <DataTableStatusIndicator className="w-[92px]" color={color}>
      {text}
    </DataTableStatusIndicator>
  )
}

export const ProductStatusHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span>{t("fields.status")}</span>
    </div>
  )
}
