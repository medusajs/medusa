import React, { FC } from "react"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import { useSelectedVendor } from "../../../context/vendor"
import Spinner from "../../../components/atoms/spinner"
import { useVendorSettingsBasePath } from "../helpers"
import { VendorPackages } from "../../packages"

export interface VendorPackagesRouteProps {}

const VendorPackagesRoute: FC<VendorPackagesRouteProps> = () => {
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
        currentPage="Packages"
      />
      <VendorPackages vendor={selectedVendor} />
    </>
  )
}

export default VendorPackagesRoute
