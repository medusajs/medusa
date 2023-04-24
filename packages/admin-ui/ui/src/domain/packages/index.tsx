import React, { useState } from "react"
import BodyCard from "../../components/organisms/body-card"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"

import { Vendor } from "@medusajs/medusa"
import { PackageModal } from "../../components/templates/vendor-package/package-modal"
import { useAdminVendorPackages } from "../../hooks/admin/packages/queries"
import VendorPackagesTable from "../../components/templates/vendor-package-table/vendor-package-table"
import { Package } from "../../hooks/admin/packages"
import { PackageDeleteModal } from "../../components/templates/vendor-package/package-delete-modal"

type VendorPackageProps = {
  vendor: Vendor
} & React.HTMLAttributes<HTMLDivElement>

export const VendorPackages: React.FC<VendorPackageProps> = ({ vendor }) => {
  const { packages, refetch: refetchVendorPackages } = useAdminVendorPackages(
    vendor?.id
  )

  const [showNewPackage, setShowNewPackage] = useState(false)
  const [showEditPackage, setEditPackage] = useState<Package | null>(null)
  const [showDeletePackage, setDeletePackage] = useState<Package | null>(null)

  const actionables = [
    {
      label: "New Package",
      onClick: () => setShowNewPackage(true),
      icon: (
        <span className="text-grey-90">
          <PlusIcon size={20} />
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col ">
      <div className="w-full flex flex-col grow">
        <BodyCard
          title="Packages"
          subtitle={
            <>
              Manage the package details for <strong>{vendor.name}</strong>
            </>
          }
          actionables={actionables}
        >
          <div className="flex grow  flex-col pt-2">
            <VendorPackagesTable
              vendorPackages={packages || []}
              editPackageModal={setEditPackage}
              deletePackageModal={setDeletePackage}
              triggerRefetch={() => refetchVendorPackages()}
            />
          </div>

          {(showNewPackage || showEditPackage) && (
            <PackageModal
              onClose={() => {
                setShowNewPackage(false)
                setEditPackage(null)
                refetchVendorPackages()
              }}
              pack={showEditPackage}
              vendor={vendor}
            />
          )}

          {showDeletePackage && (
            <PackageDeleteModal
              onClose={() => {
                setDeletePackage(null)
                refetchVendorPackages()
              }}
              vendorPackage={showDeletePackage}
              vendor={vendor}
            />
          )}
        </BodyCard>
      </div>
    </div>
  )
}
