import React, { useMemo, useState } from "react"
import { Vendor } from "@medusajs/medusa"
import { AddVendorModal } from "../../components/templates/vendor-modal/add-vendor-modal"
import Settings from "./settings"
import BodyCard from "../../components/organisms/body-card"
import VendorTable from "../../components/templates/vendor-table"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import { useAdminCreateVendor } from "../../hooks/admin/vendors"
import {
  clearVendorsCache,
  useGetVendors,
} from "../../hooks/admin/vendors/queries"
import { ArchiveVendorModal } from "../../components/templates/vendor-modal/archive-vendor-modal"
import { Route, Routes, useNavigate } from "react-router-dom"

const VendorIndex: React.FC<{}> = () => {
  const view = "Vendors"

  const navigate = useNavigate()
  const { refetch } = useGetVendors()
  const createVendor = useAdminCreateVendor()
  const [showNewVendor, setShowNewVendor] = useState(false)
  const [archiveVendor, setArchiveVendor] = useState<Vendor | null>(null)

  const handleCreateVendor = async (data, colMetadata) => {
    const metadata = colMetadata
      .filter((m) => m.key && m.value) // remove empty metadata
      .reduce((acc, next) => {
        return {
          ...acc,
          [next.key]: next.value,
        }
      }, {})

    createVendor.mutate(
      {
        ...data,
        metadata,
      },
      {
        onSuccess: (response) => {
          clearVendorsCache()

          navigate(`/vendor/${response.data.vendor.id}/settings`)
        },
        onError: (err) => {
          console.error("Failed to create vendor", err)
        },
      }
    )
  }

  const actions = useMemo(() => {
    return [
      {
        label: "New Vendor",
        onClick: () => setShowNewVendor(!showNewVendor),
        icon: (
          <span className="text-grey-90">
            <PlusIcon size={20} />
          </span>
        ),
      },
    ]
  }, [view])

  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard
          title="Vendors"
          subtitle="Manage vendors"
          actionables={actions}
        >
          <VendorTable openArchiveModal={setArchiveVendor} />
        </BodyCard>
      </div>

      {showNewVendor && (
        <AddVendorModal
          onClose={() => setShowNewVendor(!showNewVendor)}
          onSubmit={handleCreateVendor}
        />
      )}

      {archiveVendor && (
        <ArchiveVendorModal
          onClose={() => setArchiveVendor(null)}
          onSuccess={() => {
            setArchiveVendor(null)
            refetch()
          }}
          vendor={archiveVendor}
        />
      )}
    </div>
  )
}

const Vendors = () => (
  <Routes>
    <Route path="/" element={<VendorIndex />} />
    <Route path="/:vendor_id/settings/*" element={<Settings />} />
  </Routes>
)

export default Vendors
