import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { json, useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { VariantsTableForm } from "./components/variants-table-form/variants-table-form"
import { useProduct } from "../../../hooks/api"

type VariantImagesPartial = {
  id: string
  variants: { id: string }[]
}

export const ProductImageVariantsEdit = () => {
  const { t } = useTranslation()

  const { id: product_id, image_id } = useParams<{
    id: string
    image_id: string
  }>()

  const { product, isPending } = useProduct(
    product_id!,
    {
      // TODO: Remove exclusion once we avoid including unnecessary relations by default in the query config
      fields:
        "images.id,images.url,images.variants.id,-type,-collection,-options,-tags,-variants,-sales_channels",
    },
    {
      enabled: !!product_id && !!image_id,
    }
  )

  const image = product?.images?.find((image) => image.id === image_id)

  if (!product_id || !image_id || isPending) {
    return null
  }

  if (!isPending && !image) {
    throw json({ message: `An image with ID ${image_id} was not found` }, 404)
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <div className="flex items-center gap-x-4">
          <img src={image!.url} className="h-20" />
          <div>
            <RouteDrawer.Title asChild>
              <Heading>{t("products.variantMedia.manageVariants")}</Heading>
            </RouteDrawer.Title>
            <RouteDrawer.Description>
              {t("products.variantMedia.manageVariantsDescription")}
            </RouteDrawer.Description>
          </div>
        </div>
      </RouteDrawer.Header>
      <VariantsTableForm
        productId={product_id}
        image={image! as VariantImagesPartial}
      />
    </RouteDrawer>
  )
}
