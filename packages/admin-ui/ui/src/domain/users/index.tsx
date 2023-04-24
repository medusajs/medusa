import React, { useState } from "react"
import BodyCard from "../../components/organisms/body-card"
import InviteModal from "../../components/organisms/invite-modal"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import { useAdminVendorAccess } from "../../hooks/admin/vendors/queries"
import UserAccessTable from "../../components/templates/user-access-table"
import { useAdminVendorInvites } from "../../hooks/admin/invites/queries"
import { Vendor } from "@medusajs/medusa"

type VendorUserProps = {
  vendor: Vendor
} & React.HTMLAttributes<HTMLDivElement>

export const VendorUsers: React.FC<VendorUserProps> = ({ vendor }) => {
  const {
    data: usersWithAccess,
    refetch: refetchAccess,
  } = useAdminVendorAccess(vendor?.id)

  const { data: inviteData, refetch: refetchInvites } = useAdminVendorInvites(
    vendor?.id
  )

  const [showInviteModal, setShowInviteModal] = useState(false)

  const actionables = [
    {
      label: "Invite Users",
      onClick: () => setShowInviteModal(true),
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
          title="The Team"
          subtitle={`Manage who has access to ${vendor.name}`}
          actionables={actionables}
        >
          <div className="flex grow  flex-col pt-2">
            <UserAccessTable
              vendor={vendor}
              usersAccess={usersWithAccess}
              invites={inviteData?.invites || []}
              triggerRefetch={() => (refetchAccess(), refetchInvites())}
            />
          </div>
          <div className="inter-small-regular text-grey-50">
            {usersWithAccess?.length} member
            {usersWithAccess?.length === 1 ? "" : "s"}
          </div>

          {showInviteModal && (
            <InviteModal
              vendor={vendor}
              handleClose={() => {
                // triggerRefetch()
                setShowInviteModal(false)
                refetchAccess()
                refetchInvites()
              }}
            />
          )}
        </BodyCard>
      </div>
    </div>
  )
}
