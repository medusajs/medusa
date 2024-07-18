import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowPath, Link, Trash } from "@medusajs/icons"
import { InviteDTO } from "@medusajs/types"
import {
  Alert,
  Button,
  Container,
  Heading,
  Input,
  StatusBadge,
  Text,
  Tooltip,
  usePrompt,
} from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import copy from "copy-to-clipboard"
import { format } from "date-fns"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import * as zod from "zod"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Form } from "../../../../../components/common/form"
import { RouteFocusModal } from "../../../../../components/modals/index.ts"
import { DataTable } from "../../../../../components/table/data-table"
import {
  useCreateInvite,
  useDeleteInvite,
  useInvites,
  useResendInvite,
} from "../../../../../hooks/api/invites"
import { useUserInviteTableQuery } from "../../../../../hooks/table/query/use-user-invite-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { backendUrl } from "../../../../../lib/client"
import { isFetchError } from "../../../../../lib/is-fetch-error.ts"

const InviteUserSchema = zod.object({
  email: zod.string().email(),
})

const PAGE_SIZE = 10
const PREFIX = "usr_invite"

export const InviteUserForm = () => {
  const { t } = useTranslation()

  const form = useForm<zod.infer<typeof InviteUserSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(InviteUserSchema),
  })

  const { raw, searchParams } = useUserInviteTableQuery({
    prefix: PREFIX,
    pageSize: PAGE_SIZE,
  })

  const {
    invites,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useInvites(searchParams)

  const columns = useColumns()

  const { table } = useDataTable({
    data: (invites ?? []) as InviteDTO[],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  const { mutateAsync, isPending } = useCreateInvite()

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await mutateAsync({ email: values.email })
      form.reset()
    } catch (error) {
      if (isFetchError(error) && error.status === 400) {
        form.setError("root", {
          type: "manual",
          message: error.message,
        })
        return
      }
    }
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Heading>{t("users.inviteUser")}</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("users.inviteUserHint")}
                </Text>
              </div>

              {form.formState.errors.root && (
                <Alert
                  variant="error"
                  dismissible={false}
                  className="text-balance"
                >
                  {form.formState.errors.root.message}
                </Alert>
              )}

              <div className="flex flex-col gap-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Form.Field
                    control={form.control}
                    name="email"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.email")}</Form.Label>
                          <Form.Control>
                            <Input {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    size="small"
                    variant="secondary"
                    type="submit"
                    isLoading={isPending}
                  >
                    {t("users.sendInvite")}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-y-4">
                <Heading level="h2">{t("users.pendingInvites")}</Heading>
                <Container className="overflow-hidden p-0">
                  <DataTable
                    table={table}
                    columns={columns}
                    count={count}
                    pageSize={PAGE_SIZE}
                    prefix={PREFIX}
                    pagination
                    search
                    isLoading={isLoading}
                    queryObject={raw}
                    orderBy={["email", "created_at", "updated_at"]}
                  />
                </Container>
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const InviteActions = ({ invite }: { invite: InviteDTO }) => {
  const { mutateAsync: revokeAsync } = useDeleteInvite(invite.id)
  const { mutateAsync: resendAsync } = useResendInvite(invite.id)

  const prompt = usePrompt()
  const { t } = useTranslation()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("users.deleteInviteWarning", {
        email: invite.email,
      }),
      cancelText: t("actions.cancel"),
      confirmText: t("actions.delete"),
    })

    if (!res) {
      return
    }

    await revokeAsync()
  }

  const handleResend = async () => {
    await resendAsync()
  }

  const handleCopyInviteLink = () => {
    const inviteUrl = `${backendUrl}/app/invite?token=${invite.token}`
    copy(inviteUrl)
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <ArrowPath />,
              label: t("users.resendInvite"),
              onClick: handleResend,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Link />,
              label: t("users.copyInviteLink"),
              onClick: handleCopyInviteLink,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<InviteDTO>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("email", {
        header: t("fields.email"),
        cell: ({ getValue }) => {
          return getValue()
        },
      }),
      columnHelper.accessor("accepted", {
        header: t("fields.status"),
        cell: ({ getValue, row }) => {
          const accepted = getValue()
          const expired = new Date(row.original.expires_at) < new Date()

          if (accepted) {
            return (
              <Tooltip
                content={t("users.acceptedOnDate", {
                  date: format(
                    new Date(row.original.updated_at),
                    "dd MMM, yyyy"
                  ),
                })}
              >
                <StatusBadge color="green">
                  {t("users.inviteStatus.accepted")}
                </StatusBadge>
              </Tooltip>
            )
          }

          if (expired) {
            return (
              <Tooltip
                content={t("users.expiredOnDate", {
                  date: format(
                    new Date(row.original.expires_at),
                    "dd MMM, yyyy"
                  ),
                })}
              >
                <StatusBadge color="red">
                  {t("users.inviteStatus.expired")}
                </StatusBadge>
              </Tooltip>
            )
          }

          return (
            <Tooltip
              content={
                <Trans
                  i18nKey={"users.validFromUntil"}
                  components={[
                    <span key="from" className="font-medium" />,
                    <span key="untill" className="font-medium" />,
                  ]}
                  values={{
                    from: format(
                      new Date(row.original.created_at),
                      "dd MMM, yyyy"
                    ),
                    until: format(
                      new Date(row.original.expires_at),
                      "dd MMM, yyyy"
                    ),
                  }}
                />
              }
            >
              <StatusBadge color="orange">
                {t("users.inviteStatus.pending")}
              </StatusBadge>
            </Tooltip>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <InviteActions invite={row.original} />,
      }),
    ],
    [t]
  )
}
