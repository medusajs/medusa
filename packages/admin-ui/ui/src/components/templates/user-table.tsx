import { Invite, User } from "@medusajs/medusa"
import copy from "copy-to-clipboard"
import { useAdminStore } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import useNotification from "../../hooks/use-notification"
import Medusa from "../../services/api"
import ClipboardCopyIcon from "../fundamentals/icons/clipboard-copy-icon"
import EditIcon from "../fundamentals/icons/edit-icon"
import RefreshIcon from "../fundamentals/icons/refresh-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import StatusIndicator from "../fundamentals/status-indicator"
import SidebarTeamMember from "../molecules/sidebar-team-member"
import Table from "../molecules/table"
import DeletePrompt from "../organisms/delete-prompt"
import EditUser from "../organisms/edit-user-modal"
import { useTranslation } from "react-i18next"
import { getFullAdminPath } from "../../utils/get-admin-path"

type UserListElement = {
  entity: any
  entityType: string
  tableElement: JSX.Element
}

type UserTableProps = {
  users: any[]
  invites: any[]
  triggerRefetch: () => void
}

const getInviteStatus = (invite: Invite) => {
  return new Date(invite.expires_at) < new Date() ? "expired" : "pending"
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  invites,
  triggerRefetch,
}) => {
  const [elements, setElements] = useState<UserListElement[]>([])
  const [shownElements, setShownElements] = useState<UserListElement[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState(false)
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null)
  const notification = useNotification()
  const { store, isLoading } = useAdminStore()
  const { t } = useTranslation()

  useEffect(() => {
    setElements([
      ...users.map((user, i) => ({
        entity: user,
        entityType: "user",
        tableElement: getUserTableRow(user, i),
      })),
      ...invites.map((invite, i) => ({
        entity: invite,
        entityType: "invite",
        tableElement: getInviteTableRow(invite, i),
      })),
    ])
  }, [users, invites])

  useEffect(() => {
    setShownElements(elements)
  }, [elements])

  const handleClose = () => {
    setDeleteUser(false)
    setSelectedUser(null)
    setSelectedInvite(null)
  }

  const getUserTableRow = (user: User, index: number) => {
    return (
      <Table.Row
        key={`user-${index}`}
        color={"inherit"}
        actions={[
          {
            label: t("templates-edit-user", "Edit User"),
            onClick: () => setSelectedUser(user),
            icon: <EditIcon size={20} />,
          },
          {
            label: t("templates-remove-user", "Remove User"),
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
        <Table.Cell className="inter-small-semibold text-violet-60">
          {user.role.charAt(0).toUpperCase()}
          {user.role.slice(1)}
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    )
  }

  const inviteLink = useMemo(() => {
    if (store?.invite_link_template) {
      return store.invite_link_template
    }

    const adminPath = getFullAdminPath()

    return `${adminPath}invite?token={invite_token}`
  }, [store])

  const getInviteTableRow = (invite: Invite, index: number) => {
    return (
      <Table.Row
        key={`invite-${index}`}
        actions={[
          {
            label: t("templates-resend-invitation", "Resend Invitation"),
            onClick: () => {
              Medusa.invites
                .resend(invite.id)
                .then(() => {
                  notification(
                    t("templates-success", "Success"),
                    t(
                      "templates-invitiation-link-has-been-resent",
                      "Invitiation link has been resent"
                    ),
                    "success"
                  )
                })
                .then(() => triggerRefetch())
            },
            icon: <RefreshIcon size={20} />,
          },
          {
            label: t("templates-copy-invite-link", "Copy invite link"),
            disabled: isLoading,
            onClick: () => {
              copy(inviteLink.replace("{invite_token}", invite.token))
              notification(
                t("templates-success", "Success"),
                t(
                  "templates-invite-link-copied-to-clipboard",
                  "Invite link copied to clipboard"
                ),
                "success"
              )
            },
            icon: <ClipboardCopyIcon size={20} />,
          },
          {
            label: t("templates-remove-invitation", "Remove Invitation"),
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
        <Table.Cell></Table.Cell>
        <Table.Cell>
          {new Date(invite?.expires_at) < new Date() ? (
            <StatusIndicator
              title={t("templates-expired", "Expired")}
              variant={"danger"}
            />
          ) : (
            <StatusIndicator
              title={t("templates-pending", "Pending")}
              variant={"success"}
            />
          )}
        </Table.Cell>
      </Table.Row>
    )
  }

  const filteringOptions = [
    {
      title: "Team permissions",
      options: [
        {
          title: t("templates-all", "All"),
          count: elements.length,
          onClick: () => setShownElements(elements),
        },
        {
          title: t("templates-member", "Member"),
          count: elements.filter(
            (e) => e.entityType === "user" && e.entity.role === "member"
          ).length,
          onClick: () =>
            setShownElements(
              elements.filter(
                (e) => e.entityType === "user" && e.entity.role === "member"
              )
            ),
        },
        {
          title: t("templates-admin", "Admin"),
          count: elements.filter(
            (e) => e.entityType === "user" && e.entity.role === "admin"
          ).length,
          onClick: () =>
            setShownElements(
              elements.filter(
                (e) => e.entityType === "user" && e.entity.role === "admin"
              )
            ),
        },
        {
          title: t("templates-no-team-permissions", "No team permissions"),
          count: elements.filter((e) => e.entityType === "invite").length,
          onClick: () =>
            setShownElements(elements.filter((e) => e.entityType === "invite")),
        },
      ],
    },
    {
      title: t("templates-status", "Status"),
      options: [
        {
          title: t("templates-all", "All"),
          count: elements.length,
          onClick: () => setShownElements(elements),
        },
        {
          title: t("templates-active", "Active"),
          count: elements.filter((e) => e.entityType === "user").length,
          onClick: () =>
            setShownElements(elements.filter((e) => e.entityType === "user")),
        },
        {
          title: t("templates-pending", "Pending"),
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
          title: t("templates-expired", "Expired"),
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
    <div className="h-full w-full overflow-y-auto">
      <Table
        filteringOptions={filteringOptions}
        enableSearch
        handleSearch={handleUserSearch}
      >
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell className="w-72">
              {t("templates-name", "Name")}
            </Table.HeadCell>
            <Table.HeadCell className="w-80">
              {t("templates-email", "Email")}
            </Table.HeadCell>
            <Table.HeadCell className="w-72">
              {t("templates-team-permissions", "Team permissions")}
            </Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>{shownElements.map((e) => e.tableElement)}</Table.Body>
      </Table>
      {selectedUser &&
        (deleteUser ? (
          <DeletePrompt
            text={t(
              "templates-confirm-remove",
              "Are you sure you want to remove this user?"
            )}
            heading={t("templates-remove-user-heading", "Remove user")}
            onDelete={() =>
              Medusa.users.delete(selectedUser.id).then(() => {
                notification(
                  t("templates-success", "Success"),
                  t("templates-user-has-been-removed", "User has been removed"),
                  "success"
                )
                triggerRefetch()
              })
            }
            handleClose={handleClose}
          />
        ) : (
          <EditUser
            handleClose={handleClose}
            user={selectedUser}
            onSuccess={() => triggerRefetch()}
          />
        ))}
      {selectedInvite && (
        <DeletePrompt
          text={t(
            "templates-confirm-remove-invite",
            "Are you sure you want to remove this invite?"
          )}
          heading={t("templates-remove-invite", "Remove invite")}
          onDelete={() =>
            Medusa.invites.delete(selectedInvite.id).then(() => {
              notification(
                t("templates-success", "Success"),
                t(
                  "templates-invitiation-has-been-removed",
                  "Invitiation has been removed"
                ),
                "success"
              )
              triggerRefetch()
            })
          }
          handleClose={handleClose}
        />
      )}
    </div>
  )
}

export default UserTable
