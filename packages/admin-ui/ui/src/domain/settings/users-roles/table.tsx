import React, { useEffect, useState } from "react"
import useNotification from "../../../hooks/use-notification"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Table from "../../../components/molecules/table"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import { useTranslation } from "react-i18next"
import useRoles, { RolesType } from "./use-role"
import EditRoleModal from "./edit-modal"

type UserRolesListElement = {
  entity: any
  entityType: string
  tableElement: JSX.Element
}

type UserRolesTableProps = {
  roles: any[]
  triggerRefetch: () => void
}

const UserRolesTable: React.FC<UserRolesTableProps> = ({
  roles,
  triggerRefetch,
}) => {

  if(!roles.length)
    return (
      <div>No roles added</div>
    )

  const [elements, setElements] = useState<UserRolesListElement[]>([])
  const [shownElements, setShownElements] = useState<UserRolesListElement[]>([])
  const [selectedRole, setSelectedRole] = useState<RolesType | null>(null)
  const [deleteRole, setDeleteRole] = useState(false)
  const notification = useNotification()
  const { t } = useTranslation()
  const { remove, isLoading } = useRoles()

  useEffect(() => {
    setElements([
      ...roles.map((role, i) => ({
        entity: role,
        entityType: "user",
        tableElement: getTableRow(role, i),
      }))
    ])
  }, [roles])

  useEffect(() => {
    setShownElements(elements)
  }, [elements])

  const handleClose = () => {
    setDeleteRole(false)
    setSelectedRole(null)
  }

  const handleSuccess = () => {
    handleClose();
    triggerRefetch();
  }

  const handleDlete = async () => {
    selectedRole && remove(selectedRole.id).then(() => {
      notification(
        //t("templates-success", "Success"),
        //t("users-roles-has-been-removed", "Role has been removed"),
        //"success",
        t("Warning"),
        t("This function is temporary disabled"),
        "warning"
      );
      triggerRefetch();
    });
  }

  const getTableRow = (row: RolesType, index: number) => {
    return (
      <Table.Row
        key={`role-${index}`}
        color={"inherit"}
        actions={[
          {
            label: t("templates-edit-user-role", "Edit Role"),
            onClick: () => setSelectedRole(row),
            icon: <EditIcon size={20} />,
          },
          /*
          {
            label: t("templates-remove-user-role", "Remove Role"),
            variant: "danger",
            onClick: () => {
              setDeleteRole(true);
              setSelectedRole(row);
            },
            icon: <TrashIcon size={20} />,
          },
          */
        ]}
        forceDropdown={true}
      >
        <Table.Cell className="w-80">{row.name}</Table.Cell>
        <Table.Cell className="inter-small-semibold text-violet-60">
            {row.permissions?.map(p=><div>{p.name}</div>)}
        </Table.Cell>
      </Table.Row>
    )
  }

  const handleUsersRolesSearch = (term: string) => {
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
        handleSearch={handleUsersRolesSearch}
      >
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell>
              {t("roles-name", "Name")}
            </Table.HeadCell>
            <Table.HeadCell className="w-32">
              {t("roles-paths", "Permissions")}
            </Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>{shownElements.map((e) => e.tableElement)}</Table.Body>
      </Table>
      {selectedRole &&
        (deleteRole ? (
          <DeletePrompt
            text={t(
              "users-roles-confirm-remove",
              "Are you sure you want to remove this role?"
            )}
            heading={t("users-roles-remove-heading", "Remove role")}
            onDelete={handleDlete}
            handleClose={handleClose}
          />
        ) : (
          <EditRoleModal
            onClose={handleClose}
            role={selectedRole}
            onSuccess={handleSuccess}
          />
        ))}
    </div>
  )
}

export default UserRolesTable
