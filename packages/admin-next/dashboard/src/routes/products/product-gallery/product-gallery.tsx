import { ArrowDownTray, Trash, XMarkMini } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { Button, IconButton, Kbd, Tooltip } from "@medusajs/ui"
import * as Dialog from "@radix-ui/react-dialog"
import { Variants, motion } from "framer-motion"
import { useAdminProduct } from "medusa-react"
import { useCallback, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"

export const ProductGallery = () => {
  const [open, onOpenChange] = useRouteModalState()

  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const { product, isLoading, isError, error } = useAdminProduct(id!)

  const { t } = useTranslation()

  const media = useMemo(() => {
    return product ? getMedia(product) : []
  }, [product])

  const currentId = searchParams.get("img")

  const getSelectedMedia = (media: Media[], currentId: string | null) => {
    if (currentId) {
      const selectedMedia = media.find((m) => m.id === currentId)
      if (selectedMedia) {
        return selectedMedia
      }

      setSearchParams({ img: media[0].id }, { replace: true })
    }

    // If currentId is null or no media exists with currentId, return the first media
    return media[0]
  }

  const getSurroundingMedia = (media: Media[], selectedMedia: Media) => {
    const index = media.indexOf(selectedMedia)
    const length = media.length

    const leftImages = [
      media[(index - 2 + length) % length],
      media[(index - 1 + length) % length],
    ]

    const rightImages = [
      media[(index + 1) % length],
      media[(index + 2) % length],
    ]

    return { leftImages, rightImages }
  }

  const curr = getSelectedMedia(media, currentId)
  const surrounding = getSurroundingMedia(media, curr)

  const handleNext = useCallback(() => {
    const index = media.indexOf(curr)
    const next = media[(index + 1) % media.length]
    setSearchParams({ img: next.id })
  }, [curr, media, setSearchParams])

  const handlePrev = useCallback(() => {
    const index = media.indexOf(curr)
    const prev = media[(index - 1 + media.length) % media.length]
    setSearchParams({ img: prev.id })
  }, [curr, media, setSearchParams])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        handleNext()
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        handlePrev()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleNext, handlePrev])

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
    <Dialog.Root modal open={open} onOpenChange={onOpenChange}>
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
                  <Link to={curr.url} download>
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
          <main className="h-full py-16">
            <div className="flex h-full items-center justify-center gap-16 overflow-hidden px-4">
              {surrounding.leftImages.map((img) => (
                <div
                  key={img.id}
                  className={`flex h-full flex-shrink-0 items-center opacity-40`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-4/5 rounded-2xl object-cover"
                  />
                </div>
              ))}
              <div className="h-full flex-shrink-0">
                <img
                  src={curr.url}
                  alt=""
                  className="h-full rounded-2xl object-cover object-center"
                />
              </div>
              {surrounding.rightImages.map((img) => (
                <div
                  key={img.id}
                  className={`flex h-full flex-shrink-0 items-center opacity-40`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-4/5 rounded-2xl object-cover"
                  />
                </div>
              ))}
            </div>
          </main>
          <div className="flex items-center justify-center gap-1">
            {media.map((img) => (
              <motion.div
                key={img.id}
                className="h-1.5 rounded-full"
                variants={indicatorVariants}
                animate={img.id === curr.id ? "active" : "inactive"}
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
