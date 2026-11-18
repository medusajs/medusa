import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Heading,
  Input,
  ProgressStatus,
  ProgressTabs,
  Text,
  Textarea,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateRbacRole } from "../../../../../hooks/api/rbac-roles"
import { useDocumentDirection } from "../../../../../hooks/use-document-direction"
import {
  PermissionsMatrix,
  PermissionsSummary,
  PermissionsTemplates,
} from "../../../common/components"
import { usePermissionsMatrix } from "../../../common/hooks"
import {
  applyTemplate,
  clearSelection,
  SelectionTemplate,
} from "../../../common/utils"

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

export const CreateRoleForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const direction = useDocumentDirection()
  const prompt = usePrompt()

  const [tab, setTab] = useState<Tab>(Tab.DETAILS)
  const [tabState, setTabState] = useState<TabState>({
    [Tab.DETAILS]: "in-progress",
    [Tab.PERMISSIONS]: "not-started",
  })
  const [selection, setSelection] = useState<Set<string>>(new Set())
  const [template, setTemplate] = useState<SelectionTemplate | null>(null)
  const [hasManualChanges, setHasManualChanges] = useState(false)

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

  const {
    matrix,
    wildcardPolicies,
    isPending: isMatrixLoading,
    isError: isMatrixError,
    error: matrixError,
  } = usePermissionsMatrix()

  if (isMatrixError) {
    throw matrixError
  }

  const updateSelection = (next: Set<string>) => {
    setSelection(next)

    form.setValue("policies", [...next], {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const handleMatrixChange = (next: Set<string>) => {
    setHasManualChanges(true)
    setTemplate(null)
    updateSelection(next)
  }

  const handleTemplateSelect = async (next: SelectionTemplate) => {
    if (hasManualChanges && selection.size > 0) {
      const confirmed = await prompt({
        title: t("roles.permissions.matrix.confirm.template.title"),
        description: t(
          "roles.permissions.matrix.confirm.template.description",
          {
            template: t(`roles.permissions.matrix.templates.${next}.label`),
          }
        ),
        confirmText: t("roles.permissions.matrix.confirm.template.confirm"),
        cancelText: t("actions.cancel"),
        variant: "confirmation",
      })

      if (!confirmed) {
        return
      }
    }

    setHasManualChanges(false)
    setTemplate(next)
    updateSelection(applyTemplate(matrix, selection, next))
  }

  const handleClearAll = async () => {
    if (selection.size === 0) {
      return
    }

    if (hasManualChanges) {
      const confirmed = await prompt({
        title: t("roles.permissions.matrix.confirm.clear.title"),
        description: t(
          "roles.permissions.matrix.confirm.clear.descriptionCreate"
        ),
        confirmText: t("roles.permissions.matrix.clearAll"),
        cancelText: t("actions.cancel"),
        variant: "confirmation",
      })

      if (!confirmed) {
        return
      }
    }

    setHasManualChanges(false)
    setTemplate(null)
    updateSelection(clearSelection(matrix, selection))
  }

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
              <div className="flex size-full flex-col overflow-y-auto lg:grid lg:grid-cols-[1fr_360px] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
                <div className="flex flex-col gap-y-4 p-6 lg:min-h-0 lg:overflow-y-auto lg:p-8 [&>*]:shrink-0">
                  <div>
                    <Heading>{t("roles.create.tabs.permissions")}</Heading>
                    <Text size="small" className="text-ui-fg-subtle">
                      {t("roles.permissions.hint")}
                    </Text>
                  </div>
                  <PermissionsTemplates
                    value={template}
                    onSelect={handleTemplateSelect}
                  />
                  <PermissionsMatrix
                    matrix={matrix}
                    selection={selection}
                    onSelectionChange={handleMatrixChange}
                    onClearAll={handleClearAll}
                    isLoading={isMatrixLoading}
                  />
                </div>
                <div className="shrink-0 border-t bg-ui-bg-subtle p-6 lg:min-h-0 lg:overflow-y-auto lg:border-s lg:border-t-0">
                  <PermissionsSummary
                    name={form.watch("name")}
                    matrix={matrix}
                    selection={selection}
                    wildcardKeys={wildcardPolicies
                      .filter((policy) => selection.has(policy.id))
                      .map((policy) => policy.key)}
                  />
                </div>
              </div>
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </ProgressTabs>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            {tab === Tab.PERMISSIONS && selection.size === 0 && (
              <Text
                size="small"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                {t("roles.permissions.matrix.createHint")}
              </Text>
            )}
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <PrimaryButton
              tab={tab}
              next={onNext}
              isLoading={isCreating}
              isDisabled={selection.size === 0 || isMatrixLoading}
            />
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

type PrimaryButtonProps = {
  tab: Tab
  next: (tab: Tab) => void
  isLoading?: boolean
  isDisabled?: boolean
}

const PrimaryButton = ({
  tab,
  next,
  isLoading,
  isDisabled,
}: PrimaryButtonProps) => {
  const { t } = useTranslation()

  if (tab === Tab.PERMISSIONS) {
    return (
      <Button
        key="submit-button"
        type="submit"
        variant="primary"
        size="small"
        isLoading={isLoading}
        disabled={isDisabled}
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
