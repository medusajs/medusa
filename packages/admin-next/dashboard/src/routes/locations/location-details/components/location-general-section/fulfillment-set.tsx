import { CheckMini, PlusMini, XMarkMini } from "@medusajs/icons"
import {
  Button,
  Container,
  StatusBadge,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import {
  useCreateStockLocationFulfillmentSet,
  useDeleteFulfillmentSet,
} from "../../../../../hooks/api/stock-locations"
import { FulfillmentSetType } from "./constants"

type FulfillmentSetProps = {
  fulfillmentSet?: FulfillmentSetDTO
  locationName: string
  locationId: string
  type: FulfillmentSetType
}

export const FulfillmentSet = (props: FulfillmentSetProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { fulfillmentSet, locationName, locationId, type } = props

  const fulfillmentSetExists = !!fulfillmentSet

  const hasServiceZones = !!fulfillmentSet?.service_zones.length

  const { mutateAsync: createFulfillmentSet, isPending } =
    useCreateStockLocationFulfillmentSet(locationId)

  const { mutateAsync: deleteFulfillmentSet } = useDeleteFulfillmentSet(
    fulfillmentSet?.id
  )

  const handleCreate = async () => {
    await createFulfillmentSet(
      {
        name: `${locationName} ${
          type === FulfillmentSetType.Pickup ? "pick up" : type
        }`,
        type,
      },
      {
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )
  }

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("location.fulfillmentSet.disableWarning", {
        name: fulfillmentSet?.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await deleteFulfillmentSet(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("location.fulfillmentSet.toast.disable", {
            name: fulfillmentSet?.name,
          }),
          dismissLabel: t("actions.close"),
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
    <Container className="p-0">
      <div className="flex flex-col divide-y">
        <div className="flex items-center justify-between px-6 py-4">
          <Text size="large" weight="plus" className="flex-1" as="div">
            {t(`location.fulfillmentSet.${type}.offers`)}
          </Text>
          <div className="flex items-center gap-4">
            <StatusBadge color={fulfillmentSetExists ? "green" : "red"}>
              {t(
                fulfillmentSetExists ? "statuses.enabled" : "statuses.disabled"
              )}
            </StatusBadge>

            <ActionMenu
              groups={[
                {
                  actions: [
                    {
                      icon: <PlusMini />,
                      label: t("location.fulfillmentSet.addZone"),
                      onClick: () =>
                        navigate(
                          `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSet.id}/service-zones/create`
                        ),
                      disabled: !fulfillmentSetExists,
                    },
                    {
                      icon: fulfillmentSetExists ? (
                        <XMarkMini />
                      ) : (
                        <CheckMini />
                      ),
                      label: fulfillmentSetExists
                        ? t("actions.disable")
                        : t("actions.enable"),
                      onClick: fulfillmentSetExists
                        ? handleDelete
                        : handleCreate,
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>

        {fulfillmentSetExists && !hasServiceZones && (
          <div className="text-ui-fg-muted txt-medium flex flex-col items-center justify-center gap-y-4 py-8">
            <NoRecords
              message={t("location.fulfillmentSet.placeholder")}
              className="h-fit"
            />

            <Button
              variant="secondary"
              onClick={() =>
                navigate(
                  `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSet.id}/service-zones/create`
                )
              }
            >
              {t("location.fulfillmentSet.addZone")}
            </Button>
          </div>
        )}

        {hasServiceZones && (
          <div className="flex flex-col divide-y">
            {fulfillmentSet?.service_zones.map((zone) => (
              <ServiceZone
                zone={zone}
                key={zone.id}
                locationId={locationId}
                fulfillmentSetId={fulfillmentSet.id}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
