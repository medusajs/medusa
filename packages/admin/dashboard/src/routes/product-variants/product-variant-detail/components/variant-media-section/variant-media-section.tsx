import { Container, Heading, Text, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { HttpTypes } from "@medusajs/types"
import { PencilSquare, ThumbnailBadge } from "@medusajs/icons"

import { ActionMenu } from "../../../../../components/common/action-menu"

type VariantMediaSectionProps = {
  variant: Omit<HttpTypes.AdminProductVariant, "images"> & {
    images?: (HttpTypes.AdminProductImage & {
      variants?: HttpTypes.AdminProductVariant[]
    })[]
  }
}

export const VariantMediaSection = ({ variant }: VariantMediaSectionProps) => {
  const { t } = useTranslation()

  // show only variant scoped images
  const media = (variant.images || []).filter((image) =>
    image.variants?.some((imageVariant) => imageVariant.id === variant.id)
  )

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.media.label")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.editImages"),
                  to: "media",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      {media.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4 px-6 py-4">
          {media.map((i) => {
            return (
              <div
                className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full overflow-hidden rounded-[8px]"
                key={i.id}
              >
                {i.url === variant.thumbnail && (
                  <div className="absolute left-2 top-2">
                    <Tooltip content={t("products.media.thumbnailTooltip")}>
                      <ThumbnailBadge />
                    </Tooltip>
                  </div>
                )}
                <img src={i.url} className="size-full object-cover" />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-4 pb-8 pt-6">
          <div className="flex flex-col items-center">
            <Text
              size="small"
              leading="compact"
              weight="plus"
              className="text-ui-fg-subtle"
            >
              {t("products.media.emptyState.header")}
            </Text>
            <Text size="small" className="text-ui-fg-muted">
              {t("products.media.emptyState.description")}
            </Text>
          </div>
        </div>
      )}
    </Container>
  )
}
