import { useTranslation } from "react-i18next"

import { Thumbnail } from "../../../../common/thumbnail"
import { HttpTypes } from "@medusajs/types"
import { TruncatedText } from "../../../../common/truncated-text"

type ProductCellProps = {
  product: Pick<HttpTypes.AdminProduct, "thumbnail" | "title">
}

export const ProductCell = ({ product }: ProductCellProps) => {
  return (
    <div className="flex h-full w-full max-w-[250px] items-center gap-x-3 overflow-hidden">
      <div className="w-fit flex-shrink-0">
        <Thumbnail src={product.thumbnail} />
      </div>
      <TruncatedText text={product.title} />
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
