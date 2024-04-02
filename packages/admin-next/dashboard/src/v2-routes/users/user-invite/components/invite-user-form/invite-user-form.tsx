import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowPath, Link, XCircle } from "@medusajs/icons"
import { Invite } from "@medusajs/medusa"
import {
  Button,
  Container,
  Heading,
  Input,
  StatusBadge,
  Table,
  Text,
  Tooltip,
  clx,
  usePrompt,
} from "@medusajs/ui"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"
import {
  adminInviteKeys,
  useAdminCustomPost,
  useAdminDeleteInvite,
  useAdminInvites,
  useAdminResendInvite,
} from "medusa-react"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import * as zod from "zod"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import { Form } from "../../../../../components/common/form"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { RouteFocusModal } from "../../../../../components/route-modal"
import { useV2Store } from "../../../../../lib/api-v2"
import { InviteDTO } from "@medusajs/types"

const InviteUserSchema = zod.object({
  email: zod.string().email(),
})

const PAGE_SIZE = 10

export const InviteUserForm = () => {
  const { t } = useTranslation()

  const form = useForm<zod.infer<typeof InviteUserSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(InviteUserSchema),
  })

  const { invites, isLoading, isError, error } = useAdminInvites()
  const count = invites?.length ?? 0

  const noRecords = !isLoading && count === 0

  const columns = useColumns()

  const table = useReactTable({
    // TODO: Update type when medusa-react is 2.0 compatible
    data: (invites ?? []) as unknown as InviteDTO[],
    columns,
    pageCount: Math.ceil(count / PAGE_SIZE),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const { mutateAsync, isLoading: isMutating } = useAdminCustomPost(
    "/admin/invites",
    adminInviteKeys.lists()
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        email: values.email,
      },
      {
        onSuccess: () => {
          form.reset()
        },
      }
    )
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
                    isLoading={isMutating}
                  >
                    {t("users.sendInvite")}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-y-4">
                <Heading level="h2">{t("users.pendingInvites")}</Heading>
                <Container className="overflow-hidden p-0">
                  {!noRecords ? (
                    <div>
                      <Table>
                        <Table.Header className="border-t-0">
                          {table.getHeaderGroups().map((headerGroup) => {
                            return (
                              <Table.Row
                                key={headerGroup.id}
                                className="[&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap [&_th]:w-1/3"
                              >
                                {headerGroup.headers.map((header) => {
                                  return (
                                    <Table.HeaderCell key={header.id}>
                                      {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                    </Table.HeaderCell>
                                  )
                                })}
                              </Table.Row>
                            )
                          })}
                        </Table.Header>
                        <Table.Body>
                          {table.getRowModel().rows.map((row) => (
                            <Table.Row
                              key={row.id}
                              className={clx(
                                "transition-fg[&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
                                {
                                  "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                                    row.getIsSelected(),
                                }
                              )}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <Table.Cell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </Table.Cell>
                              ))}
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                      <LocalizedTablePagination
                        canNextPage={table.getCanNextPage()}
                        canPreviousPage={table.getCanPreviousPage()}
                        nextPage={table.nextPage}
                        previousPage={table.previousPage}
                        count={count}
                        pageIndex={table.getState().pagination.pageIndex}
                        pageCount={table.getPageCount()}
                        pageSize={PAGE_SIZE}
                      />
                    </div>
                  ) : (
                    <NoRecords className="h-[200px]" />
                  )}
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
  const { mutateAsync: revokeAsync } = useAdminDeleteInvite(invite.id)
  const { mutateAsync: resendAsync } = useAdminResendInvite(invite.id)
  const { store, isLoading, isError, error } = useV2Store({})
  const prompt = usePrompt()
  const { t } = useTranslation()

  const handleRevoke = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("users.revokeInviteWarning", {
        email: invite.email,
      }),
      cancelText: t("actions.cancel"),
      confirmText: t("actions.revoke"),
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
    const template = store?.invite_link_template

    if (!template) {
      return
    }

    const link = template.replace("{invite_token}", invite.token)
    navigator.clipboard.writeText(link)
  }

  if (isError) {
    throw error
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <Link />,
              label: t("users.copyInviteLink"),
              disabled: isLoading || !store?.invite_link_template,
              onClick: handleCopyInviteLink,
            },
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
              icon: <XCircle />,
              label: t("actions.revoke"),
              onClick: handleRevoke,
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
