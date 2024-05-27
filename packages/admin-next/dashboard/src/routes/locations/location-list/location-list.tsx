import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link, Outlet, useLoaderData } from "react-router-dom"

import { useStockLocations } from "../../../hooks/api/stock-locations"
import Location from "./components/location/location"
import { locationListFields } from "./const"
import { shippingListLoader } from "./loader"

import after from "virtual:medusa/widgets/location/list/after"
import before from "virtual:medusa/widgets/location/list/before"

export function LocationList() {
  const { t } = useTranslation()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof shippingListLoader>
  >

  const { stock_locations: stockLocations = [], isPending } = useStockLocations(
    {
      fields: locationListFields,
    },
    { initialData }
  )

  return (
    <div className="flex flex-col gap-y-3">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <Container className="flex h-fit items-center justify-between p-8">
        <div>
          <Heading className="mb-2">{t("location.title")}</Heading>
          <Text className="text-ui-fg-subtle txt-small">
            {t("location.description")}
          </Text>
        </div>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("location.createLocation")}</Link>
        </Button>
      </Container>
      <div className="flex flex-col gap-3 lg:col-span-2">
        {stockLocations.map((location) => (
          <Location key={location.id} location={location} />
        ))}
      </div>
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <Outlet />
    </div>
  )
}
