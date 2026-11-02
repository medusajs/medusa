import { ChartPie, PencilSquare } from "@medusajs/icons"
import { AdminCampaign } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type CampaignBudgetProps = {
  campaign: AdminCampaign
}

export const CampaignBudget = ({ campaign }: CampaignBudgetProps) => {
  const { t } = useTranslation()

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
          <div className="flex size-7 items-center justify-center rounded-md bg-ui-bg-base shadow-borders-base">
            <div className="flex size-6 items-center justify-center rounded-[4px] bg-ui-bg-component">
              <ChartPie className="text-ui-fg-subtle" />
            </div>
          </div>

          <Heading level="h2">{getTranslation()}</Heading>
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
          className="border-l-4 border-ui-border-strong ps-3 text-ui-fg-subtle"
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
