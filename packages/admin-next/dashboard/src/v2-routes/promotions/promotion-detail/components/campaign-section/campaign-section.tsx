import { PencilSquare } from "@medusajs/icons"
import { CampaignDTO } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { format } from "date-fns"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"

function formatDate(date?: string | Date) {
  if (!date) {
    return "-"
  }

  return format(new Date(date), "dd MMM yyyy")
}

const CampaignDetailSection = ({ campaign }: { campaign: CampaignDTO }) => {
  const { t } = useTranslation()

  return (
    <Fragment>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("campaigns.fields.name")}
        </Text>

        <div className="flex items-center gap-1">
          <Text size="small" leading="compact" className="text-pretty">
            {campaign?.name}
          </Text>
        </div>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("campaigns.fields.identifier")}
        </Text>

        <div className="flex items-center gap-1">
          <Text size="small" leading="compact" className="text-pretty">
            {campaign?.campaign_identifier}
          </Text>
        </div>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("campaigns.fields.start_date")}
        </Text>

        <div className="flex items-center gap-1">
          <Text size="small" leading="compact" className="text-pretty">
            {formatDate(campaign?.starts_at)}
          </Text>
        </div>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("campaigns.fields.end_date") || "-"}
        </Text>

        <div className="flex items-center gap-1">
          <Text size="small" leading="compact" className="text-pretty">
            {formatDate(campaign?.ends_at)}
          </Text>
        </div>
      </div>
    </Fragment>
  )
}

export const CampaignSection = ({ campaign }: { campaign: CampaignDTO }) => {
  const { t } = useTranslation()
  const { id } = useParams()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("promotions.fields.campaign")}</Heading>

        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "add-to-campaign",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>

      {campaign ? (
        <CampaignDetailSection campaign={campaign} />
      ) : (
        <NoRecords
          className="h-[180px] p-6 text-center"
          title="Not part of a campaign"
          message="Add this promotion to an existing campaign"
          action={{
            to: `/promotions/${id}/add-to-campaign`,
            label: "Add to Campaign",
          }}
          buttonVariant="transparentIconLeft"
        />
      )}
    </Container>
  )
}
