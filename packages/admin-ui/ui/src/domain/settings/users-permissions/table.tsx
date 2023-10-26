import React, { useEffect, useState } from "react"
import useNotification from "../../../hooks/use-notification"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Table from "../../../components/molecules/table"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import { useTranslation } from "react-i18next"
import usePermissions, { PermissionsType } from "./use-permission"
import EditPermissionModal from "./edit-modal"

type UserPermissionsListElement = {
  entity: any
  entityType: string
  tableElement: JSX.Element
}

type UserPermissionsTableProps = {
  permissions: any[]
  triggerRefetch: () => void
}

const UserPermissionsTable: React.FC<UserPermissionsTableProps> = ({
  permissions,
  triggerRefetch,
}) => {
  const [elements, setElements] = useState<UserPermissionsListElement[]>([])
  const [shownElements, setShownElements] = useState<UserPermissionsListElement[]>([])
  const [selectedPermission, setSelectedPermission] = useState<PermissionsType | null>(null)
  const [deletePermission, setDeletePermission] = useState(false)
  const notification = useNotification()
  const { t } = useTranslation()
  const { remove, isLoading } = usePermissions()

  useEffect(() => {
    setElements([
      ...permissions.map((permission, i) => ({
        entity: permission,
        entityType: "user",
        tableElement: getTableRow(permission, i),
      }))
    ])
  }, [permissions])

  useEffect(() => {
    setShownElements(elements)
  }, [elements])

  const handleClose = () => {
    setDeletePermission(false)
    setSelectedPermission(null)
  }

  const handleSuccess = () => {
    handleClose();
    triggerRefetch();
  }

  const handleDlete = async () => {
    selectedPermission && remove(selectedPermission.id).then(() => {
      notification(
        //t("templates-success", "Success"),
        //t("users-permissions-has-been-removed", "Permission has been removed"),
        //"success",
        t("Warning"),
        t("This function is temporary disabled"),
        "warning"
      );
      triggerRefetch();
    });
  }

  const getTableRow = (row: PermissionsType, index: number) => {
    return (
      <Table.Row
        key={`permission-${index}`}
        color={"inherit"}
        actions={[
          {
            label: t("templates-edit-user-permission", "Edit Permission"),
            onClick: () => setSelectedPermission(row),
            icon: <EditIcon size={20} />,
          },
          /*
          {
            label: t("templates-remove-user-permission", "Remove Permission"),
            variant: "danger",
            onClick: () => {
              setDeletePermission(true);
              setSelectedPermission(row);
            },
            icon: <TrashIcon size={20} />,
          },
          */
        ]}
        forceDropdown={true}
      >
        <Table.Cell className="w-80">{row.name}</Table.Cell>
        <Table.Cell className="inter-small-semibold text-violet-60">
            {!!row.metadata && Object.keys(row.metadata).length}
        </Table.Cell>
      </Table.Row>
    )
  }

  const handleUsersPermissionsSearch = (term: string) => {
    setShownElements(
      elements.filter(
        (e) =>
          e.entity?.name?.toLowerCase().includes(term.toLowerCase())
      )
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <Table
        enableSearch
        handleSearch={handleUsersPermissionsSearch}
      >
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell>
              {t("permissions-name", "Name")}
            </Table.HeadCell>
            <Table.HeadCell className="w-32">
              {t("permissions-paths", "Rules")}
            </Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>{shownElements.map((e) => e.tableElement)}</Table.Body>
      </Table>
      {selectedPermission &&
        (deletePermission ? (
          <DeletePrompt
            text={t(
              "users-permissions-confirm-remove",
              "Are you sure you want to remove this permission?"
            )}
            heading={t("users-permissions-remove-heading", "Remove permission")}
            onDelete={handleDlete}
            handleClose={handleClose}
          />
        ) : (
          <EditPermissionModal
            onClose={handleClose}
            permission={selectedPermission}
            onSuccess={handleSuccess}
          />
        ))}
    </div>
  )
}

export default UserPermissionsTable
