import { Vendor } from "@medusajs/medusa"
import { Invite } from "@medusajs/medusa/dist/models/invite"
import { User } from "@medusajs/medusa/dist/models/user"
import React, { useEffect, useState } from "react"
import { AdminVendorAccessRes } from "../../hooks/admin/vendors/queries"
import useNotification from "../../hooks/use-notification"
import Medusa from "../../services/api"
import EditIcon from "../fundamentals/icons/edit-icon"
import RefreshIcon from "../fundamentals/icons/refresh-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import StatusIndicator from "../fundamentals/status-indicator"
import SidebarTeamMember from "../molecules/sidebar-team-member"
import Table from "../molecules/table"
import DeletePrompt from "../organisms/delete-prompt"
import EditUserPermissionsModal from "../organisms/edit-user-permissions-modal"

type UserListElement = {
  entity: any
  entityType: string
  tableElement: JSX.Element
}

type UserTableProps = {
  vendor: Vendor
  usersAccess: AdminVendorAccessRes[] | undefined
  invites: Invite[]
  triggerRefetch: () => void
}

const getInviteStatus = (invite) => {
  return new Date(invite.expires_at) < new Date() ? "expired" : "pending"
}

const UserAccessTable: React.FC<UserTableProps> = ({
  vendor,
  usersAccess,
  invites,
  triggerRefetch,
}) => {
  const [elements, setElements] = useState<UserListElement[]>([])
  const [shownElements, setShownElements] = useState<UserListElement[]>([])

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState(false)
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null)
  const notification = useNotification()

  useEffect(() => {
    setElements([
      ...(usersAccess
        ?.filter((usersAccess) => !!usersAccess)
        .map((user, i) => ({
          entity: user,
          entityType: "user",
          tableElement: getUserTableRow(user, i),
        })) ?? []),
      ...(invites
        ?.filter((invite) => !!invite)
        .map((invite, i) => ({
          entity: invite,
          entityType: "invite",
          tableElement: getInviteTableRow(invite, i),
        })) ?? []),
    ])
  }, [usersAccess, invites])

  useEffect(() => {
    setShownElements(elements)
  }, [elements])

  const handleClose = () => {
    setDeleteUser(false)
    setSelectedUser(null)
    setSelectedInvite(null)

    triggerRefetch()
  }

  const getUserTableRow = (user, index) => {
    return (
      <Table.Row
        key={`user-${index}`}
        color={"inherit"}
        actions={[
          {
            label: "Edit User Permissions",
            onClick: () => setSelectedUser(user),
            icon: <EditIcon size={20} />,
          },
          {
            label: "Remove User From Vendor",
            variant: "danger",
            onClick: () => {
              setDeleteUser(true)
              setSelectedUser(user)
            },
            icon: <TrashIcon size={20} />,
          },
        ]}
      >
        <Table.Cell>
          <SidebarTeamMember user={user} />
        </Table.Cell>
        <Table.Cell className="w-80">{user.email}</Table.Cell>

        <Table.Cell className="w-80">{user.access_level}</Table.Cell>
        <Table.Cell>
          <StatusIndicator title={"Active"} variant={"success"} />
        </Table.Cell>
      </Table.Row>
    )
  }

  const getInviteTableRow = (invite, index) => {
    return (
      <Table.Row
        key={`invite-${index}`}
        actions={[
          {
            label: "Resend Invitation",
            onClick: () => {
              Medusa.invites
                .resend(invite.id)
                .then(() => {
                  notification(
                    "Success",
                    "Invitiation link has been resent",
                    "success"
                  )
                })
                .then(() => triggerRefetch())
            },
            icon: <RefreshIcon size={20} />,
          },
          {
            label: "Remove Invitation",
            variant: "danger",
            onClick: () => {
              setSelectedInvite(invite)
            },
            icon: <TrashIcon size={20} />,
          },
        ]}
      >
        <Table.Cell className="text-grey-40">
          <SidebarTeamMember user={{ email: invite.user_email }} />
        </Table.Cell>
        <Table.Cell className="text-grey-40 w-80">
          {invite.user_email}
        </Table.Cell>

        <Table.Cell>{invite.access_level}</Table.Cell>
        <Table.Cell>
          {new Date(invite?.expires_at) < new Date() ? (
            <StatusIndicator title={"Expired"} variant={"danger"} />
          ) : (
            <StatusIndicator title={"Pending"} variant={"warning"} />
          )}
        </Table.Cell>
      </Table.Row>
    )
  }

  const filteringOptions = [
    // {
    //   title: "Team permissions",
    //   options: [
    //     {
    //       title: "All",
    //       count: elements.length,
    //       onClick: () => setShownElements(elements),
    //     },
    //     {
    //       title: "Member",
    //       count: elements.filter(
    //         (e) => e.entityType === "user" && e.entity.role === "member"
    //       ).length,
    //       onClick: () =>
    //         setShownElements(
    //           elements.filter(
    //             (e) => e.entityType === "user" && e.entity.role === "member"
    //           )
    //         ),
    //     },
    //     {
    //       title: "Admin",
    //       count: elements.filter(
    //         (e) => e.entityType === "user" && e.entity.role === "admin"
    //       ).length,
    //       onClick: () =>
    //         setShownElements(
    //           elements.filter(
    //             (e) => e.entityType === "user" && e.entity.role === "admin"
    //           )
    //         ),
    //     },
    //     {
    //       title: "No team permissions",
    //       count: elements.filter((e) => e.entityType === "invite").length,
    //       onClick: () =>
    //         setShownElements(elements.filter((e) => e.entityType === "invite")),
    //     },
    //   ],
    // },
    {
      title: "Status",
      options: [
        {
          title: "All",
          count: elements.length,
          onClick: () => setShownElements(elements),
        },
        {
          title: "Active",
          count: elements.filter((e) => e.entityType === "user").length,
          onClick: () =>
            setShownElements(elements.filter((e) => e.entityType === "user")),
        },
        {
          title: "Pending",
          count: elements.filter(
            (e) =>
              e.entityType === "invite" &&
              getInviteStatus(e.entity) === "pending"
          ).length,
          onClick: () =>
            setShownElements(
              elements.filter(
                (e) =>
                  e.entityType === "invite" &&
                  getInviteStatus(e.entity) === "pending"
              )
            ),
        },
        {
          title: "Expired",
          count: elements.filter(
            (e) =>
              e.entityType === "invite" &&
              getInviteStatus(e.entity) === "expired"
          ).length,
          onClick: () =>
            setShownElements(
              elements.filter(
                (e) =>
                  e.entityType === "invite" &&
                  getInviteStatus(e.entity) === "expired"
              )
            ),
        },
      ],
    },
  ]

  const handleUserSearch = (term: string) => {
    setShownElements(
      elements.filter(
        (e) =>
          e.entity?.first_name?.includes(term) ||
          e.entity?.last_name?.includes(term) ||
          e.entity?.email?.includes(term) ||
          e.entity?.user_email?.includes(term)
      )
    )
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <Table
        filteringOptions={filteringOptions}
        enableSearch
        handleSearch={handleUserSearch}
      >
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell className="w-72">Name</Table.HeadCell>
            <Table.HeadCell className="w-80">Email</Table.HeadCell>
            <Table.HeadCell className="w-72">Team permissions</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>{shownElements.map((e) => e.tableElement)}</Table.Body>
      </Table>

      {selectedUser &&
        (deleteUser ? (
          <DeletePrompt
            text={"Are you sure you want to remove this user from your vendor?"}
            heading={"Remove user"}
            onDelete={() =>
              Medusa.users.delete(selectedUser.id).then(() => {
                notification("Success", "User has been removed", "success")
                triggerRefetch()
              })
            }
            handleClose={handleClose}
          />
        ) : (
          <EditUserPermissionsModal
            handleClose={handleClose}
            vendor={vendor}
            user={selectedUser}
            onSubmit={() => {
              notification("Success", "User has been updated", "success")
              triggerRefetch()
            }}
          />
        ))}
      {selectedInvite && (
        <DeletePrompt
          text={"Are you sure you want to remove this invite from your store?"}
          heading={"Remove invite"}
          onDelete={() =>
            Medusa.invites.delete(selectedInvite.id).then(() => {
              notification("Success", "Invitiation has been removed", "success")
              triggerRefetch()
            })
          }
          handleClose={handleClose}
        />
      )}
    </div>
  )
}

export default UserAccessTable
