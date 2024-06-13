import { zodResolver } from "@hookform/resolvers/zod"
import { Button, ProgressStatus, ProgressTabs, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { useState } from "react"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateProductCategory } from "../../../../../hooks/api/categories"
import { CreateCategoryDetails } from "./create-category-details"
import { CreateCategoryNesting } from "./create-category-nesting"
import { CreateCategoryDetailsSchema, CreateCategorySchema } from "./schema"

type CreateCategoryFormProps = {
  parentCategoryId: string | null
}

enum Tab {
  DETAILS = "details",
  ORGANIZE = "organize",
}

export const CreateCategoryForm = ({
  parentCategoryId,
}: CreateCategoryFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const [activeTab, setActiveTab] = useState<Tab>(Tab.DETAILS)
  const [validDetails, setValidDetails] = useState(false)

  const form = useForm<CreateCategorySchema>({
    defaultValues: {
      name: "",
      description: "",
      handle: "",
      status: "active",
      visibility: "public",
      rank: parentCategoryId ? 0 : null,
      parent_category_id: parentCategoryId,
    },
    resolver: zodResolver(CreateCategorySchema),
  })

  const handleTabChange = (tab: Tab) => {
    if (tab === Tab.ORGANIZE) {
      const { name, handle, description, status, visibility } = form.getValues()

      const result = CreateCategoryDetailsSchema.safeParse({
        name,
        handle,
        description,
        status,
        visibility,
      })

      if (!result.success) {
        result.error.errors.forEach((error) => {
          form.setError(error.path.join(".") as keyof CreateCategorySchema, {
            type: "manual",
            message: error.message,
          })
        })

        return
      }

      form.clearErrors()
      setValidDetails(true)
    }

    setActiveTab(tab)
  }

  const { mutateAsync, isPending } = useCreateProductCategory()

  const handleSubmit = form.handleSubmit((data) => {
    const { visibility, status, parent_category_id, rank, ...rest } = data

    mutateAsync(
      {
        ...rest,
        parent_category_id: parent_category_id ?? undefined,
        rank: rank ?? undefined,
        is_active: status === "active",
        is_internal: visibility === "internal",
      },
      {
        onSuccess: ({ product_category }) => {
          toast.success(t("general.success"), {
            description: t("categories.create.successToast", {
              name: product_category.name,
            }),
            dismissable: true,
            dismissLabel: t("actions.close"),
          })

          handleSuccess(`/categories/${product_category.id}`)
        },
        onError: (error) => {
          toast.error(t("general.error"), {
            description: error.message,
            dismissable: true,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )
  })

  const nestingStatus: ProgressStatus =
    form.getFieldState("parent_category_id")?.isDirty ||
    form.getFieldState("rank")?.isDirty ||
    activeTab === Tab.ORGANIZE
      ? "in-progress"
      : "not-started"

  const detailsStatus: ProgressStatus = validDetails
    ? "completed"
    : "in-progress"

  return (
    <RouteFocusModal.Form form={form}>
      <ProgressTabs
        value={activeTab}
        onValueChange={(tab) => handleTabChange(tab as Tab)}
      >
        <form onSubmit={handleSubmit}>
          <RouteFocusModal.Header>
            <div className="flex w-full items-center justify-between">
              <div className="-my-2 w-fit border-l">
                <ProgressTabs.List className="grid w-full grid-cols-4">
                  <ProgressTabs.Trigger
                    value={Tab.DETAILS}
                    status={detailsStatus}
                  >
                    {t("categories.create.tabs.details")}
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger
                    value={Tab.ORGANIZE}
                    status={nestingStatus}
                  >
                    {t("categories.create.tabs.organize")}
                  </ProgressTabs.Trigger>
                </ProgressTabs.List>
              </div>
              <div className="flex items-center justify-end gap-x-2">
                <RouteFocusModal.Close asChild>
                  <Button size="small" variant="secondary">
                    {t("actions.cancel")}
                  </Button>
                </RouteFocusModal.Close>
                {activeTab === Tab.ORGANIZE ? (
                  <Button
                    key="submit-btn"
                    size="small"
                    variant="primary"
                    type="submit"
                    isLoading={isPending}
                  >
                    {t("actions.save")}
                  </Button>
                ) : (
                  <Button
                    key="continue-btn"
                    size="small"
                    variant="primary"
                    type="button"
                    onClick={() => handleTabChange(Tab.ORGANIZE)}
                  >
                    {t("actions.continue")}
                  </Button>
                )}
              </div>
            </div>
          </RouteFocusModal.Header>
          <RouteFocusModal.Body>
            <ProgressTabs.Content value={Tab.DETAILS}>
              <CreateCategoryDetails form={form} />
            </ProgressTabs.Content>
            <ProgressTabs.Content value={Tab.ORGANIZE}>
              <CreateCategoryNesting form={form} />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </form>
      </ProgressTabs>
    </RouteFocusModal.Form>
  )
}
