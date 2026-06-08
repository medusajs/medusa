import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import {
  Button,
  createDataTableColumnHelper,
  DataTableRowSelectionState,
  Heading,
  Input,
  ProgressStatus,
  ProgressTabs,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { DataTable } from "../../../../../components/data-table"
import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useRbacAssignablePolicies } from "../../../../../hooks/api/rbac-policies"
import { useCreateRbacRole } from "../../../../../hooks/api/rbac-roles"
import { useDocumentDirection } from "../../../../../hooks/use-document-direction"
import { useQueryParams } from "../../../../../hooks/use-query-params"

enum Tab {
  DETAILS = "details",
  PERMISSIONS = "permissions",
}

type TabState = Record<Tab, ProgressStatus>

const CreateRoleDetailsSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

const CreateRoleSchema = CreateRoleDetailsSchema.extend({
  policies: z.array(z.string()).optional(),
})

const PAGE_SIZE = 20
const PREFIX = "rp"

const columnHelper =
  createDataTableColumnHelper<
    HttpTypes.AdminRbacAssignablePoliciesListResponse["policies"][number]
  >()

export const CreateRoleForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const direction = useDocumentDirection()

  const [tab, setTab] = useState<Tab>(Tab.DETAILS)
  const [tabState, setTabState] = useState<TabState>({
    [Tab.DETAILS]: "in-progress",
    [Tab.PERMISSIONS]: "not-started",
  })
  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>(
    {}
  )

  const form = useForm<z.infer<typeof CreateRoleSchema>>({
    defaultValues: {
      name: "",
      description: "",
      policies: [],
    },
    resolver: zodResolver(CreateRoleSchema),
  })

  const handleTabChange = async (nextTab: Tab) => {
    const valid = await form.trigger()

    if (!valid) {
      return
    }

    setTab(nextTab)
  }

  const { mutateAsync: createRole, isPending: isCreating } = useCreateRbacRole()

  const onRowSelectionChange = useCallback(
    (selection: DataTableRowSelectionState) => {
      const ids = Object.keys(selection).filter((id) => selection[id])

      form.setValue("policies", ids, {
        shouldDirty: true,
        shouldTouch: true,
      })

      setRowSelection(selection)
    },
    [form]
  )

  const { q, order, offset } = useQueryParams(["q", "order", "offset"], PREFIX)

  const {
    data: pageData,
    isPending: isPoliciesLoading,
    isError: isPoliciesError,
    error: policiesError,
  } = useRbacAssignablePolicies(
    {
      q,
      order,
      offset: offset ? parseInt(offset) : 0,
      limit: PAGE_SIZE,
      fields: "id,key,resource,operation,description",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  if (isPoliciesError) {
    throw policiesError
  }

  const visiblePolicies = pageData?.policies ?? []
  const count = pageData?.count ?? 0

  const columns = usePolicyColumns()

  const onNext = async (currentTab: Tab) => {
    const valid = await form.trigger()

    if (!valid) {
      return
    }

    if (currentTab === Tab.DETAILS) {
      setTab(Tab.PERMISSIONS)
    }
  }

  useEffect(() => {
    const currentState = { ...tabState }

    currentState[Tab.DETAILS] =
      tab === Tab.DETAILS ? "in-progress" : "completed"
    currentState[Tab.PERMISSIONS] =
      tab === Tab.DETAILS ? "not-started" : "in-progress"

    setTabState({ ...currentState })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only update when tab changes
  }, [tab])

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const { role } = await createRole({
        name: values.name.trim(),
        description: values.description?.trim() || null,
        policy_ids: values.policies?.length ? values.policies : undefined,
      })

      toast.success(
        t("roles.create.successToast", {
          name: role.name,
        })
      )

      handleSuccess(`/settings/roles/${role.id}`)
    } catch (error) {
      toast.error((error as Error).message)
    }
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <ProgressTabs
          dir={direction}
          value={tab}
          onValueChange={(tab) => handleTabChange(tab as Tab)}
          className="flex h-full flex-col overflow-hidden"
        >
          <RouteFocusModal.Header>
            <div className="-my-2 w-full border-l">
              <ProgressTabs.List className="justify-start-start flex w-full items-center">
                <ProgressTabs.Trigger
                  status={tabState[Tab.DETAILS]}
                  value={Tab.DETAILS}
                  className="max-w-[200px] truncate"
                >
                  {t("roles.create.tabs.details")}
                </ProgressTabs.Trigger>
                <ProgressTabs.Trigger
                  status={tabState[Tab.PERMISSIONS]}
                  value={Tab.PERMISSIONS}
                  className="max-w-[200px] truncate"
                >
                  {t("roles.create.tabs.permissions")}
                </ProgressTabs.Trigger>
              </ProgressTabs.List>
            </div>
          </RouteFocusModal.Header>
          <RouteFocusModal.Body className="size-full overflow-hidden">
            <ProgressTabs.Content
              className="size-full overflow-y-auto"
              value={Tab.DETAILS}
            >
              <div className="flex flex-col items-center overflow-auto p-16">
                <div className="flex w-full max-w-[720px] flex-col gap-y-8">
                  <div>
                    <Heading>{t("roles.create.header")}</Heading>
                    <Text size="small" className="text-ui-fg-subtle">
                      {t("roles.create.hint")}
                    </Text>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <Form.Field
                      control={form.control}
                      name="name"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label>{t("fields.name")}</Form.Label>
                            <Form.Control>
                              <Input {...field} />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        )
                      }}
                    />
                    <Form.Field
                      control={form.control}
                      name="description"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("fields.description")}
                            </Form.Label>
                            <Form.Control>
                              <Textarea {...field} rows={4} />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            </ProgressTabs.Content>
            <ProgressTabs.Content
              className="size-full overflow-y-auto"
              value={Tab.PERMISSIONS}
            >
              <DataTable
                data={visiblePolicies}
                columns={columns}
                getRowId={(row) => row.id}
                rowCount={count}
                pageSize={PAGE_SIZE}
                isLoading={isPoliciesLoading}
                prefix={PREFIX}
                rowSelection={{
                  state: rowSelection,
                  onRowSelectionChange: onRowSelectionChange,
                }}
                layout="fill"
                emptyState={{
                  empty: {
                    heading: t("roles.create.permissions.empty.heading"),
                    description: t(
                      "roles.create.permissions.empty.description"
                    ),
                  },
                  filtered: {
                    heading: t("roles.create.permissions.filtered.heading"),
                    description: t(
                      "roles.create.permissions.filtered.description"
                    ),
                  },
                }}
              />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </ProgressTabs>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <PrimaryButton tab={tab} next={onNext} isLoading={isCreating} />
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

const usePolicyColumns = () => {
  const { t } = useTranslation()

  return useMemo(() => {
    return [
      columnHelper.select(),
      columnHelper.accessor("key", {
        header: t("fields.key"),
      }),
      columnHelper.accessor("resource", {
        header: t("fields.resource"),
        cell: ({ row }) => {
          const resource = row.original.resource

          return t(`permissions.resources.${resource}`, {
            defaultValue: resource,
          })
        },
      }),
      columnHelper.accessor("operation", {
        header: t("fields.operation"),
        cell: ({ row }) => {
          const operation = row.original.operation

          return t(`permissions.actions.${operation}`, {
            defaultValue: operation,
          })
        },
      }),
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ row }) => {
          return row.original.description || "-"
        },
      }),
    ]
  }, [t])
}

type PrimaryButtonProps = {
  tab: Tab
  next: (tab: Tab) => void
  isLoading?: boolean
}

const PrimaryButton = ({ tab, next, isLoading }: PrimaryButtonProps) => {
  const { t } = useTranslation()

  if (tab === Tab.PERMISSIONS) {
    return (
      <Button
        key="submit-button"
        type="submit"
        variant="primary"
        size="small"
        isLoading={isLoading}
      >
        {t("actions.create")}
      </Button>
    )
  }

  return (
    <Button
      key="next-button"
      type="button"
      variant="primary"
      size="small"
      onClick={() => next(tab)}
    >
      {t("actions.continue")}
    </Button>
  )
}
