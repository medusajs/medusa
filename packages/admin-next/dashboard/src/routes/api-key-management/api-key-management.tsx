import { InformationCircle } from "@medusajs/icons"
import { PublishableApiKey, SalesChannel } from "@medusajs/medusa"
import {
  Button,
  Checkbox,
  Container,
  FocusModal,
  Heading,
  Hint,
  Input,
  Label,
  Table,
  Text,
  clx,
} from "@medusajs/ui"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useAdminCreatePublishableApiKey,
  useAdminPublishableApiKeys,
  useAdminSalesChannels,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../components/common/form"

export const ApiKeyManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { publishable_api_keys, isLoading, isError, error } =
    useAdminPublishableApiKeys()

  const columns = useColumns()

  const table = useReactTable({
    data: publishable_api_keys || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  const { t } = useTranslation()

  // TODO: Move to loading.tsx and set as Suspense fallback for the route
  if (isLoading) {
    return <div>Loading</div>
  }

  // TODO: Move to error.tsx and set as ErrorBoundary for the route
  if (isError || !publishable_api_keys) {
    const err = error ? JSON.parse(JSON.stringify(error)) : null
    return (
      <div>
        {(err as Error & { status: number })?.status === 404 ? (
          <div>Not found</div>
        ) : (
          <div>Something went wrong!</div>
        )}
      </div>
    )
  }

  const hasData = publishable_api_keys.length !== 0

  return (
    <div className="flex flex-col gap-y-2">
      <Container className="p-0">
        <div className="px-8 py-6 pb-4">
          <Heading>{t("apiKeyManagement.domain")}</Heading>
        </div>
        <div className="border-ui-border-base border-y">
          {hasData ? (
            <Table>
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <Table.Row
                      key={headerGroup.id}
                      className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th]:w-1/3"
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
              <Table.Body className="border-b-0">
                {table.getRowModel().rows.map((row) => (
                  <Table.Row
                    key={row.id}
                    className={clx(
                      "transition-fg cursor-pointer [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
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
          ) : (
            <div className="flex flex-col items-center py-24">
              <div className="flex flex-col items-center gap-y-6">
                <div className="flex flex-col items-center gap-y-2">
                  <InformationCircle />
                  <Text weight="plus" size="small" leading="compact">
                    {t("general.noRecordsFound")}
                  </Text>
                  <Text size="small" className="text-ui-fg-muted">
                    {t("apiKeyManagement.createAPublishableApiKey")}
                  </Text>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(!showCreateModal)}
                >
                  {t("apiKeyManagement.createKey")}
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="h-[72px]"></div>
      </Container>
      <CreatePublishableApiKey
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  )
}

const columnHelper = createColumnHelper<PublishableApiKey>()

const useColumns = () => {
  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("id", {
        header: "ID",
        cell: ({ getValue }) => getValue(),
      }),
    ],
    [t]
  )

  return columns
}

const CreatePublishableApiKeySchema = zod.object({
  title: zod.string().min(1),
  sales_channel_ids: zod.array(zod.string()).min(1),
})

type CreatePublishableApiKeySchema = zod.infer<
  typeof CreatePublishableApiKeySchema
>

type CreatePublishableApiKeyProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const salesChannelColumnHelper = createColumnHelper<SalesChannel>()

const useSalesChannelColumns = () => {
  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      salesChannelColumnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      salesChannelColumnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      salesChannelColumnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ getValue }) => getValue(),
      }),
    ],
    [t]
  )

  return columns
}

const CreatePublishableApiKey = (props: CreatePublishableApiKeyProps) => {
  const form = useForm<CreatePublishableApiKeySchema>({
    defaultValues: {
      title: "",
      sales_channel_ids: [],
    },
  })

  const { mutateAsync } = useAdminCreatePublishableApiKey()

  const { sales_channels, isLoading, isError, error } = useAdminSalesChannels()
  const columns = useSalesChannelColumns()

  const table = useReactTable({
    data: sales_channels || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const onSubmit = form.handleSubmit(async ({ title, sales_channel_ids }) => {
    await mutateAsync({
      title,
    })
  })

  const { t } = useTranslation()

  return (
    <FocusModal {...props}>
      <Form {...form}>
        <FocusModal.Content>
          <FocusModal.Header>
            <div className="flex items-center justify-end gap-x-2">
              <Button variant="secondary">{t("general.cancel")}</Button>
              <Button type="submit">Publish API Key</Button>
            </div>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-[720px] flex-col gap-y-4">
              <div className="flex flex-col gap-y-4">
                <Heading>Create API Key</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  Create and manage API keys. API keys are used to limit the
                  scope of requests to specific sales channels.
                </Text>
              </div>
              <div className="flex flex-col gap-y-8">
                <div className="grid grid-cols-2">
                  <Form.Field
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>{t("fields.title")}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                </div>
                <div>
                  <Label weight="plus">Sales Channels</Label>
                  <Hint></Hint>
                  <Container className="overflow-hidden p-0">
                    <div className="px-8 pb-4 pt-6">
                      <Heading level="h2">Sales Channels</Heading>
                    </div>
                    <Table>
                      <Table.Header>
                        {table.getHeaderGroups().map((headerGroup) => {
                          return (
                            <Table.Row
                              key={headerGroup.id}
                              className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th]:w-1/3"
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
                      <Table.Body className="border-b-0">
                        {table.getRowModel().rows.map((row) => (
                          <Table.Row
                            key={row.id}
                            className={clx(
                              "transition-fg last-of-type:border-b-0 [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
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
                  </Container>
                </div>
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </Form>
    </FocusModal>
  )
}
