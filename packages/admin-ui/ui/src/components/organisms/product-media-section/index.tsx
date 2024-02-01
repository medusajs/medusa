import { Product } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import useToggleState from "../../../hooks/use-toggle-state"
import { ActionType } from "../../molecules/actionables"
import Section from "../../organisms/section"
import MediaModal from "./media-modal"

type Props = {
  product: Product
}

const ProductMediaSection = ({ product }: Props) => {
  const { state, close, toggle } = useToggleState()
  const { t } = useTranslation()

  const actions: ActionType[] = [
    {
      label: t("product-media-section-edit-media", "Edit Media"),
      onClick: toggle,
    },
  ]

  return (
    <>
      <Section title="Media" actions={actions}>
        {product.images && product.images.length > 0 && (
          <div className="gap-xsmall mt-base grid grid-cols-3">
            {product.images.map((image, index) => {
              return (
                <div
                  key={image.id}
                  className="flex aspect-square items-center justify-center"
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="rounded-rounded max-h-full max-w-full object-contain"
                  />
                </div>
              )
            })}
          </div>
        )}
      </Section>

      <MediaModal product={product} open={state} onClose={close} />
    </>
  )
}

export default ProductMediaSection
