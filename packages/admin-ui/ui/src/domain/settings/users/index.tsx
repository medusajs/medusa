import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import BackButton from "../../../components/atoms/back-button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import InviteModal from "../../../components/organisms/invite-modal"
import UserTable from "../../../components/templates/user-table"
import Medusa from "../../../services/api"

const Users: React.FC = () => {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const [invites, setInvites] = useState([])
  const [shouldRefetch, setShouldRefetch] = useState(0)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const triggerRefetch = () => {
    setShouldRefetch((prev) => prev + 1)
  }

  useEffect(() => {
    try{
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
      }
      catch(e) {
        console.error(e);
      }
  }, [shouldRefetch])

  const actionables = [
    {
      label: t("users-invite-users", "Invite Users"),
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
          label={t("users-back-to-settings", "Back to settings")}
          className="mb-xsmall"
        />
        <BodyCard
          title={t("users-users", "Users")}
          subtitle={t(
            "users-manage-users-of-your-medusa-store",
            "Manage users of your Medusa Store"
          )}
          actionables={actionables}
        >
          <div className="flex grow flex-col justify-between">
            <UserTable
              users={users}
              invites={invites}
              triggerRefetch={triggerRefetch}
            />
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
