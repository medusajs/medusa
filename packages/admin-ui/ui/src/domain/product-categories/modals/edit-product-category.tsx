import { ProductCategory as BaseCategory } from "@medusajs/medusa"
import { useAdminUpdateProductCategory } from "medusa-react"
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

const visibilityOptions: Option[] = [
  {
    label: "Public",
    value: "public",
  },
  { label: "Private", value: "private" },
]

type ProductCategory = BaseCategory & {
  name_ar: string
  handle_ar: string
  description_ar: string
}

const statusOptions: Option[] = [
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
  const [name_ar, setNameAr] = useState("")
  const [handle, setHandle] = useState("")
  const [handle_ar, setHandleAr] = useState("")
  const [description, setDescription] = useState("")
  const [description_ar, setDescriptionAr] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isPublic, setIsPublic] = useState(true)

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
        is_active: isActive,
        is_internal: !isPublic,
      })

      notification("Success", "Successfully updated the category", "success")
      close()
    } catch (e) {
      const errorMessage = getErrorMessage(e) || "Failed to update the category"
      notification("Error", errorMessage, "error")
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
            Edit product category
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
            label="Name"
            type="string"
            name="name"
            value={name}
            className="my-6"
            placeholder="Give this category a name"
            onChange={(ev) => setName(ev.target.value)}
          />

          <InputField
            required
            label="Handle"
            type="string"
            name="handle"
            value={handle}
            className="my-6"
            placeholder="Custom handle"
            onChange={(ev) => setHandle(ev.target.value)}
          />

          <div className="mb-8 flex justify-between gap-6">
            <InputField
              required
              label="Name in arabic"
              type="string"
              name="name_ar"
              value={name_ar}
              className="w-[338px]"
              placeholder="الإسم"
              onChange={(ev) => setNameAr(ev.target.value)}
            />

            <InputField
              label="Handle in arabic"
              type="string"
              name="handle_ar"
              value={handle_ar}
              className="w-[338px]"
              placeholder="Custom handle in arabic"
              onChange={(ev) => setHandleAr(ev.target.value)}
            />
          </div>

          <div className="mb-8">
            <InputHeader label="Description" className="mb-xsmall" />
            <ReactQuill
              theme="snow"
              value={description}
              onChange={(value) => setDescription(value)}
            />
          </div>

          <div className="mb-8">
            <InputHeader label="Description in arabic" className="mb-xsmall" />
            <ReactQuill
              theme="snow"
              value={description_ar}
              onChange={(value) => setDescriptionAr(value)}
            />
          </div>

          <NextSelect
            label="Status"
            options={statusOptions}
            value={statusOptions[isActive ? 0 : 1]}
            onChange={(o) => setIsActive(o.value === "active")}
          />

          <NextSelect
            className="my-6"
            label="Visibility"
            options={visibilityOptions}
            value={visibilityOptions[isPublic ? 0 : 1]}
            onChange={(o) => setIsPublic(o.value === "public")}
          />
        </div>

        {/* === DIVIDER === */}
        <div className="block h-[1px] bg-gray-200" />

        {/* === FOOTER === */}
        <div className="flex justify-end gap-2 p-3">
          <Button size="small" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button size="small" variant="primary" onClick={onSave}>
            Save and close
          </Button>
        </div>
      </div>
    </SideModal>
  )
}

export default EditProductCategoriesSideModal
