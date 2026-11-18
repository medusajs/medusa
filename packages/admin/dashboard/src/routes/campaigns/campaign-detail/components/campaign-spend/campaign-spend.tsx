import { CurrencyDollar } from "@medusajs/icons"
import { AdminCampaign } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"

type CampaignSpendProps = {
  campaign: AdminCampaign
}

export const CampaignSpend = ({ campaign }: CampaignSpendProps) => {
  const { t } = useTranslation()

  return (
    <Container className="flex flex-col gap-y-4 px-6 py-4">
      <div className="mb-2 grid grid-cols-[28px_1fr] items-center gap-x-3">
        <div className="flex size-7 items-center justify-center rounded-md bg-ui-bg-base shadow-borders-base">
          <div className="flex size-6 items-center justify-center rounded-[4px] bg-ui-bg-component">
            <CurrencyDollar className="text-ui-fg-subtle" />
          </div>
        </div>

        <Heading level="h2">
          {campaign.budget?.type === "use_by_attribute"
            ? t("campaigns.fields.totalUsedByAttribute")
            : campaign.budget?.type === "spend"
              ? t("campaigns.fields.total_spend")
              : t("campaigns.fields.total_used")}
        </Heading>
      </div>

      <div>
        <Text
          className="border-l-4 border-ui-border-strong pl-3 text-ui-fg-subtle"
          size="small"
          leading="compact"
        >
          <Trans
            i18nKey="campaigns.totalSpend"
            values={{
              amount: campaign?.budget?.used || 0,
              currency:
                campaign?.budget?.type === "spend"
                  ? campaign?.budget?.currency_code
                  : "",
            }}
            components={[
              <span
                key="amount"
                className="txt-compact-medium-plus text-lg text-ui-fg-base"
              />,
              <span
                key="currency"
                className="txt-compact-medium-plus text-lg text-ui-fg-base"
              />,
            ]}
          />
        </Text>
      </div>
    </Container>
  )
}
