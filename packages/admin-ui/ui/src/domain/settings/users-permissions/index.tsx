import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import BackButton from "../../../components/atoms/back-button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import UserPermissionsTable from "./table"
import UsersPermissionsModal from "./add-modal"
import { useMedusa } from "medusa-react"
import usePermissions from "./use-permission"

const UsersPermissions: React.FC = () => {
  const { t } = useTranslation()
  const [shouldRefetch, setShouldRefetch] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const triggerRefetch = () => {
    setShouldRefetch((prev) => prev + 1)
  }

  const { permissions, getPermissions } = usePermissions()
  
  useEffect(() => {
    getPermissions();
  }, [shouldRefetch])

  const actionables = [
    {
      label: t("users-permissions-add", "Add permission"),
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
          title={t("users-permissions-title", "Users Permissions")}
          subtitle={t(
            "users-permissions-description",
            "Manage users permissions"
          )}
          actionables={actionables}
        >
          <div className="flex grow flex-col justify-between">
            <UserPermissionsTable
              permissions={permissions}
              triggerRefetch={triggerRefetch}
            />
          </div>
          {showModal && (
            <UsersPermissionsModal
              handleClose={() => {
                triggerRefetch()
                setShowModal(false)
              }}
            />
          )}
        </BodyCard>
      </div>
    </div>
  )
}

export default UsersPermissions
