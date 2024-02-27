import { ProductCategory } from "@medusajs/medusa"
import {
  adminProductCategoryKeys,
  useAdminCreateProductCategory,
} from "medusa-react"
import { useTranslation } from "react-i18next"

import { useQueryClient } from "@tanstack/react-query"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import TextArea from "../../../components/molecules/textarea"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import { NextSelect } from "../../../components/molecules/select/next-select"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import TreeCrumbs from "../components/tree-crumbs"
import MetadataForm, {
  getSubmittableMetadata,
  MetadataFormType,
} from "../../../components/forms/general/metadata-form"
import { Controller, useForm } from "react-hook-form"
import { nestedForm } from "../../../utils/nested-form"
import { TFunction } from "i18next"
import { getDefaultCategoryValues } from "../utils"

export enum CategoryStatus {
  Active = "active",
  Inactive = "inactive",
}

export enum CategoryVisibility {
  Public = "public",
  Private = "private",
}

const visibilityOptions = (
  t: TFunction<"translation", undefined, "translation">
) => [
  {
    label: t("modals-public", "Public"),
    value: CategoryVisibility.Public,
  },
  { label: t("modals-private", "Private"), value: CategoryVisibility.Private },
]

const statusOptions = (
  t: TFunction<"translation", undefined, "translation">
) => [
  { label: t("modals-active", "Active"), value: CategoryStatus.Active },
  { label: t("modals-inactive", "Inactive"), value: CategoryStatus.Inactive },
]

type CreateProductCategoryProps = {
  closeModal: () => void
  parentCategory?: ProductCategory
  categories: ProductCategory[]
}




export type CategoryFormData = {
  name: string
  handle: string | undefined
  description: string | undefined
  metadata: MetadataFormType
  is_active: {
    value: CategoryStatus
    label: string
  }
  is_public: {
    value: CategoryVisibility
    label: string
  }
}

/**
 * Focus modal container for creating Publishable Keys.
 */
function CreateProductCategory(props: CreateProductCategoryProps) {
  const { t } = useTranslation()
  const { closeModal, parentCategory, categories } = props
  const notification = useNotification()
  const queryClient = useQueryClient()

  const form = useForm<CategoryFormData>({
    defaultValues: getDefaultCategoryValues(t),
    mode: "onChange",
  })
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = form
  const name = watch("name", "")

  const { mutateAsync: createProductCategory } =
    useAdminCreateProductCategory()

  const submit = handleSubmit(async (data) => {
    try {
      await createProductCategory({
        name: data.name,
        handle: data.handle,
        description: data.description,
        is_active: data.is_active.value === CategoryStatus.Active,
        is_internal: data.is_public.value === CategoryVisibility.Private,
        parent_category_id: parentCategory?.id ?? null,
        metadata: getSubmittableMetadata(data.metadata),
      })
      // TODO: temporary here, investigate why `useAdminCreateProductCategory` doesn't invalidate this
      await queryClient.invalidateQueries(adminProductCategoryKeys.lists())
      closeModal()
      notification(
        t("modals-success", "Success"),
        t(
          "modals-successfully-created-a-category",
          "Successfully created a category"
        ),
        "success"
      )
    } catch (e) {
      const errorMessage =
        getErrorMessage(e) ||
        t(
          "modals-failed-to-create-a-new-category",
          "Failed to create a new category"
        )
      notification(t("modals-error", "Error"), errorMessage, "error")
    }
  })

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 flex w-full justify-between px-8">
          <Button size="small" variant="ghost" onClick={closeModal}>
            <CrossIcon size={20} />
          </Button>
          <div className="gap-x-small flex">
            <Button
              size="small"
              variant="primary"
              disabled={!isDirty || !isValid || isSubmitting}
              onClick={submit}
              className="rounded-rounded"
            >
              {t("modals-save-category", "Save category")}
            </Button>
          </div>
        </div>
      </FocusModal.Header>
      <FocusModal.Main className="no-scrollbar flex w-full justify-center">
        <div className="small:w-4/5 medium:w-7/12 large:w-6/12 my-16 max-w-[700px]">
          <h1 className="inter-xlarge-semibold text-grey-90 pb-6">
            {parentCategory
              ? t("modals-add-category-to", "Add category to {{name}}", {
                  name: parentCategory.name,
                })
              : t("modals-add-category", "Add category")}
          </h1>

          {parentCategory && (
            <div className="mb-6">
              <TreeCrumbs
                nodes={categories}
                currentNode={parentCategory}
                showPlaceholder={true}
                placeholderText={name || "New"}
              />
            </div>
          )}

          <h4 className="inter-large-semibold text-grey-90 pb-1">
            {t("modals-details", "Details")}
          </h4>

          <div className="mb-8 flex justify-between gap-6">
            <InputField
              required
              label={t("modals-name", "Name") as string}
              type="string"
              className="w-[338px]"
              placeholder={
                t(
                  "modals-give-this-category-a-name",
                  "Give this category a name"
                ) as string
              }
              {...register("name", { required: true })}
            />

            <InputField
              label={t("modals-handle", "Handle") as string}
              type="string"
              className="w-[338px]"
              placeholder={
                t("modals-custom-handle", "Custom handle") as string
              }
              {...register("handle")}
            />
          </div>

          <div className="mb-8">
            <TextArea
              label={t("modals-description", "Description")}
              placeholder={
                t(
                  "modals-give-this-category-a-description",
                  "Give this category a description"
                ) as string
              }
              {...register("description")}
            />
          </div>

          <div className="mb-8 flex justify-between gap-6">
            <div className="flex-1">
              <Controller
                name={"is_active"}
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <NextSelect
                      {...field}
                      label={t("modals-status", "Status") as string}
                      placeholder="Choose status"
                      options={statusOptions(t)}
                      value={
                        statusOptions(t)[
                          field.value?.value === CategoryStatus.Active ? 0 : 1
                        ]
                      }
                    />
                  )
                }}
              />
            </div>

            <div className="flex-1">
              <Controller
                name={"is_public"}
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <NextSelect
                      {...field}
                      label={
                        t("modals-visibility", "Visibility") as string
                      }
                      placeholder="Choose visibility"
                      options={visibilityOptions(t)}
                      value={
                        visibilityOptions(t)[
                          field.value.value === CategoryVisibility.Public ? 0 : 1
                        ]
                      }
                    />
                  )
                }}
              />
            </div>
          </div>
          <div className="mt-xlarge">
            <h2 className="inter-base-semibold mb-base">
              {t("collection-modal-metadata", "Metadata")}
            </h2>
            <MetadataForm form={nestedForm(form, "metadata")} />
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default CreateProductCategory
