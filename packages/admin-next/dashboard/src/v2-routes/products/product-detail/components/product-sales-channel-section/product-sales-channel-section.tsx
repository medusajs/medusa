import { Channels, PencilSquare } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { Container, Heading, Text, Tooltip } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"

type ProductSalesChannelSectionProps = {
  product: Product
}

// TODO: The fetched sales channel doesn't contain all necessary info
export const ProductSalesChannelSection = ({
  product,
}: ProductSalesChannelSectionProps) => {
  const { count } = useSalesChannels()
  const { t } = useTranslation()

  const availableInSalesChannels =
    product.sales_channels?.map((sc) => ({
      id: sc.id,
      name: sc.name,
    })) ?? []

  const firstChannels = availableInSalesChannels.slice(0, 3)
  const restChannels = availableInSalesChannels.slice(3)

  return (
    <Container className="flex flex-col gap-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <Heading level="h2">{t("fields.sales_channels")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "sales-channels",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-[28px_1fr] items-center gap-x-3">
        <div className="bg-ui-bg-base shadow-borders-base flex size-7 items-center justify-center rounded-md">
          <div className="bg-ui-bg-component flex size-6 items-center justify-center rounded-[4px]">
            <Channels className="text-ui-fg-subtle" />
          </div>
        </div>
        {availableInSalesChannels.length > 0 ? (
          <div className="flex items-center gap-x-1">
            <Text size="small" leading="compact">
              {firstChannels.map((sc) => sc.name).join(", ")}
            </Text>
            {restChannels.length > 0 && (
              <Tooltip
                content={
                  <ul>
                    {restChannels.map((sc) => (
                      <li key={sc.id}>{sc.name}</li>
                    ))}
                  </ul>
                }
              >
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {`+${restChannels.length}`}
                </Text>
              </Tooltip>
            )}
          </div>
        ) : (
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {t("products.noSalesChannels")}
          </Text>
        )}
      </div>
      <div>
        <Text className="text-ui-fg-subtle" size="small" leading="compact">
          <Trans
            i18nKey="products.availableInSalesChannels"
            values={{
              x: availableInSalesChannels.length,
              y: count ?? 0,
            }}
            components={[
              <span
                key="x"
                className="text-ui-fg-base txt-compact-medium-plus"
              />,
              <span
                key="y"
                className="text-ui-fg-base txt-compact-medium-plus"
              />,
            ]}
          />
        </Text>
      </div>
    </Container>
  )
}
