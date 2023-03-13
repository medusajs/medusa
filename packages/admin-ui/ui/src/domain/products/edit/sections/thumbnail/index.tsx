import { Product } from "@medusajs/medusa"
import clsx from "clsx"
import TwoStepDelete from "../../../../../components/atoms/two-step-delete"
import Button from "../../../../../components/fundamentals/button"
import Section from "../../../../../components/organisms/section"
import useNotification from "../../../../../hooks/use-notification"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../../../utils/error-messages"
import useEditProductActions from "../../hooks/use-edit-product-actions"
import ThumbnailModal from "./thumbnail-modal"

type Props = {
  product: Product
}

const TumbnailSection = ({ product }: Props) => {
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
          notification("Success", "Successfully deleted thumbnail", "success")
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
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
              {product.thumbnail ? "Edit" : "Upload"}
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

export default TumbnailSection
