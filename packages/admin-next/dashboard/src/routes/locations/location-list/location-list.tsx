import { Outlet, useLoaderData, useNavigate } from "react-router-dom"
import { Container, Heading, IconButton } from "@medusajs/ui"
import { ArrowUpRightOnBox, Buildings, ShoppingBag } from "@medusajs/icons"
import { useTranslation } from "react-i18next"

import { useStockLocations } from "../../../hooks/api/stock-locations"
import LocationListItem from "./components/location-list-item/location-list-item"
import { LOCATION_LIST_FIELDS } from "./constants"
import { shippingListLoader } from "./loader"

import after from "virtual:medusa/widgets/location/list/after"
import before from "virtual:medusa/widgets/location/list/before"
import { LocationListHeader } from "./components/location-list-header"

export function LocationList() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof shippingListLoader>
  >

  const {
    stock_locations: stockLocations = [],
    isError,
    error,
  } = useStockLocations(
    {
      fields: LOCATION_LIST_FIELDS,
    },
    { initialData }
  )

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-x-4 gap-y-3 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-3">
          {before.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })}
          <LocationListHeader />
          <div className="flex flex-col gap-3 lg:col-span-2">
            {stockLocations.map((location) => (
              <LocationListItem key={location.id} location={location} />
            ))}
          </div>
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })}
        </div>

        <div className="flex w-full max-w-[100%] flex-col gap-y-3 xl:mt-0 xl:max-w-[400px]">
          <LinksSection />
        </div>
      </div>
      <Outlet />
    </div>
  )
}

const LinksSection = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">
          {t("stockLocations.sidebar.shippingConfiguration")}
        </Heading>
      </div>

      <div className="txt-small flex flex-col gap-2 px-2 pb-2">
        <div className="shadow-elevation-card-rest bg-ui-bg-component rounded-md px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="shadow-elevation-card-rest rounded-md">
              <ShoppingBag />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-ui-fg-base font-medium">
                {t("stockLocations.sidebar.shippingProfiles")}
              </span>
              <span className="text-ui-fg-subtle">
                {t("stockLocations.sidebar.shippingProfilesDesc")}
              </span>
            </div>
            <IconButton
              size="2xsmall"
              variant="transparent"
              type="button"
              onClick={() => navigate(`/settings/locations/shipping-profiles`)}
            >
              <ArrowUpRightOnBox className="text-ui-fg-muted" />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="txt-small flex flex-col gap-2 px-2 pb-2">
        <div className="shadow-elevation-card-rest bg-ui-bg-component rounded-md px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="shadow-elevation-card-rest rounded-md">
              <Buildings />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-ui-fg-base font-medium">
                {t("stockLocations.sidebar.shippingOptionTypes")}
              </span>
              <span className="text-ui-fg-subtle">
                {t("stockLocations.sidebar.shippingOptionTypesDesc")}
              </span>
            </div>
            <IconButton
              size="2xsmall"
              variant="transparent"
              type="button"
              onClick={() =>
                navigate(`/settings/locations/shipping-option-types`)
              }
            >
              <ArrowUpRightOnBox className="text-ui-fg-muted" />
            </IconButton>
          </div>
        </div>
      </div>
    </Container>
  )
}
