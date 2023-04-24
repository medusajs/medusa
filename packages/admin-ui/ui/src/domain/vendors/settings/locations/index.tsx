import React, { FC } from "react"
import BreadCrumb from "../../../../components/molecules/breadcrumb"
import { useSelectedVendor } from "../../../../context/vendor"
import Spinner from "../../../../components/atoms/spinner"
import { useVendorSettingsBasePath } from "../../helpers"
import { useGetLocations } from "../../../../hooks/admin/locations"
import { LocationForm } from "./components/LocationForm"
import { Route, Routes } from "react-router-dom"

export interface VendorLocationsRouteProps {}

const VendorLocationsRoute: FC<VendorLocationsRouteProps> = () => {
  const { selectedVendor } = useSelectedVendor()
  const basePath = useVendorSettingsBasePath(selectedVendor?.id)
  const { locations, isLoading, refetch } = useGetLocations(
    selectedVendor?.id || ""
  )
  const firstLocation = (locations || [])[0]

  if (!selectedVendor || isLoading) {
    return <Spinner size="large" variant="secondary" />
  }

  return (
    <>
      <BreadCrumb
        previousRoute={basePath}
        previousBreadcrumb="Vendor Settings"
        currentPage="Locations"
      />

      <LocationForm
        vendor={selectedVendor}
        location={firstLocation}
        onSave={() => refetch()}
      />
    </>
  )
}

const VendorLocationsIndex: FC<{}> = () => (
  <Routes>
    <Route path="/" element={<VendorLocationsRoute />} />
  </Routes>
)

export default VendorLocationsIndex
