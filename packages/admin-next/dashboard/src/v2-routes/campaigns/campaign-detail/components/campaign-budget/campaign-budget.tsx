import { ChartPie, PencilSquare } from "@medusajs/icons"
import { CampaignResponse } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type CampaignBudgetProps = {
  campaign: CampaignResponse
}

export const CampaignBudget = ({ campaign }: CampaignBudgetProps) => {
  const { t } = useTranslation()

  return (
    <Container className="flex flex-col gap-y-4 px-6 py-4">
      <div className="flex justify-between">
        <div className="flex-grow">
          <div className="float-left bg-ui-bg-base shadow-borders-base flex size-7 items-center justify-center rounded-md">
            <div className="bg-ui-bg-component flex size-6 items-center justify-center rounded-[4px]">
              <ChartPie className="text-ui-fg-subtle" />
            </div>
          </div>

          <Heading
            className="ml-10 mt-[1.5px] font-normal text-ui-fg-subtle"
            level="h3"
          >
            {t("campaigns.fields.budget_limit")}
          </Heading>
        </div>

        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: `edit-budget`,
                },
              ],
            },
          ]}
        />
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
              amount: campaign?.budget?.limit || 0,
              currency:
                campaign?.budget?.type === "spend" ? campaign.currency : "",
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
