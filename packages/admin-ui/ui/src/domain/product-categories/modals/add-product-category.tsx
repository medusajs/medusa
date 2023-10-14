import { useState } from "react"

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

const visibilityOptions = (t) => [
  {
    label: t("modals-public", "Public"),
    value: "public",
  },
  { label: t("modals-private", "Private"), value: "private" },
]

const statusOptions = (t) => [
  { label: t("modals-active", "Active"), value: "active" },
  { label: t("modals-inactive", "Inactive"), value: "inactive" },
]

type CreateProductCategoryProps = {
  closeModal: () => void
  parentCategory?: ProductCategory
}

/**
 * Focus modal container for creating Publishable Keys.
 */
function CreateProductCategory(props: CreateProductCategoryProps) {
  const { t } = useTranslation()
  const { closeModal, parentCategory, categories } = props
  const notification = useNotification()
  const queryClient = useQueryClient()

  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isPublic, setIsPublic] = useState(true)

  const { mutateAsync: createProductCategory } = useAdminCreateProductCategory()

  const onSubmit = async () => {
    try {
      await createProductCategory({
        name,
        handle,
        description,
        is_active: isActive,
        is_internal: !isPublic,
        parent_category_id: parentCategory?.id ?? null,
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
  }

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
              onClick={onSubmit}
              disabled={!name}
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
              label={t("modals-name", "Name")}
              type="string"
              name="name"
              value={name}
              className="w-[338px]"
              placeholder={t(
                "modals-give-this-category-a-name",
                "Give this category a name"
              )}
              onChange={(ev) => setName(ev.target.value)}
            />

            <InputField
              label={t("modals-handle", "Handle")}
              type="string"
              name="handle"
              value={handle}
              className="w-[338px]"
              placeholder={t("modals-custom-handle", "Custom handle")}
              onChange={(ev) => setHandle(ev.target.value)}
            />
          </div>

          <div className="mb-8">
            <TextArea
              label={t("modals-description", "Description")}
              name="description"
              value={description}
              placeholder={t(
                "modals-give-this-category-a-description",
                "Give this category a description"
              )}
              onChange={(ev) => setDescription(ev.target.value)}
            />
          </div>

          <div className="mb-8 flex justify-between gap-6">
            <div className="flex-1">
              <NextSelect
                label={t("modals-status", "Status")}
                options={statusOptions(t)}
                value={statusOptions(t)[isActive ? 0 : 1]}
                onChange={(o) => setIsActive(o.value === "active")}
              />
            </div>

            <div className="flex-1">
              <NextSelect
                label={t("modals-visibility", "Visibility")}
                options={visibilityOptions(t)}
                value={visibilityOptions(t)[isPublic ? 0 : 1]}
                onChange={(o) => setIsPublic(o.value === "public")}
              />
            </div>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default CreateProductCategory
