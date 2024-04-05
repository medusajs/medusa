import { useTranslation } from "react-i18next"

import { ProductDTO } from "@medusajs/types"
import { Thumbnail } from "../../../../common/thumbnail"

type ProductCellProps = {
  product: ProductDTO
}

export const ProductCell = ({ product }: ProductCellProps) => {
  return (
    <div className="flex h-full w-full items-center gap-x-3 overflow-hidden">
      <div className="w-fit flex-shrink-0">
        <Thumbnail src={product.thumbnail} />
      </div>
      <span className="truncate">{product.title}</span>
    </div>
  )
}

export const ProductHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span>{t("fields.product")}</span>
    </div>
  )
}
