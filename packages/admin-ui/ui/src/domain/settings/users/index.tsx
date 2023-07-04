import React, { useEffect, useState } from "react"
import BackButton from "../../../components/atoms/back-button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import InviteModal from "../../../components/organisms/invite-modal"
import UserTable from "../../../components/templates/user-table"
import Medusa from "../../../services/api"

const Users: React.FC = () => {
  const [users, setUsers] = useState([])
  const [invites, setInvites] = useState([])
  const [shouldRefetch, setShouldRefetch] = useState(0)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const triggerRefetch = () => {
    setShouldRefetch((prev) => prev + 1)
  }

  useEffect(() => {
    Medusa.users
      .list()
      .then((res) => res.data)
      .then((userData) => {
        Medusa.invites
          .list()
          .then((res) => res.data)
          .then((inviteData) => {
            setUsers(userData.users)
            setInvites(inviteData.invites)
          })
      })
  }, [shouldRefetch])

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
    <div className="flex h-full flex-col">
      <div className="flex w-full grow flex-col">
        <BackButton
          path="/a/settings"
          label="Back to settings"
          className="mb-xsmall"
        />
        <BodyCard
          title="The Team"
          subtitle="Manage users of your Medusa Store"
          actionables={actionables}
        >
          <div className="flex grow flex-col justify-between">
            <UserTable
              users={users}
              invites={invites}
              triggerRefetch={triggerRefetch}
            />
            <p className="inter-small-regular text-grey-50">
              {users.length} member
              {users.length === 1 ? "" : "s"}
            </p>
          </div>
          {showInviteModal && (
            <InviteModal
              handleClose={() => {
                triggerRefetch()
                setShowInviteModal(false)
              }}
            />
          )}
        </BodyCard>
      </div>
    </div>
  )
}

export default Users
