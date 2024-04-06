import { SalesChannel } from "@medusajs/medusa"
import {
  ProductCollectionDTO,
  ProductDTO,
  ProductVariantDTO,
} from "@medusajs/types"
import { StatusBadge, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Thumbnail } from "../thumbnail"

export const ProductVariantCell = ({
  variants,
}: {
  variants: ProductVariantDTO[] | null
}) => {
  const { t } = useTranslation()

  if (!variants || !variants.length) {
    return (
      <Text size="small" className="text-ui-fg-subtle">
        -
      </Text>
    )
  }

  return (
    <Text size="small" className="text-ui-fg-base">
      {t("products.variantCount", {
        count: variants.length,
      })}
    </Text>
  )
}

export const ProductStatusCell = ({
  status,
}: {
  status: ProductDTO["status"]
}) => {
  const { t } = useTranslation()

  const color = {
    draft: "grey",
    published: "green",
    rejected: "red",
    proposed: "blue",
  }[status] as "grey" | "green" | "red" | "blue"

  return (
    <StatusBadge color={color}>
      {t(`products.productStatus.${status}`)}
    </StatusBadge>
  )
}

export const ProductAvailabilityCell = ({
  salesChannels,
}: {
  salesChannels: SalesChannel[] | null
}) => {
  const { t } = useTranslation()

  if (!salesChannels || salesChannels.length === 0) {
    return (
      <Text size="small" className="text-ui-fg-subtle">
        -
      </Text>
    )
  }

  if (salesChannels.length < 3) {
    return (
      <Text size="small" className="text-ui-fg-base">
        {salesChannels.map((sc) => sc.name).join(", ")}
      </Text>
    )
  }

  return (
    <div className="flex items-center gap-x-2">
      <Text size="small" className="text-ui-fg-base">
        <span>
          {salesChannels
            .slice(0, 2)
            .map((sc) => sc.name)
            .join(", ")}
        </span>{" "}
        <span>
          {t("general.plusCountMore", {
            count: salesChannels.length - 2,
          })}
        </span>
      </Text>
    </div>
  )
}

export const ProductTitleCell = ({ product }: { product: ProductDTO }) => {
  const thumbnail = product.thumbnail
  const title = product.title

  return (
    <div className="flex items-center gap-x-3">
      <Thumbnail src={thumbnail} alt={`Thumbnail image of ${title}`} />
      <Text size="small" className="text-ui-fg-base">
        {title}
      </Text>
    </div>
  )
}

export const ProductCollectionCell = ({
  collection,
}: {
  collection: ProductCollectionDTO | null
}) => {
  if (!collection) {
    return (
      <Text size="small" className="text-ui-fg-subtle">
        -
      </Text>
    )
  }

  return (
    <Text size="small" className="text-ui-fg-base">
      {collection.title}
    </Text>
  )
}
