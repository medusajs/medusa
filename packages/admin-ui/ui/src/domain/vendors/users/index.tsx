import React, { FC } from "react"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import { VendorUsers } from "../../users"
import { useSelectedVendor } from "../../../context/vendor"
import Spinner from "../../../components/atoms/spinner"
import { useVendorSettingsBasePath } from "../helpers"

export interface VendorUsersRouteProps {}

const VendorUsersRoute: FC<VendorUsersRouteProps> = () => {
  const { selectedVendor } = useSelectedVendor()
  const basePath = useVendorSettingsBasePath(selectedVendor?.id)

  if (!selectedVendor) {
    return <Spinner size="large" variant="secondary" />
  }

  return (
    <>
      {basePath.startsWith("/admin") && (
        <BreadCrumb
          previousRoute={basePath}
          previousBreadcrumb="Vendor Settings"
          currentPage="Team"
        />
      )}
      <VendorUsers vendor={selectedVendor} />
    </>
  )
}

export default VendorUsersRoute
