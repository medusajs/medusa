import { Channels, PencilSquare } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { Container, Heading, Text, Tooltip } from "@medusajs/ui"
import { useAdminSalesChannels } from "medusa-react"
import { Trans, useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type ProductSalesChannelSectionProps = {
  product: Product
}

export const ProductSalesChannelSection = ({
  product,
}: ProductSalesChannelSectionProps) => {
  const { count } = useAdminSalesChannels()
  const { t } = useTranslation()

  const availableInSalesChannels =
    product.sales_channels?.map((sc) => ({
      id: sc.id,
      name: sc.name,
    })) ?? []

  const displayChannels = availableInSalesChannels.slice(0, 3)
  const remainderChannels = availableInSalesChannels.slice(3)

  return (
    <div>
      <Container className="flex flex-col gap-y-4 px-6 py-4">
        <div className="flex items-center justify-between">
          <Heading level="h2">{t("fields.sales_channels")}</Heading>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("general.edit"),
                    icon: <PencilSquare />,
                    to: "sales-channels",
                  },
                ],
              },
            ]}
          />
        </div>
        <div className="flex items-center gap-x-3">
          <div className="bg-ui-bg-base shadow-borders-base flex size-7 items-center justify-center rounded-md">
            <div className="bg-ui-bg-component flex size-6 items-center justify-center rounded-[4px]">
              <Channels className="text-ui-fg-subtle" />
            </div>
          </div>
          <span className="txt-compact-small text-ui-fg-subtle">
            {displayChannels.map((sc) => sc.name).join(", ")}
            {remainderChannels?.length > 0 && (
              <Tooltip
                content={
                  <ul>
                    {remainderChannels.map((rc) => (
                      <li key={rc.id}>{rc.name}</li>
                    ))}
                  </ul>
                }
              >
                <span>
                  {" "}
                  {t("general.plusCountMore", {
                    count: remainderChannels.length,
                  })}
                </span>
              </Tooltip>
            )}
          </span>
        </div>
        <div>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            <Trans
              i18nKey="products.availableInSalesChannels"
              values={{
                x: availableInSalesChannels.length,
                y: count ?? 0,
              }}
              components={[
                <span key="x" className="text-ui-fg-base" />,
                <span key="y" className="text-ui-fg-base" />,
              ]}
            />
          </Text>
        </div>
      </Container>
    </div>
  )
}
