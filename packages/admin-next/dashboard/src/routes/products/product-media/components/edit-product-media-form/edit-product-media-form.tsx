import { zodResolver } from "@hookform/resolvers/zod"
import { Button, CommandBar } from "@medusajs/ui"
import { Fragment, useCallback, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Link } from "react-router-dom"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdateProduct } from "../../../../../hooks/api/products"
import { sdk } from "../../../../../lib/client"
import {
  EditProductMediaSchema,
  MediaSchema,
} from "../../../product-create/constants"
import { HttpTypes } from "@medusajs/types"
import { MediaGrid } from "../../../common/components/media-grid-view"
import { UploadMediaFormItem } from "../../../common/components/upload-media-form-item"
import { EditProductMediaSchemaType } from "../../../product-create/types"

type ProductMediaViewProps = {
  product: HttpTypes.AdminProduct
}

type Media = z.infer<typeof MediaSchema>

export const EditProductMediaForm = ({ product }: ProductMediaViewProps) => {
  const [selection, setSelection] = useState<Record<string, true>>({})
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<EditProductMediaSchemaType>({
    defaultValues: {
      media: getDefaultValues(product.images, product.thumbnail),
    },
    resolver: zodResolver(EditProductMediaSchema),
  })

  const { fields, append, remove, update } = useFieldArray({
    name: "media",
    control: form.control,
    keyName: "field_id",
  })

  const { mutateAsync, isPending } = useUpdateProduct(product.id!)

  const handleSubmit = form.handleSubmit(async ({ media }) => {
    const filesToUpload = media
      .map((m, i) => ({ file: m.file, index: i }))
      .filter((m) => !!m.file)

    let uploaded: HttpTypes.AdminFile[] = []

    if (filesToUpload.length) {
      const { files: uploads } = await sdk.admin.uploads
        .create({ files: filesToUpload.map((m) => m.file) })
        .catch(() => {
          form.setError("media", {
            type: "invalid_file",
            message: t("products.media.failedToUpload"),
          })
          return { files: [] }
        })
      uploaded = uploads
    }

    const withUpdatedUrls = media.map((entry, i) => {
      const toUploadIndex = filesToUpload.findIndex((m) => m.index === i)
      if (toUploadIndex > -1) {
        return { ...entry, url: uploaded[toUploadIndex]?.url }
      }
      return entry
    })
    const thumbnail = withUpdatedUrls.find((m) => m.isThumbnail)?.url

    await mutateAsync(
      {
        images: withUpdatedUrls.map((file) => ({ url: file.url })),
        // Set thumbnail to empty string if no thumbnail is selected, as the API does not accept null
        thumbnail: thumbnail || "",
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

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

  const handleDelete = () => {
    const ids = Object.keys(selection)
    const indices = ids.map((id) => fields.findIndex((m) => m.id === id))

    remove(indices)
    setSelection({})
  }

  const handlePromoteToThumbnail = () => {
    const ids = Object.keys(selection)

    if (!ids.length) {
      return
    }

    const currentThumbnailIndex = fields.findIndex((m) => m.isThumbnail)

    if (currentThumbnailIndex > -1) {
      update(currentThumbnailIndex, {
        ...fields[currentThumbnailIndex],
        isThumbnail: false,
      })
    }

    const index = fields.findIndex((m) => m.id === ids[0])

    update(index, {
      ...fields[index],
      isThumbnail: true,
    })

    setSelection({})
  }

  const selectionCount = Object.keys(selection).length

  return (
    <RouteFocusModal.Form blockSearch form={form}>
      <form
        className="flex size-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button variant="secondary" size="small" asChild>
              <Link to={{ pathname: ".", search: undefined }}>
                {t("products.media.galleryLabel")}
              </Link>
            </Button>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col overflow-hidden">
          <div className="flex size-full flex-col-reverse lg:grid lg:grid-cols-[1fr_560px]">
            <MediaGrid
              media={fields}
              onCheckedChange={handleCheckedChange}
              selection={selection}
            />
            <div className="bg-ui-bg-base border-b px-6 py-4 lg:border-b-0 lg:border-l">
              <UploadMediaFormItem form={form} append={append} />
            </div>
          </div>
        </RouteFocusModal.Body>
        <CommandBar open={!!selectionCount}>
          <CommandBar.Bar>
            <CommandBar.Value>
              {t("general.countSelected", {
                count: selectionCount,
              })}
            </CommandBar.Value>
            <CommandBar.Seperator />
            {selectionCount === 1 && (
              <Fragment>
                <CommandBar.Command
                  action={handlePromoteToThumbnail}
                  label={"Make thumbnail"}
                  shortcut="t"
                />
                <CommandBar.Seperator />
              </Fragment>
            )}
            <CommandBar.Command
              action={handleDelete}
              label={t("actions.delete")}
              shortcut="d"
            />
          </CommandBar.Bar>
        </CommandBar>
      </form>
    </RouteFocusModal.Form>
  )
}

const getDefaultValues = (
  images: HttpTypes.AdminProductImage[] | undefined,
  thumbnail: string | undefined
) => {
  const media: Media[] =
    images?.map((image) => ({
      id: image.id!,
      url: image.url!,
      isThumbnail: image.url === thumbnail,
      file: null,
    })) || []

  if (thumbnail && !media.some((mediaItem) => mediaItem.url === thumbnail)) {
    const id = Math.random().toString(36).substring(7)

    media.unshift({
      id: id,
      url: thumbnail,
      isThumbnail: true,
      file: null,
    })
  }

  return media
}
