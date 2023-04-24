import React, { FC } from "react"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import VendorDetails from "../../settings/vendors/vendor-details"
import { useSelectedVendor } from "../../../context/vendor"
import Spinner from "../../../components/atoms/spinner"
import { useVendorSettingsBasePath } from "../helpers"

export interface VendorDetailsRouteProps {}

const VendorDetailsRoute: FC<VendorDetailsRouteProps> = () => {
  const { selectedVendor } = useSelectedVendor()
  const basePath = useVendorSettingsBasePath(selectedVendor?.id)

  if (!selectedVendor) {
    return <Spinner size="large" variant="secondary" />
  }

  return (
    <>
      <BreadCrumb
        previousRoute={basePath}
        previousBreadcrumb="Vendor Settings"
        currentPage="Details"
      />
      <VendorDetails vendor={selectedVendor} />
    </>
  )
}

export default VendorDetailsRoute
