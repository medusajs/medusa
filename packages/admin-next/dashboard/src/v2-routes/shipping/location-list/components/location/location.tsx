import { Button, Container, StatusBadge, Text } from "@medusajs/ui"
import { FulfillmentSetDTO, StockLocationDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { Buildings, PencilSquare, Trash } from "@medusajs/icons"
import { useNavigate } from "react-router-dom"

import { countries } from "../../../../../lib/countries"
import { ActionMenu } from "../../../../../components/common/action-menu"

enum FulfillmentSetType {
  Delivery = "delivery",
  Pickup = "pickup",
}

type FulfillmentSetProps = {
  fulfillmentSet?: FulfillmentSetDTO
  type: FulfillmentSetType
}

function FulfillmentSet(props: FulfillmentSetProps) {
  const { t } = useTranslation()
  const { fulfillmentSet, type } = props

  const fulfillmentSetExists = !!fulfillmentSet

  return (
    <div className="flex flex-col px-6 py-5">
      <div className="flex items-center justify-between">
        <Text
          size="small"
          weight="plus"
          className="text-ui-fg-subtle flex-1"
          as="div"
        >
          {t(`shipping.fulfillmentSet.${type}.title`)}
        </Text>
        <div className="flex-1 text-left">
          <StatusBadge color={fulfillmentSetExists ? "green" : "red"}>
            {t(fulfillmentSetExists ? "statuses.enabled" : "statuses.disabled")}
          </StatusBadge>
        </div>
      </div>
    </div>
  )
}

type LocationProps = {
  location: StockLocationDTO
}

function Location(props: LocationProps) {
  const { location } = props
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Container className="flex flex-col divide-y p-0">
      <div className="px-6 py-5">
        <div className="flex flex-row items-center justify-between gap-x-4">
          {/*ICON*/}
          <div className="grow-0 rounded-lg border">
            <div className="bg-ui-bg-field m-1 rounded-md p-2">
              <Buildings className="text-ui-fg-subtle" />
            </div>
          </div>

          {/*LOCATION INFO*/}
          <div className="grow-1 flex flex-1 flex-col">
            <Text weight="plus">{location.name}</Text>
            <Text className="text-ui-fg-subtle txt-small">
              {location.address?.city},{" "}
              {
                countries.find(
                  (c) =>
                    location.address?.country_code.toLowerCase() === c.iso_2
                )?.display_name
              }
            </Text>
          </div>

          {/*ACTION*/}
          <div className="flex grow-0 items-center gap-2 divide-x">
            <ActionMenu
              groups={[
                {
                  actions: [
                    {
                      label: t("actions.edit"),
                      icon: <PencilSquare />,
                      to: `/settings/shipping/${location.id}/edit`,
                    },
                    {
                      label: t("shipping.deleteLocation"),
                      icon: <Trash />,
                      // onClick: handleDelete, // TODO
                    },
                  ],
                },
              ]}
            />
            <Button
              className="text-ui-fg-interactive hover:bg-transparent"
              onClick={() => navigate(`/settings/shipping/${location.id}`)}
              variant="transparent"
            >
              {t("actions.viewDetails")}
            </Button>
          </div>
        </div>
      </div>

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
