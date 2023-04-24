import React, { FC } from "react"
import Spinner from "../../../components/atoms/spinner"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import { useSelectedVendor } from "../../../context/vendor"
import Regions from "../../settings/regions"
import { useVendorSettingsBasePath } from "../helpers"

export interface VendorRegionsRouteProps {
  path: string
}

const VendorRegionsRoute: FC<VendorRegionsRouteProps> = () => {
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
        currentPage="Regions"
      />
      <Regions />
    </>
  )
}

export default VendorRegionsRoute
