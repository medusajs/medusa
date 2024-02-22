import {
  ArrowDownTray,
  ChevronLeftMini,
  ChevronRightMini,
  ThumbnailBadge,
  Trash,
  XMarkMini,
} from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { Button, IconButton, Kbd, Tooltip } from "@medusajs/ui"
import * as Dialog from "@radix-ui/react-dialog"
import { Variants, motion } from "framer-motion"
import { useAdminProduct } from "medusa-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useParams, useSearchParams } from "react-router-dom"

export const ProductGallery = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])

  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const { product, isLoading, isError, error } = useAdminProduct(id!)

  const { t } = useTranslation()

  const media = useMemo(() => {
    return product ? getMedia(product) : []
  }, [product])

  const currentId = searchParams.get("img") ?? media[0]?.id
  const currentIndex = media.findIndex((m) => m.id === currentId)

  const paginate = useCallback(
    (newDirection: number) => {
      const adjustment = newDirection > 0 ? 1 : -1
      const newIndex = (currentIndex + adjustment + media.length) % media.length
      setSearchParams({ img: media[newIndex].id }, { replace: true })
    },
    [currentIndex, media, setSearchParams]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        paginate(1)
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        paginate(-1)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [paginate])

  const indicatorVariants: Variants = {
    active: {
      width: "16px",
      backgroundColor: "var(--fg-subtle)",
    },
    inactive: {
      width: "6px",
      backgroundColor: "var(--fg-muted)",
    },
  }

  if (isError) {
    throw error
  }

  return (
    <Dialog.Root modal open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Content className="bg-ui-bg-subtle dark fixed inset-0 grid-rows-[32px_1fr_6px] pb-16 pt-4 outline-none">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-x-2">
              <Dialog.Close asChild>
                <IconButton size="small" variant="transparent">
                  <XMarkMini className="text-ui-fg-subtle" />
                </IconButton>
              </Dialog.Close>
              <Kbd>esc</Kbd>
            </div>
            <div className="flex items-center gap-x-2">
              <Tooltip
                content={t("actions.delete")}
                side="bottom"
                className="dark"
              >
                <IconButton
                  disabled={isLoading}
                  aria-label="Delete image"
                  size="small"
                >
                  <Trash aria-hidden className="text-ui-fg-subtle" />
                </IconButton>
              </Tooltip>
              <Tooltip
                content={t("actions.download")}
                side="bottom"
                className="dark"
              >
                <IconButton
                  disabled={isLoading}
                  aria-label="Download image"
                  size="small"
                  asChild
                >
                  <Link to={media[currentIndex].url} download>
                    <ArrowDownTray aria-hidden className="text-ui-fg-subtle" />
                  </Link>
                </IconButton>
              </Tooltip>
              <Button
                disabled={isLoading}
                size="small"
                variant="secondary"
                className="text-ui-fg-subtle"
              >
                {t("products.editMedia")}
              </Button>
            </div>
          </div>
          <main className="relative flex h-full w-screen items-center justify-center py-16">
            <div className="absolute h-full max-w-[100vw] rounded-2xl py-16">
              <div className="relative h-full w-fit">
                {media[currentIndex].isThumbnail && (
                  <div className="absolute left-3 top-3">
                    <Tooltip content={t("fields.thumbnail")} className="dark">
                      <ThumbnailBadge />
                    </Tooltip>
                  </div>
                )}
                <img
                  src={media[currentIndex].url}
                  alt=""
                  className="object-fit h-full rounded-2xl"
                />
              </div>
            </div>

            <IconButton
              onClick={() => paginate(-1)}
              className="absolute left-4 top-1/2 z-[2] rounded-full"
            >
              <ChevronLeftMini className="text-ui-fg-subtle" />
            </IconButton>
            <IconButton
              onClick={() => paginate(1)}
              className="absolute right-4 top-1/2 z-[2] rounded-full"
            >
              <ChevronRightMini className="text-ui-fg-subtle" />
            </IconButton>
          </main>
          <div className="flex items-center justify-center gap-1">
            {media.map((img, index) => (
              <motion.div
                key={img.id}
                className="h-1.5 rounded-full"
                variants={indicatorVariants}
                animate={index === currentIndex ? "active" : "inactive"}
              />
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

type Media = {
  id: string
  url: string
  isThumbnail: boolean
}

const getMedia = (product: Product) => {
  const { images = [], thumbnail } = product

  const media: Media[] = images.map((image) => ({
    id: image.id,
    url: image.url,
    isThumbnail: image.url === thumbnail,
  }))

  if (thumbnail && !media.some((mediaItem) => mediaItem.url === thumbnail)) {
    media.unshift({
      id: "img_thumbnail",
      url: thumbnail,
      isThumbnail: true,
    })
  }

  return media
}
