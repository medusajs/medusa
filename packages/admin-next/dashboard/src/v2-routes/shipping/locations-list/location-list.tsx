import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Outlet, useLoaderData } from "react-router-dom"

import { shippingListLoader } from "./loader"
import { useStockLocations } from "../../../hooks/api/stock-locations"
import Location from "./components/location/location"
import { NoRecords } from "../../../components/common/empty-table-content"

export function LocationList() {
  const { t } = useTranslation()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof shippingListLoader>
  >

  let { stock_locations: stockLocations = [], isPending } = useStockLocations(
    {
      fields:
        "name,address.city,address.country_code,fulfillment_sets.type,fulfillment_sets.name,*fulfillment_sets.service_zones,*fulfillment_sets.service_zones.shipping_options,*fulfillment_sets.service_zones.shipping_options.shipping_profile",
    },
    { initialData }
  )

  return (
    <>
      <div className="grid grid-cols-3 gap-x-6 py-4">
        <Container className="static top-3 col-span-3 mb-4 h-fit p-8 lg:sticky lg:col-span-1">
          <Heading className="mb-2">{t("shipping.title")}</Heading>
          <Text className="text-ui-fg-subtle txt-small">
            {t("shipping.description")}
          </Text>
        </Container>
        <div className="col-span-3 flex flex-col gap-4 lg:col-span-2">
          {!isPending && !stockLocations.length && (
            <Container>
              <NoRecords
                className="h-[180px]"
                title={t("shipping.noRecords.title")}
                message={t("shipping.noRecords.message")}
                action={{
                  to: "/inventory/locations",
                  label: t("shipping.noRecords.action"),
                }}
              />
            </Container>
          )}
          {stockLocations.map((location) => (
            <Location key={location.id} location={location} />
          ))}
        </div>
      </div>
      <Outlet />
    </>
  )
}
