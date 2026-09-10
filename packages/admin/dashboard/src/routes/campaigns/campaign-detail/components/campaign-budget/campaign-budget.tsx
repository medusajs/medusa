import { ChartPie, PencilSquare } from "@medusajs/icons"
import { AdminCampaign } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useCampaignPermissions } from "../../../../../hooks/use-resource-permissions"

type CampaignBudgetProps = {
  campaign: AdminCampaign
}

export const CampaignBudget = ({ campaign }: CampaignBudgetProps) => {
  const { t } = useTranslation()
  const { canUpdate } = useCampaignPermissions()

  const getTranslation = () => {
    const budget = campaign.budget

    if (budget?.type === "use_by_attribute") {
      if (budget?.attribute === "customer_id") {
        return t(`campaigns.budget.fields.totalUsedByAttributeCustomerId`)
      } else if (budget?.attribute === "customer_email") {
        return t(`campaigns.budget.fields.totalUsedByAttributeEmail`)
      }
      return t(`campaigns.budget.fields.totalUsedByAttribute`, {
        attribute: budget?.attribute,
      })
    }
    return t(`campaigns.fields.budget_limit`)
  }

  return (
    <Container className="flex flex-col gap-y-4 px-6 py-4">
      <div className="flex justify-between">
        <div className="mb-2 grid flex-grow grid-cols-[28px_1fr] items-center gap-x-3">
          <div className="bg-ui-bg-base shadow-borders-base flex size-7 items-center justify-center rounded-md">
            <div className="bg-ui-bg-component flex size-6 items-center justify-center rounded-[4px]">
              <ChartPie className="text-ui-fg-subtle" />
            </div>
          </div>

          <Heading level="h2">{getTranslation()}</Heading>
        </div>

        {canUpdate && (
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
        )}
      </div>

      <div>
        <Text
          className="text-ui-fg-subtle border-ui-border-strong border-l-4 ps-3"
          size="small"
          leading="compact"
        >
          <Trans
            i18nKey="campaigns.totalSpend"
            values={{
              amount: campaign?.budget?.limit || "no limit",
              currency:
                campaign?.budget?.type === "spend" && campaign?.budget.limit
                  ? campaign.budget?.currency_code
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
