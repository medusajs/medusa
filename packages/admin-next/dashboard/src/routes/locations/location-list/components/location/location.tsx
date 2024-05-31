import { Buildings, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, StatusBadge, Text, toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { BadgeListSummary } from "../../../../../components/common/badge-list-summary"
import { LinkButton } from "../../../../../components/common/link-button"
import { useDeleteStockLocation } from "../../../../../hooks/api/stock-locations"
import { getFormattedAddress } from "../../../../../lib/addresses"

type SalesChannelsProps = {
  salesChannels?: HttpTypes.AdminSalesChannel[] | null
}

function SalesChannels(props: SalesChannelsProps) {
  const { t } = useTranslation()
  const { salesChannels } = props

  return (
    <div className="flex flex-col px-6 py-4">
      <div className="flex items-center justify-between">
        <Text
          size="small"
          weight="plus"
          className="text-ui-fg-subtle flex-1"
          as="div"
        >
          {t(`location.fulfillmentSet.salesChannels`)}
        </Text>
        <div className="flex-1 text-left">
          {salesChannels?.length ? (
            <BadgeListSummary
              rounded
              inline
              n={3}
              list={salesChannels.map((s) => s.name)}
            />
          ) : (
            "-"
          )}
        </div>
      </div>
    </div>
  )
}

enum FulfillmentSetType {
  Delivery = "delivery",
  Pickup = "pickup",
}

type FulfillmentSetProps = {
  fulfillmentSet?: HttpTypes.AdminFulfillmentSet
  type: FulfillmentSetType
}

function FulfillmentSet(props: FulfillmentSetProps) {
  const { t } = useTranslation()
  const { fulfillmentSet, type } = props

  const fulfillmentSetExists = !!fulfillmentSet

  return (
    <div className="flex flex-col px-6 py-4">
      <div className="flex items-center justify-between">
        <Text
          size="small"
          weight="plus"
          className="text-ui-fg-subtle flex-1"
          as="div"
        >
          {t(`location.fulfillmentSet.${type}.title`)}
        </Text>
        <div className="flex-1 text-left">
          <StatusBadge color={fulfillmentSetExists ? "green" : "grey"}>
            {t(fulfillmentSetExists ? "statuses.enabled" : "statuses.disabled")}
          </StatusBadge>
        </div>
      </div>
    </div>
  )
}

type LocationProps = {
  location: HttpTypes.AdminStockLocation
}

function Location(props: LocationProps) {
  const { location } = props
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync: deleteLocation } = useDeleteStockLocation(location.id)

  const handleDelete = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("location.deleteLocation.confirm", {
        name: location.name,
      }),
      confirmText: t("actions.remove"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await deleteLocation(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("location.deleteLocation.success", {
            name: location.name,
          }),
          dismissLabel: t("general.close"),
        })
      },
      onError: (e) => {
        toast.error(t("general.error"), {
          description: e.message,
          dismissLabel: t("actions.close"),
        })
      },
    })
  }

  return (
    <Container className="flex flex-col divide-y p-0">
      <div className="px-6 py-4">
        <div className="flex flex-row items-center justify-between gap-x-4">
          <div className="shadow-borders-base flex size-7 items-center justify-center rounded-md">
            <div className="bg-ui-bg-field flex size-6 items-center justify-center rounded-[4px]">
              <Buildings className="text-ui-fg-subtle" />
            </div>
          </div>

          <div className="grow-1 flex flex-1 flex-col">
            <Text weight="plus">{location.name}</Text>
            <Text className="text-ui-fg-subtle txt-small">
              {getFormattedAddress({ address: location.address }).join(", ")}
            </Text>
          </div>

          <div className="flex grow-0 items-center gap-4">
            <ActionMenu
              groups={[
                {
                  actions: [
                    {
                      label: t("actions.edit"),
                      icon: <PencilSquare />,
                      to: `/settings/locations/${location.id}/edit`,
                    },
                    {
                      label: t("location.deleteLocation.label"),
                      icon: <Trash />,
                      onClick: handleDelete,
                    },
                  ],
                },
              ]}
            />
            <div className="bg-ui-border-strong h-[12px] w-[1px]" />
            <LinkButton to={`/settings/locations/${location.id}`}>
              {t("actions.viewDetails")}
            </LinkButton>
          </div>
        </div>
      </div>

      <SalesChannels salesChannels={location.sales_channels} />

      <FulfillmentSet
        type={FulfillmentSetType.Pickup}
        fulfillmentSet={location.fulfillment_sets.find(
          (f) => f.type === FulfillmentSetType.Pickup
        )}
      />
      <FulfillmentSet
        type={FulfillmentSetType.Delivery}
        fulfillmentSet={location.fulfillment_sets.find(
          (f) => f.type === FulfillmentSetType.Delivery
        )}
      />
    </Container>
  )
}

export default Location
