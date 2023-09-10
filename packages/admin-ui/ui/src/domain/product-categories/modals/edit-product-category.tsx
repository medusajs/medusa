import { ProductCategory as BaseCategory } from "@medusajs/medusa"
import { useAdminUpdateProductCategory } from "medusa-react"
import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

import { useEffect, useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputHeader from "../../../components/fundamentals/input-header"
import InputField from "../../../components/molecules/input"
import SideModal from "../../../components/molecules/modal/side-modal"
import { NextSelect } from "../../../components/molecules/select/next-select"
import useNotification from "../../../hooks/use-notification"
import { Option } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import TreeCrumbs from "../components/tree-crumbs"

const visibilityOptions: (t: TFunction) => Option[] = (t) => [
  {
    label: t("Public"),
    value: "public",
  },
  { label: t("Private"), value: "private" },
]

type ProductCategory = BaseCategory & {
  name_ar: string
  handle_ar: string
  description_ar: string
}

const statusOptions:  (t: TFunction) => Option[] = (t) => [
  { label: t("Active"), value: "active" },
  { label: t("Inactive"), value: "inactive" },
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
  const [name_ar, setNameAr] = useState("")
  const [handle, setHandle] = useState("")
  const [handle_ar, setHandleAr] = useState("")
  const [description, setDescription] = useState("")
  const [description_ar, setDescriptionAr] = useState("")
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
      setNameAr(activeCategory.name_ar)
      setHandle(activeCategory.handle)
      setHandleAr(activeCategory.handle_ar)
      setDescription(activeCategory.description)
      setDescriptionAr(activeCategory.description_ar)
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
        name_ar,
        description_ar,
        handle_ar,
        is_active: isActive,
        is_internal: !isPublic,
      })

      notification(
        t("Success"),
        t("Successfully updated the category"),
        "success"
      )
      close()
    } catch (e) {
      const errorMessage =
        getErrorMessage(e) || t("Failed to update the category")
      notification(t("Error"), errorMessage, "error")
    }
  }

  const onClose = () => {
    close()
  }

  return (
    <SideModal close={onClose} isVisible={!!isVisible} customWidth={200}>
      <div className="flex h-full flex-col justify-between">
        {/* === HEADER === */}
        <div className="flex items-center justify-between p-6">
          <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900">
            {t("Edit product category")}
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
            label={t("Name in Engilish")}
            type="string"
            name="name"
            value={name}
            className="my-6"
            placeholder={t("Give this category a name")}
            onChange={(ev) => setName(ev.target.value)}
          />

          <InputField
            required
            label={t("Handle in Engilish")}
            type="string"
            name="handle"
            value={handle}
            className="my-6"
            placeholder={t("Custom handle")}
            onChange={(ev) => setHandle(ev.target.value)}
          />

          <div className="medium:flex-row mb-8 flex flex-col justify-between gap-6">
            <InputField
              required
              label={t("Name in arabic")}
              type="string"
              name="name_ar"
              value={name_ar}
              className="w-[338px]"
              placeholder="التجميل"
              onChange={(ev) => setNameAr(ev.target.value)}
            />

            <InputField
              label={t("Handle in arabic")}
              type="string"
              name="handle_ar"
              value={handle_ar}
              className="w-[338px]"
              placeholder="صنف-التجميل"
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

          <NextSelect
            label={t("Status")}
            options={statusOptions(t)}
            value={statusOptions(t)[isActive ? 0 : 1]}
            onChange={(o) => setIsActive(o.value === "active")}
          />

          <NextSelect
            className="my-6"
            label={t("Visibility")}
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
            {t("Cancel")}
          </Button>
          <Button size="small" variant="primary" onClick={onSave}>
            {t("Save and close")}
          </Button>
        </div>
      </div>
    </SideModal>
  )
}

export default EditProductCategoriesSideModal
