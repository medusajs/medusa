import { Product } from "@medusajs/medusa"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import useEditProductActions from "../../../hooks/use-edit-product-actions"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../utils/error-messages"
import TwoStepDelete from "../../atoms/two-step-delete"
import Button from "../../fundamentals/button"
import Section from "../../organisms/section"
import ThumbnailModal from "./thumbnail-modal"

type Props = {
  product: Product
}

const ProductThumbnailSection = ({ product }: Props) => {
  const { t } = useTranslation()
  const { onUpdate, updating } = useEditProductActions(product.id)
  const { state, toggle, close } = useToggleState()

  const notification = useNotification()

  const handleDelete = () => {
    onUpdate(
      {
        // @ts-ignore
        thumbnail: null,
      },
      {
        onSuccess: () => {
          notification(
            t("product-thumbnail-section-success", "Success"),
            t(
              "product-thumbnail-section-successfully-deleted-thumbnail",
              "Successfully deleted thumbnail"
            ),
            "success"
          )
        },
        onError: (err) => {
          notification(
            t("product-thumbnail-section-error", "Error"),
            getErrorMessage(err),
            "error"
          )
        },
      }
    )
  }

  return (
    <>
      <Section
        title="Thumbnail"
        customActions={
          <div className="gap-x-xsmall flex items-center">
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={toggle}
            >
              {product.thumbnail
                ? t("product-thumbnail-section-edit", "Edit")
                : t("product-thumbnail-section-upload", "Upload")}
            </Button>
            {product.thumbnail && (
              <TwoStepDelete onDelete={handleDelete} deleting={updating} />
            )}
          </div>
        }
      >
        <div
          className={clsx("gap-xsmall mt-base grid grid-cols-3", {
            hidden: !product.thumbnail,
          })}
        >
          {product.thumbnail && (
            <div className="flex aspect-square items-center justify-center">
              <img
                src={product.thumbnail}
                alt={`Thumbnail for ${product.title}`}
                className="rounded-rounded max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </Section>

      <ThumbnailModal product={product} open={state} onClose={close} />
    </>
  )
}

export default ProductThumbnailSection
