import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link, Outlet, useLoaderData } from "react-router-dom"

import { shippingListLoader } from "./loader"
import { useStockLocations } from "../../../hooks/api/stock-locations"
import Location from "./components/location/location"
import { locationListFields } from "./const"

export function LocationList() {
  const { t } = useTranslation()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof shippingListLoader>
  >

  let { stock_locations: stockLocations = [], isPending } = useStockLocations(
    {
      fields: locationListFields,
    },
    { initialData }
  )

  return (
    <>
      <div className="py-4">
        <Container className="mb-4 flex h-fit items-center justify-between p-8">
          <div>
            <Heading className="mb-2">{t("shipping.title")}</Heading>
            <Text className="text-ui-fg-subtle txt-small">
              {t("shipping.description")}
            </Text>
          </div>
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("shipping.createLocation")}</Link>
          </Button>
        </Container>
        <div className="flex flex-col gap-4 lg:col-span-2">
          {stockLocations.map((location) => (
            <Location key={location.id} location={location} />
          ))}
        </div>
      </div>
      <Outlet />
    </>
  )
}
