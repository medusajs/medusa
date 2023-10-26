import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import BackButton from "../../../components/atoms/back-button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import UserRolesTable from "./table"
import AddRoleModal from "./add-modal"
import useRoles from "./use-role"

const UsersRoles: React.FC = () => {
  const { t } = useTranslation()
  const [shouldRefetch, setShouldRefetch] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const triggerRefetch = () => {
    setShouldRefetch((prev) => prev + 1)
  }

  const { roles, getRoles } = useRoles()
  
  useEffect(() => {
    setTimeout(()=>{
      getRoles();
    },500)
  }, [shouldRefetch])

  const handleClose = () => {
    triggerRefetch()
    setShowModal(false)
  }

  const handleSuccess = () => {
    handleClose();
    triggerRefetch();
  }

  const actionables = [
    {
      label: t("users-roles-add", "Add role"),
      onClick: () => setShowModal(true),
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
          title={t("users-roles-title", "Users Roles")}
          subtitle={t(
            "users-roles-description",
            "Manage users roles"
          )}
          actionables={actionables}
        >
          <div className="flex grow flex-col justify-between">
            <UserRolesTable
              roles={roles}
              triggerRefetch={triggerRefetch}
            />
          </div>
          {showModal && (
            <AddRoleModal
              onClose={handleClose}
              onSuccess={handleSuccess}
            />
          )}
        </BodyCard>
      </div>
    </div>
  )
}

export default UsersRoles
