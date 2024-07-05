import { useTranslation } from "react-i18next"

import { ProductCollectionDTO } from "@medusajs/types"
import { PlaceholderCell } from "../../common/placeholder-cell"

type CollectionCellProps = {
  collection?: ProductCollectionDTO | null
}

export const CollectionCell = ({ collection }: CollectionCellProps) => {
  if (!collection) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">{collection.title}</span>
    </div>
  )
}

export const CollectionHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span>{t("fields.collection")}</span>
    </div>
  )
}
