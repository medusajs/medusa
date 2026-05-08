import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, ThumbnailBadge } from "@medusajs/icons"
import { Button, Checkbox, clx, CommandBar, toast, Tooltip } from "@medusajs/ui"
import { Fragment, useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import {
  useBatchVariantImages,
  useUpdateProductVariant,
} from "../../../../../hooks/api/products"
import { ExtendedVariant } from "../../../product-variant-detail/constants"

/**
 * Schema
 */
const MediaSchema = z.object({
  image_ids: z.array(z.string()),
  thumbnail: z.string().nullable(),
})

type MediaSchemaType = z.infer<typeof MediaSchema>

/**
 * Prop types
 */
type ProductVariantMediaViewProps = {
  variant: ExtendedVariant
}

export const EditProductVariantMediaForm = ({
  variant,
}: ProductVariantMediaViewProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const allProductImages = variant.product?.images || []
  const allVariantImages = (variant.images || []).filter((image) =>
    image.variants?.some((imageVariant) => imageVariant.id === variant.id)
  )

  const unassociatedImages = allProductImages.filter(
    (image) =>
      !image.variants?.some((imageVariant) => imageVariant.id === variant.id)
  )

  const [selection, setSelection] = useState<Record<string, true>>({})
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const form = useForm<MediaSchemaType>({
    defaultValues: {
      image_ids: allVariantImages.map((image) => image.id!),
      thumbnail: variant.thumbnail,
    },
    resolver: zodResolver(MediaSchema),
  })

  const formImageIds = form.watch("image_ids")
  const availableImages = unassociatedImages.filter(
    (image) => !formImageIds.includes(image.id!)
  )

  const { mutateAsync: updateVariant } = useUpdateProductVariant(
    variant.product_id!,
    variant.id!
  )

  const { mutateAsync, isPending } = useBatchVariantImages(
    variant.product_id!,
    variant.id!
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    const currentVariantImageIds = allVariantImages.map((image) => image.id!)
    const newVariantImageIds = data.image_ids

    const imagesToAdd = newVariantImageIds.filter(
      (id) => !currentVariantImageIds.includes(id)
    )
    const imagesToRemove = currentVariantImageIds.filter(
      (id) => !newVariantImageIds.includes(id)
    )

    if (data.thumbnail !== variant.thumbnail) {
      let thumbnail = data.thumbnail
      if (
        thumbnail &&
        ![...currentVariantImageIds, ...newVariantImageIds].includes(thumbnail)
      ) {
        thumbnail = null
      }
      updateVariant({
        thumbnail: data.thumbnail,
      }).catch((error) => {
        toast.error(error.message)
      })
    }

    // Update variant images
    await mutateAsync(
      {
        add: imagesToAdd,
        remove: imagesToRemove,
      },
      {
        onSuccess: () => {
          toast.success(t("products.media.successToast"))
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  const handleAddImageToVariant = (imageId: string) => {
    const currentImageIds = form.getValues("image_ids")
    form.setValue("image_ids", [...currentImageIds, imageId], {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const handleCheckedChange = useCallback(
    (id: string) => {
      return (val: boolean) => {
        if (!val) {
          const { [id]: _, ...rest } = selection
          setSelection(rest)
        } else {
          setSelection((prev) => ({ ...prev, [id]: true }))
        }
      }
    },
    [selection]
  )

  const handlePromoteToThumbnail = () => {
    const ids = Object.keys(selection)

    if (!ids.length) {
      return
    }

    const selectedImage = allProductImages.find((image) => image.id === ids[0])
    if (selectedImage) {
      form.setValue("thumbnail", selectedImage.url, {
        shouldDirty: selectedImage.url !== variant.thumbnail,
        shouldTouch: selectedImage.url !== variant.thumbnail,
      })
    }
  }

  const handleRemoveSelectedImages = () => {
    const selectedIds = Object.keys(selection)
    if (selectedIds.length === 0) {
      return
    }

    const currentImageIds = form.getValues("image_ids")
    const newImageIds = currentImageIds.filter(
      (id) => !selectedIds.includes(id)
    )
    form.setValue("image_ids", newImageIds, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setSelection({})
  }

  const selectedImageThumbnail = form.watch("thumbnail")

  const isSelectedImageThumbnail =
    variant.thumbnail &&
    Object.keys(selection).length === 1 &&
    selectedImageThumbnail ===
      variant.images?.find((image) => image.id === Object.keys(selection)[0])
        ?.url

  return (
    <RouteFocusModal.Form blockSearchParams form={form}>
      <KeyboundForm
        className="flex size-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-col overflow-hidden">
          <div className="relative flex size-full">
            <div className="bg-ui-bg-subtle flex-1 overflow-auto">
              <div className="flex items-center justify-between p-4 lg:hidden">
                <h3 className="text-sm font-medium">
                  {t("products.media.variantImages")}
                </h3>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {t("products.media.showAvailableImages")}
                </Button>
              </div>
              <div className="grid h-fit auto-rows-auto grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6 lg:p-6">
                {allProductImages
                  .filter((image) => formImageIds.includes(image.id!))
                  .map((image) => (
                    <MediaGridItem
                      key={image.id}
                      media={image}
                      checked={!!selection[image.id!]}
                      onCheckedChange={handleCheckedChange(image.id!)}
                      isThumbnail={image.url === form.watch("thumbnail")}
                    />
                  ))}
              </div>
            </div>

            {/* Desktop sidebar - always visible */}
            <div className="border-ui-border-base bg-ui-bg-base hidden w-80 border-l lg:block">
              <div className="border-ui-border-base border-b p-4">
                <div>
                  <h3 className="ui-fg-base ">
                    {t("products.media.availableImages")}
                  </h3>
                  <p className="text-ui-fg-muted mt-1 text-sm">
                    {t("products.media.selectToAdd")}
                  </p>
                </div>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-auto">
                <div className="grid grid-cols-2 gap-4 p-4">
                  {availableImages.map((image) => (
                    <UnassociatedImageItem
                      key={image.id}
                      media={image}
                      onAdd={() => handleAddImageToVariant(image.id!)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile sidebar - overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <div
                  className="bg-ui-bg-base border-ui-border-base absolute right-0 top-0 h-full w-80 border-l"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="border-ui-border-base border-b p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="ui-fg-base text-sm font-medium">
                          {t("products.media.availableImages")}
                        </h3>
                        <p className="text-ui-fg-muted mt-1 pr-2 text-xs">
                          {t("products.media.selectToAdd")}
                        </p>
                      </div>
                      <Button
                        variant="transparent"
                        size="small"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-[calc(100vh-200px)] overflow-auto">
                    <div className="grid grid-cols-2 gap-4 p-4">
                      {availableImages.map((image) => (
                        <UnassociatedImageItem
                          key={image.id}
                          media={image}
                          onAdd={() => handleAddImageToVariant(image.id!)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </RouteFocusModal.Body>
        <CommandBar open={Object.keys(selection).length > 0}>
          <CommandBar.Bar>
            <CommandBar.Value>
              {t("general.countSelected", {
                count: Object.keys(selection).length,
              })}
            </CommandBar.Value>
            <CommandBar.Seperator />
            {Object.keys(selection).length === 1 &&
              !isSelectedImageThumbnail && (
                <Fragment>
                  <CommandBar.Command
                    action={handlePromoteToThumbnail}
                    label={t("products.media.makeThumbnail")}
                    shortcut="t"
                  />
                  <CommandBar.Seperator />
                </Fragment>
              )}
            <CommandBar.Command
              action={handleRemoveSelectedImages}
              label={t("products.media.removeSelected")}
              shortcut="r"
            />
          </CommandBar.Bar>
        </CommandBar>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

/* ******************* * MEDIA VIEW ******************* */

interface MediaView {
  id: string
  url: string
}

interface MediaGridItemProps {
  media: MediaView
  checked: boolean
  onCheckedChange: (value: boolean) => void
  isThumbnail: boolean
}

const MediaGridItem = ({
  media,
  checked,
  onCheckedChange,
  isThumbnail,
}: MediaGridItemProps) => {
  const handleToggle = useCallback(
    (value: boolean) => {
      onCheckedChange(value)
    },
    [onCheckedChange]
  )

  const { t } = useTranslation()

  return (
    <div
      className={clx(
        "shadow-elevation-card-rest hover:shadow-elevation-card-hover focus-visible:shadow-borders-focus bg-ui-bg-subtle-hover group relative aspect-square h-auto max-w-full overflow-hidden rounded-lg outline-none"
      )}
    >
      {isThumbnail && (
        <div className="absolute left-2 top-2">
          <Tooltip content={t("products.media.thumbnailTooltip")}>
            <ThumbnailBadge />
          </Tooltip>
        </div>
      )}
      <div
        className={clx("transition-fg absolute right-2 top-2 opacity-0", {
          "group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100":
            !checked,
          "opacity-100": checked,
        })}
      >
        <Checkbox
          onClick={(e) => {
            e.stopPropagation()
          }}
          checked={checked}
          onCheckedChange={handleToggle}
        />
      </div>
      <img src={media.url} className="size-full object-cover object-center" />
    </div>
  )
}

interface UnassociatedImageItemProps {
  media: MediaView
  onAdd: () => void
}

const UnassociatedImageItem = ({
  media,
  onAdd,
}: UnassociatedImageItemProps) => {
  return (
    <div
      className={clx(
        "shadow-elevation-card-rest hover:shadow-elevation-card-hover focus-visible:shadow-borders-focus bg-ui-bg-subtle-hover group relative aspect-square h-auto max-w-full cursor-pointer overflow-hidden rounded-lg outline-none"
      )}
      onClick={onAdd}
    >
      <div
        className={clx(
          "transition-fg absolute inset-0 flex items-center justify-center bg-black/30 opacity-0",
          {
            "group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100":
              true,
          }
        )}
      >
        <div className="bg-ui-bg-base border-ui-border-base flex h-12 w-12 items-center justify-center rounded-full border shadow-lg">
          <Plus />
        </div>
      </div>
      <img src={media.url} className="size-full object-cover object-center" />
    </div>
  )
}
