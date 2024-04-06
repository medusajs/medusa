import { Button, Container, Text } from "@medusajs/ui"
import { StockLocationDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { Buildings } from "@medusajs/icons"

import { countries } from "../../../../../lib/countries"
import { useNavigate } from "react-router-dom"

type LocationProps = {
  location: StockLocationDTO
}

function Location(props: LocationProps) {
  const { location } = props
  const { t } = useTranslation()
  const navigate = useNavigate()

  const hasFulfillmentSets = !!location.fulfillment_sets.length

  return (
    <Container className="flex flex-col divide-y p-0">
      <div className="px-6 py-5">
        <Text
          size="small"
          weight="plus"
          className="text-ui-fg-subtle mb-4"
          as="div"
        >
          {t("shipping.from")}
        </Text>

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
          <div className="flex grow-0 gap-2">
            <Button variant="secondary">{t("shipping.connectProvider")}</Button>
            {!hasFulfillmentSets && (
              <Button
                onClick={() =>
                  navigate(`/settings/shipping/location/${location.id}/create`)
                }
                variant="secondary"
              >
                {t("shipping.add")}
              </Button>
            )}
            {hasFulfillmentSets && (
              <Button variant="secondary">{t("shipping.addZone")}</Button>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Location
