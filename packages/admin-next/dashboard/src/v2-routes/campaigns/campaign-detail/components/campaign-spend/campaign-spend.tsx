import { CurrencyDollar } from "@medusajs/icons"
import { CampaignResponse } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"

type CampaignSpendProps = {
  campaign: CampaignResponse
}

export const CampaignSpend = ({ campaign }: CampaignSpendProps) => {
  const { t } = useTranslation()

  return (
    <Container className="flex flex-col gap-y-4 px-6 py-4">
      <div className="grid grid-cols-[28px_1fr] items-center gap-x-3 mb-2">
        <div className="bg-ui-bg-base shadow-borders-base flex size-7 items-center justify-center rounded-md">
          <div className="bg-ui-bg-component flex size-6 items-center justify-center rounded-[4px]">
            <CurrencyDollar className="text-ui-fg-subtle" />
          </div>
        </div>

        <Heading level="h3" className="font-normal text-ui-fg-subtle">
          {campaign.budget?.type === "spend"
            ? t("campaigns.fields.total_spend")
            : t("campaigns.fields.total_used")}
        </Heading>
      </div>

      <div>
        <Text
          className="text-ui-fg-subtle border-l-4 border-ui-border-strong pl-3"
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
                className="text-ui-fg-base txt-compact-medium-plus text-lg"
              />,
              <span
                key="currency"
                className="text-ui-fg-base txt-compact-medium-plus text-lg"
              />,
            ]}
          />
        </Text>
      </div>
    </Container>
  )
}
