import { ProductStatus } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import { StatusCell } from "../../common/status-cell"

type ProductStatusCellProps = {
  status: ProductStatus
}

export const ProductStatusCell = ({ status }: ProductStatusCellProps) => {
  const { t } = useTranslation()

  const [color, text] = {
    draft: ["grey", t("products.productStatus.draft")],
    proposed: ["orange", t("products.productStatus.proposed")],
    published: ["green", t("products.productStatus.published")],
    rejected: ["red", t("products.productStatus.rejected")],
  }[status] as ["grey" | "orange" | "green" | "red", string]

  return <StatusCell color={color}>{text}</StatusCell>
}

export const ProductStatusHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span>{t("fields.status")}</span>
    </div>
  )
}
