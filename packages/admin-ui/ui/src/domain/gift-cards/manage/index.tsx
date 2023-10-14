import { Product } from "@medusajs/medusa"
import { useAdminProducts } from "medusa-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import WidgetContainer from "../../../components/extensions/widget-container"
import GiftCardDenominationsSection from "../../../components/organisms/gift-card-denominations-section"
import ProductAttributesSection from "../../../components/organisms/product-attributes-section"
import ProductGeneralSection from "../../../components/organisms/product-general-section"
import ProductMediaSection from "../../../components/organisms/product-media-section"
import ProductRawSection from "../../../components/organisms/product-raw-section"
import ProductThumbnailSection from "../../../components/organisms/product-thumbnail-section"
import { useWidgets } from "../../../providers/widget-provider"
import { getErrorStatus } from "../../../utils/get-error-status"

const Manage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { products, error } = useAdminProducts(
    {
      is_giftcard: true,
    },
    {
      keepPreviousData: true,
    }
  )

  const giftCard = products?.[0] as Product | undefined

  const { getWidgets } = useWidgets()

  if (!giftCard) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner variant="secondary" size="large" />
      </div>
    )
  }

  if (error) {
    const errorStatus = getErrorStatus(error)

    if (errorStatus) {
      // If the product is not found, redirect to the 404 page
      if (errorStatus.status === 404) {
        navigate("/404")
        return null
      }
    }

    // Let the error boundary handle the error
    throw error
  }

  return (
    <div className="pb-5xlarge">
      <BackButton
        path="/a/gift-cards"
        label={t("manage-back-to-gift-cards", "Back to Gift Cards")}
        className="mb-xsmall"
      />
      <div className="gap-x-base grid grid-cols-12">
        <div className="gap-y-xsmall col-span-8 flex flex-col">
          {getWidgets("gift_card.details.before").map((w, i) => {
            return (
              <WidgetContainer
                key={i}
                widget={w}
                injectionZone={"gift_card.details.before"}
                entity={giftCard}
              />
            )
          })}

          <ProductGeneralSection product={giftCard} />

          <GiftCardDenominationsSection giftCard={giftCard} />

          <ProductAttributesSection product={giftCard} />

          {getWidgets("gift_card.details.after").map((w, i) => {
            return (
              <WidgetContainer
                key={i}
                widget={w}
                injectionZone={"gift_card.details.after"}
                entity={giftCard}
              />
            )
          })}

          <ProductRawSection product={giftCard} />
        </div>
        <div className="gap-y-xsmall col-span-4 flex flex-col">
          <ProductThumbnailSection product={giftCard} />
          <ProductMediaSection product={giftCard} />
        </div>
      </div>
    </div>
  )
}

export default Manage
