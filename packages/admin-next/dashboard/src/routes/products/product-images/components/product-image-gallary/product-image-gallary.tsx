import { MinusMini, PlusMini, ThumbnailBadge, Trash } from "@medusajs/icons"
import { Image } from "@medusajs/medusa"
import { Button, DropdownMenu, IconButton, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { RouteFocusModal } from "../../../../../components/route-modal"

type ProductImageGalleryProps = {
  images: Image[] | null
  thumbnail: string | null
}

export const ProductImageGallery = ({
  images,
  thumbnail,
}: ProductImageGalleryProps) => {
  const { t } = useTranslation()

  const media = getMedia(images, thumbnail)

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <RouteFocusModal.Header>
        <div className="flex items-center justify-end gap-x-2">
          <IconButton size="small">
            <Trash />
          </IconButton>
          <Button variant="secondary" size="small" asChild>
            <Link to="edit">{t("actions.edit")}</Link>
          </Button>
        </div>
      </RouteFocusModal.Header>
      <RouteFocusModal.Body className="flex flex-col overflow-hidden">
        <Canvas media={media} />
        <Preview media={media} />
      </RouteFocusModal.Body>
    </div>
  )
}

const Canvas = ({ media }: { media: Media[] }) => {
  return (
    <div className="bg-ui-bg-subtle relative size-full overflow-hidden">
      <div className="flex size-full items-center justify-center py-6">
        <div className="shadow-elevation-card-rest relative h-full w-fit overflow-hidden rounded-xl">
          {media[0].isThumbnail && (
            <div className="absolute left-2 top-2">
              <Tooltip content="Thumbnail">
                <ThumbnailBadge />
              </Tooltip>
            </div>
          )}
          <img
            src={media[0].url}
            alt=""
            className="object-fit size-full rounded-xl object-contain"
          />
        </div>
      </div>
      <div className="bg-ui-bg-base shadow-borders-base absolute bottom-4 right-4 flex h-fit items-center rounded-md">
        <IconButton
          size="small"
          className="rounded-r-0 rounded-none rounded-l-md"
        >
          <MinusMini />
        </IconButton>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary" size="small" className="rounded-none">
              128%
            </Button>
          </DropdownMenu.Trigger>
        </DropdownMenu>
        <IconButton
          size="small"
          className="rounded-none rounded-l-none rounded-r-md"
        >
          <PlusMini />
        </IconButton>
      </div>
    </div>
  )
}

const Preview = ({ media }: { media: Media[] }) => {
  if (!media.length) {
    return null
  }

  return (
    <div className="flex shrink-0 items-center justify-center border-t p-3">
      <div className="flex items-center gap-x-2">
        {media.map((m) => {
          return (
            <div key={m.id} className="size-7 overflow-hidden rounded-[4px]">
              <img
                src={m.url}
                alt=""
                className="size-full object-cover object-center"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

type Media = {
  id: string
  url: string
  isThumbnail: boolean
}

const getMedia = (images: Image[] | null, thumbnail: string | null) => {
  const media: Media[] =
    images?.map((image) => ({
      id: image.id,
      url: image.url,
      isThumbnail: image.url === thumbnail,
    })) || []

  if (thumbnail && !media.some((mediaItem) => mediaItem.url === thumbnail)) {
    media.unshift({
      id: "img_thumbnail",
      url: thumbnail,
      isThumbnail: true,
    })
  }

  return media
}
