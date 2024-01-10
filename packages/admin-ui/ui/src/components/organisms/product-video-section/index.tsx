import { Product } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import useToggleState from "../../../hooks/use-toggle-state"
import { ActionType } from "../../molecules/actionables"
import Section from "../../organisms/section"
import MediaModal from "./media-modal"
import { useAdminCustomQuery } from "medusa-react"
type Props = {
  product: Product
}

const ProductVideoSection = ({ product }: Props) => {
  const { state, close, toggle } = useToggleState()
  const { t } = useTranslation()
  const actions: ActionType[] = [
    {
      label: t("product-media-section-edit-media", "Edit Media"),
      onClick: toggle,
    },
  ]
  const { data, isFetched, refetch } = useAdminCustomQuery(
    `/products/${product.id}/video`,
    ["get-videos-products"]
  )
  console.log(data?.videos)
  return isFetched ? (
    <>
      <Section title="Video" actions={actions}>
        {data.videos && data.videos.length > 0 && (
          <div className="gap-xsmall mt-base grid grid-cols-3">
            {data.videos.map(
              (video: { id: string; url: string }, index: number) => {
                return (
                  <div
                    key={video.id}
                    className="flex aspect-square items-center justify-center"
                  >
                    <img
                      src={video.url}
                      alt={`Video ${index + 1}`}
                      className="rounded-rounded max-h-full max-w-full object-contain"
                    />
                  </div>
                )
              }
            )}
          </div>
        )}
      </Section>

      <MediaModal
        refetch={refetch}
        videos={data?.videos ?? []}
        product={product}
        open={state}
        onClose={close}
      />
    </>
  ) : (
    <p>Fetching</p>
  )
}

export default ProductVideoSection
