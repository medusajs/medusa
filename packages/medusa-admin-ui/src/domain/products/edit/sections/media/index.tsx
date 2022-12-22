import { Product } from "@medusajs/medusa"
import React from "react"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import MediaModal from "./media-modal"

type Props = {
  product: Product
}

const MediaSection = ({ product }: Props) => {
  const { state, close, toggle } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Edit Media",
      onClick: toggle,
    },
  ]

  return (
    <>
      <Section title="Media" actions={actions}>
        {product.images && product.images.length > 0 && (
          <div className="grid grid-cols-3 gap-xsmall mt-base">
            {product.images.map((image, index) => {
              return (
                <div
                  key={image.id}
                  className="aspect-square flex items-center justify-center"
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="object-contain rounded-rounded max-w-full max-h-full"
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

export default MediaSection
