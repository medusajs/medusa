import { useEffect, useState } from "react"

import { ProductCategory } from "@medusajs/medusa"
import { useAdminUpdateProductCategory } from "medusa-react"
import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import TextArea from "../../../components/molecules/textarea"
import SideModal from "../../../components/molecules/modal/side-modal"
import { NextSelect } from "../../../components/molecules/select/next-select"
import useNotification from "../../../hooks/use-notification"
import { Option } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import TreeCrumbs from "../components/tree-crumbs"

const visibilityOptions: (t: TFunction) => Option[] = (t) => [
  {
    label: "Public",
    value: "public",
  },
  { label: "Private", value: "private" },
]

const statusOptions: (t: TFunction) => Option[] = (t) => [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

type EditProductCategoriesSideModalProps = {
  activeCategory: ProductCategory
  close: () => void
  isVisible: boolean
}

/**
 * Modal for editing product categories
 */
function EditProductCategoriesSideModal(
  props: EditProductCategoriesSideModalProps
) {
  const { isVisible, close, activeCategory, categories } = props

  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isPublic, setIsPublic] = useState(true)

  const { t } = useTranslation()
  const notification = useNotification()

  const { mutateAsync: updateCategory } = useAdminUpdateProductCategory(
    activeCategory?.id
  )

  useEffect(() => {
    if (activeCategory) {
      setName(activeCategory.name)
      setHandle(activeCategory.handle)
      setDescription(activeCategory.description)
      setIsActive(activeCategory.is_active)
      setIsPublic(!activeCategory.is_internal)
    }
  }, [activeCategory])

  const onSave = async () => {
    try {
      await updateCategory({
        name,
        handle,
        description,
        is_active: isActive,
        is_internal: !isPublic,
      })

      notification(
        t("modals-success", "Success"),
        t(
          "modals-successfully-updated-the-category",
          "Successfully updated the category"
        ),
        "success"
      )
      close()
    } catch (e) {
      const errorMessage =
        getErrorMessage(e) ||
        t(
          "modals-failed-to-update-the-category",
          "Failed to update the category"
        )
      notification(t("modals-error", "Error"), errorMessage, "error")
    }
  }

  const onClose = () => {
    close()
  }

  return (
    <SideModal close={onClose} isVisible={!!isVisible}>
      <div className="flex h-full flex-col justify-between">
        {/* === HEADER === */}
        <div className="flex items-center justify-between p-6">
          <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900">
            {t("modals-edit-product-category", "Edit product category")}
          </h3>
          <Button
            variant="secondary"
            className="h-8 w-8 p-2"
            onClick={props.close}
          >
            <CrossIcon size={20} className="text-grey-50" />
          </Button>
        </div>

        {/* === DIVIDER === */}
        <div className="block h-[1px] bg-gray-200" />

        {activeCategory && (
          <div className="mt-[25px] px-6">
            <TreeCrumbs nodes={categories} currentNode={activeCategory} />
          </div>
        )}

        <div className="flex-grow px-6">
          <InputField
            required
            label={t("modals-name", "Name")}
            type="string"
            name="name"
            value={name}
            className="my-6"
            placeholder={t(
              "modals-give-this-category-a-name",
              "Give this category a name"
            )}
            onChange={(ev) => setName(ev.target.value)}
          />

          <InputField
            required
            label={t("modals-handle", "Handle")}
            type="string"
            name="handle"
            value={handle}
            className="my-6"
            placeholder={t("modals-custom-handle", "Custom handle")}
            onChange={(ev) => setHandle(ev.target.value)}
          />

          <TextArea
            label={t("modals-description", "Description")}
            name="description"
            value={description}
            className="my-6"
            placeholder={t(
              "modals-give-this-category-a-description",
              "Give this category a description"
            )}
            onChange={(ev) => setDescription(ev.target.value)}
          />

          <NextSelect
            label={t("modals-status", "Status")}
            options={statusOptions(t)}
            value={statusOptions(t)[isActive ? 0 : 1]}
            onChange={(o) => setIsActive(o.value === "active")}
          />

          <NextSelect
            className="my-6"
            label={t("modals-visibility", "Visibility")}
            options={visibilityOptions(t)}
            value={visibilityOptions(t)[isPublic ? 0 : 1]}
            onChange={(o) => setIsPublic(o.value === "public")}
          />
        </div>

        {/* === DIVIDER === */}
        <div className="block h-[1px] bg-gray-200" />

        {/* === FOOTER === */}
        <div className="flex justify-end gap-2 p-3">
          <Button size="small" variant="ghost" onClick={onClose}>
            {t("modals-cancel", "Cancel")}
          </Button>
          <Button size="small" variant="primary" onClick={onSave}>
            {t("modals-save-and-close", "Save and close")}
          </Button>
        </div>
      </div>
    </SideModal>
  )
}

export default EditProductCategoriesSideModal
