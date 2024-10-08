import { StackPerspective, ThumbnailBadge, Trash, XMark } from "@medusajs/icons"
import { IconButton, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../../../components/common/action-menu"
import { UploadMediaFormItem } from "../../../../../common/components/upload-media-form-item"
import { ProductCreateSchemaType } from "../../../../types"

type ProductCreateMediaSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateMediaSection = ({
  form,
}: ProductCreateMediaSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    name: "media",
    control: form.control,
    keyName: "field_id",
  })

  const getOnDelete = (index: number) => {
    return () => {
      remove(index)
    }
  }

  const getMakeThumbnail = (index: number) => {
    return () => {
      const newFields = fields.map((field, i) => {
        return {
          ...field,
          isThumbnail: i === index,
        }
      })

      form.setValue("media", newFields, {
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }

  const getItemHandlers = (index: number) => {
    return {
      onDelete: getOnDelete(index),
      onMakeThumbnail: getMakeThumbnail(index),
    }
  }

  return (
    <div id="media" className="flex flex-col gap-y-2">
      <UploadMediaFormItem form={form} append={append} showHint={false} />
      <ul className="flex flex-col gap-y-2">
        {fields.map((field, index) => {
          const { onDelete, onMakeThumbnail } = getItemHandlers(index)

          return (
            <MediaItem
              key={field.id}
              field={field}
              onDelete={onDelete}
              onMakeThumbnail={onMakeThumbnail}
            />
          )
        })}
      </ul>
    </div>
  )
}

type MediaField = {
  isThumbnail: boolean
  url: string
  id?: string | undefined
  file?: File
  field_id: string
}

type MediaItemProps = {
  field: MediaField
  onDelete: () => void
  onMakeThumbnail: () => void
}

const MediaItem = ({ field, onDelete, onMakeThumbnail }: MediaItemProps) => {
  const { t } = useTranslation()

  if (!field.file) {
    return null
  }

  return (
    <li className="bg-ui-bg-component shadow-elevation-card-rest flex items-center justify-between rounded-lg px-3 py-2">
      <div className="flex items-center gap-x-3">
        <div className="bg-ui-bg-base h-10 w-[30px] overflow-hidden rounded-md">
          <ThumbnailPreview file={field.file} />
        </div>
        <div className="flex flex-col">
          <Text size="small" leading="compact">
            {field.file.name}
          </Text>
          <div className="flex items-center gap-x-1">
            {field.isThumbnail && <ThumbnailBadge />}
            <Text size="xsmall" leading="compact" className="text-ui-fg-subtle">
              {formatFileSize(field.file.size)}
            </Text>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("products.media.makeThumbnail"),
                  icon: <StackPerspective />,
                  onClick: onMakeThumbnail,
                },
              ],
            },
            {
              actions: [
                {
                  icon: <Trash />,
                  label: t("actions.delete"),
                  onClick: onDelete,
                },
              ],
            },
          ]}
        />
        <IconButton
          type="button"
          size="small"
          variant="transparent"
          onClick={onDelete}
        >
          <XMark />
        </IconButton>
      </div>
    </li>
  )
}

const ThumbnailPreview = ({ file }: { file?: File | null }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setThumbnailUrl(objectUrl)

      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  if (!thumbnailUrl) {
    return null
  }

  return (
    <img
      src={thumbnailUrl}
      alt=""
      className="size-full object-cover object-center"
    />
  )
}

function formatFileSize(bytes: number, decimalPlaces: number = 2): string {
  if (bytes === 0) {
    return "0 Bytes"
  }

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimalPlaces)) + " " + sizes[i]
  )
}
