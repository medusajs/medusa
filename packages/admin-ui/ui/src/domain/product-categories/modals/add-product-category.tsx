import { useState } from "react"

import { ProductCategory } from "@medusajs/medusa"
import { useQueryClient } from "@tanstack/react-query"
import {
  adminProductCategoryKeys,
  useAdminCreateProductCategory,
} from "medusa-react"
import { useTranslation } from "react-i18next"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputHeader from "../../../components/fundamentals/input-header"
import InputField from "../../../components/molecules/input"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import { NextSelect } from "../../../components/molecules/select/next-select"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import TreeCrumbs from "../components/tree-crumbs"

const visibilityOptions = (t) => [
  {
    label: t("Public"),
    value: "public",
  },
  { label: t("Private"), value: "private" },
]

const statusOptions = (t) => [
  { label: t("Active"), value: "active" },
  { label: t("Inactive"), value: "inactive" },
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
  const [name_ar, setNameAr] = useState("")
  const [handle, setHandle] = useState("")
  const [handle_ar, setHandleAr] = useState("")
  const [description, setDescription] = useState("")
  const [description_ar, setDescriptionAr] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isPublic, setIsPublic] = useState(true)

  const { mutateAsync: createProductCategory } = useAdminCreateProductCategory()

  const onSubmit = async () => {
    try {
      await createProductCategory({
        name,
        name_ar,
        handle,
        handle_ar,
        description,
        description_ar,
        is_active: isActive,
        is_internal: !isPublic,
        parent_category_id: parentCategory?.id ?? null,
      })
      // TODO: temporary here, investigate why `useAdminCreateProductCategory` doesn't invalidate this
      await queryClient.invalidateQueries(adminProductCategoryKeys.lists())
      closeModal()
      notification(
        t("Success"),
        t("Successfully created a category"),
        "success"
      )
    } catch (e) {
      const errorMessage =
        getErrorMessage(e) || t("Failed to create a new category")
      notification(t("Error"), errorMessage, "error")
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
              {t("Save category")}
            </Button>
          </div>
        </div>
      </FocusModal.Header>

      <FocusModal.Main className="flex w-full justify-center">
        <div className="small:w-4/5 medium:w-7/12 large:w-6/12 my-16 max-w-[700px]">
          <h1 className="inter-xlarge-semibold text-grey-90 pb-6">
            {parentCategory
              ? t("Add category to {name}", { name: parentCategory.name })
              : t("Add category")}
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
            {t("Details")}
          </h4>

          <div className="medium:flex-row mb-8 flex flex-col justify-between gap-6">
            <InputField
              required
              label={t("Name in Engilish")}
              type="string"
              name="name"
              value={name}
              className="w-[338px]"
              placeholder={t("Give this category a name")}
              onChange={(ev) => setName(ev.target.value)}
            />

            <InputField
              label={t("Handle in Engilish")}
              type="string"
              name="handle"
              value={handle}
              className="w-[338px]"
              placeholder={t("Custom handle")}
              onChange={(ev) => setHandle(ev.target.value)}
            />
          </div>
          <div className="medium:flex-row mb-8 flex flex-col justify-between gap-6">
            <InputField
              required
              label={t("Name in arabic")}
              type="string"
              name="name_ar"
              value={name_ar}
              className="w-[338px]"
              placeholder="الإسم"
              onChange={(ev) => setNameAr(ev.target.value)}
            />

            <InputField
              label={t("Handle in arabic")}
              type="string"
              name="handle_ar"
              value={handle_ar}
              className="w-[338px]"
              placeholder={t("Custom handle in arabic")}
              onChange={(ev) => setHandleAr(ev.target.value)}
            />
          </div>

          <div className="mb-8">
            <InputHeader label={t("Description in English")} className="mb-xsmall" />
            <ReactQuill
              theme="snow"
              value={description}
              onChange={(value) => setDescription(value)}
            />
          </div>

          <div className="mb-8">
            <InputHeader label={t("Description in arabic")} className="mb-xsmall" />
            <ReactQuill
              theme="snow"
              value={description_ar}
              onChange={(value) => setDescriptionAr(value)}
            />
          </div>

          <div className="medium:flex-row mb-8 flex flex-col justify-between gap-6">
            <div className="flex-1">
              <NextSelect
                label={t("Status")}
                options={statusOptions(t)}
                value={statusOptions(t)[isActive ? 0 : 1]}
                onChange={(o) => setIsActive(o.value === "active")}
              />
            </div>

            <div className="flex-1">
              <NextSelect
                label={t("Visibility")}
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
