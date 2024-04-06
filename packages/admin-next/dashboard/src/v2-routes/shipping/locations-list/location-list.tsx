import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useLoaderData } from "react-router-dom"
import { shippingListLoader } from "./loader"
import { useStockLocations } from "../../../hooks/api/stock-locations"
import Location from "./components/location/location"

export function LocationList() {
  const { t } = useTranslation()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof shippingListLoader>
  >

  const { stock_locations: stockLocations = [] } = useStockLocations(
    { fields: "*fulfillment_zones" },
    { initialData }
  )

  return (
    <div className="grid grid-cols-3 gap-x-6 py-4">
      <Container className="col-span-3 mb-4 h-fit p-8 lg:col-span-1">
        <Heading className="mb-2">{t("shipping.title")}</Heading>
        <Text className="text-ui-fg-subtle">{t("shipping.description")}</Text>
      </Container>
      <div className="col-span-3 flex flex-col gap-4 lg:col-span-2">
        {stockLocations.map((location) => (
          <Location key={location.id} location={location} />
        ))}
      </div>
    </div>
  )
}
