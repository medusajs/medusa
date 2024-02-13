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
  useAdminSalesChannels,
} from "medusa-react"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Outlet } from "react-router-dom"
import { Form } from "../../../components/common/form"
import { ApiKeyManagementListTable } from "./components/api-key-management-list-table"

export const ApiKeyManagementList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <ApiKeyManagementListTable />
      <Outlet />
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
              <FocusModal.Close asChild>
                <Button size="small" variant="secondary">
                  {t("actions.cancel")}
                </Button>
              </FocusModal.Close>
              <Button size="small" type="submit">
                Publish API Key
              </Button>
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
