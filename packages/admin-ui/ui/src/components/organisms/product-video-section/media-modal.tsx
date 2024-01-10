import { Product } from "@medusajs/medusa"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import useNotification from "../../../hooks/use-notification"
import { FormImage } from "../../../types/shared"
import { prepareImages as prepareVideos } from "../../../utils/images"
import { nestedForm } from "../../../utils/nested-form"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import { useAdminCustomPost } from "medusa-react"
import MediaFormVideos, {
  MediaFormType,
} from "../../forms/product/media-form-videos"

type Props = {
  videos: { url: string }[]
  refetch: () => void
  open: boolean
  onClose: () => void
  product: Product
}

type MediaFormWrapper = {
  media: MediaFormType
}

type FormVideo = FormImage

const MediaModal = ({ videos, refetch, open, onClose, product }: Props) => {
  const { t } = useTranslation()
  // const { onUpdate, updating } = useEditProductActions(product.id)
  const form = useForm<MediaFormWrapper>({
    defaultValues: getDefaultValues(videos),
  })
  const { mutateAsync, isLoading: loading } = useAdminCustomPost(
    `/products/${product.id}/video`,
    ["update-product-videos"]
  )
  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  const notification = useNotification()

  useEffect(() => {
    reset(getDefaultValues(videos))
  }, [videos, reset])

  const onReset = () => {
    reset(getDefaultValues(videos))
    onClose()
  }

  const onSubmit = handleSubmit(async (data) => {
    let preppedVideos: FormImage[] = []
    try {
      preppedVideos = await prepareVideos(data.media.videos)
    } catch (error) {
      let errorMessage = t(
        "product-media-section-upload-video-error",
        "Something went wrong while trying to upload videos."
      )
      const response = (error as any).response as Response

      if (response.status === 500) {
        errorMessage =
          errorMessage +
          " " +
          t(
            "product-media-section-file-service-not-configured",
            "You might not have a file service configured. Please contact your administrator"
          )
      }

      notification(
        t("product-media-section-error", "Error"),
        errorMessage,
        "error"
      )
      return
    }
    const urls = preppedVideos.map((video) => video.url)

    const response = await mutateAsync({ urls: urls ?? [] })
    if (response.data && response.response.status < 500) {
      notification(
        "Update Video Success",
        "Succesfully Updated Videos",
        "success"
      )
      refetch()
      onReset()
    }

    // onUpdate(
    //   {
    //     images: urls,
    //   },
    //   onReset
    // )
  })

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">
            {t("product-media-section-edit-media", "Edit Media")}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div>
              <h2 className="inter-large-semibold mb-2xsmall">
                {t("product-media-section-media", "Media")}
              </h2>
              <p className="inter-base-regular text-grey-50 mb-large">
                {t(
                  "product-media-section-add-images-to-your-product",
                  "Add images to your product."
                )}
              </p>
              <div>
                <MediaFormVideos form={nestedForm(form, "media")} />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end gap-x-2">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                {t("product-media-section-cancel", "Cancel")}
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={loading}
              >
                {t("product-media-section-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (videos: { url: string }[]): MediaFormWrapper => {
  return {
    media: {
      videos:
        videos.map(({ url }) => ({
          url,
          selected: false,
        })) || [],
    },
  }
}

export default MediaModal
