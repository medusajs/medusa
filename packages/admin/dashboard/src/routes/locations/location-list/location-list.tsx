import { ShoppingBag, TruckFast } from "@medusajs/icons"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { useStockLocations } from "../../../hooks/api/stock-locations"
import { LOCATION_LIST_FIELDS } from "./constants"
import { useLocationListTableColumns } from "./use-location-list-table-columns"
import { useLocationListTableQuery } from "./use-location-list-table-query"

import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { DataTable } from "../../../components/data-table"
import { SidebarLink } from "../../../components/common/sidebar-link/sidebar-link"
import { LayoutComposer } from "../../../components/layout-composer"
import { keepPreviousData } from "@tanstack/react-query"

const PAGE_SIZE = 20
const PREFIX = "loc"

export function LocationList() {
  const { t } = useTranslation()

  const searchParams = useLocationListTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const {
    stock_locations: stockLocations = [],
    count,
    isError,
    error,
    isLoading,
  } = useStockLocations(
    {
      fields: LOCATION_LIST_FIELDS,
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useLocationListTableColumns()

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="location.list"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="stock-locations-table">
              <Container className="flex flex-col divide-y p-0">
                <DataTable
                  data={stockLocations}
                  columns={columns}
                  rowCount={count}
                  pageSize={PAGE_SIZE}
                  getRowId={(row) => row.id}
                  heading={t("stockLocations.domain")}
                  subHeading={t("stockLocations.list.description")}
                  emptyState={{
                    empty: {
                      heading: t("stockLocations.list.noRecordsMessage"),
                      description: t(
                        "stockLocations.list.noRecordsMessageEmpty"
                      ),
                    },
                    filtered: {
                      heading: t("stockLocations.list.noRecordsMessage"),
                      description: t(
                        "stockLocations.list.noRecordsMessageFiltered"
                      ),
                    },
                  }}
                  actions={[
                    {
                      label: t("actions.create"),
                      to: "create",
                    },
                  ]}
                  isLoading={isLoading}
                  rowHref={(row) => `/settings/locations/${row.id}`}
                  enableSearch={true}
                  prefix={PREFIX}
                  layout="fill"
                />
              </Container>
            </LayoutComposer.Entry>
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="LinksSection">
              <LinksSection />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}

const LinksSection = () => {
  const { t } = useTranslation()

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("stockLocations.sidebar.header")}</Heading>
      </div>

      <SidebarLink
        to="/settings/locations/shipping-profiles"
        labelKey={t("stockLocations.sidebar.shippingProfiles.label")}
        descriptionKey={t(
          "stockLocations.sidebar.shippingProfiles.description"
        )}
        icon={<ShoppingBag />}
      />
      <SidebarLink
        to="/settings/locations/shipping-option-types"
        labelKey={t("stockLocations.sidebar.shippingOptionTypes.label")}
        descriptionKey={t(
          "stockLocations.sidebar.shippingOptionTypes.description"
        )}
        icon={<TruckFast />}
      />
    </Container>
  )
}
