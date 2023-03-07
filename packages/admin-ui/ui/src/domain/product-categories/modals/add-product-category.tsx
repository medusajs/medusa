import { useState } from "react"

import { ProductCategory } from "@medusajs/medusa"
import {
  adminProductCategoryKeys,
  useAdminCreateProductCategory,
} from "medusa-react"

import useNotification from "../../../hooks/use-notification"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import Select from "../../../components/molecules/select"
import { useQueryClient } from "@tanstack/react-query"

const visibilityOptions = [
  {
    label: "Public",
    value: "public",
  },
  { label: "Private", value: "private" },
]

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

type CreateProductCategoryProps = {
  closeModal: () => void
  parentCategory?: ProductCategory
}

/**
 * Focus modal container for creating Publishable Keys.
 */
function CreateProductCategory(props: CreateProductCategoryProps) {
  const { closeModal, parentCategory } = props
  const notification = useNotification()
  const queryClient = useQueryClient()

  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isPublic, setIsPublic] = useState(true)

  const { mutateAsync: createProductCategory } = useAdminCreateProductCategory()

  const onSubmit = async () => {
    try {
      await createProductCategory({
        name,
        handle,
        is_active: isActive,
        is_internal: !isPublic,
        parent_category_id: parentCategory?.id ?? null,
      })
      // TODO: temporary here, investigate why `useAdminCreateProductCategory` doesn't invalidate this
      await queryClient.invalidateQueries(adminProductCategoryKeys.lists())
      closeModal()
      notification("Success", "Created a new product category", "success")
    } catch (e) {
      notification("Error", "Failed to create a new product category", "error")
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
              Save category
            </Button>
          </div>
        </div>
      </FocusModal.Header>

      <FocusModal.Main className="no-scrollbar flex w-full justify-center">
        <div className="small:w-4/5 medium:w-7/12 large:w-6/12 my-16 max-w-[700px]">
          <h1 className="inter-xlarge-semibold text-grey-90 pb-8">
            Add category {parentCategory && `to ${parentCategory.name}`}
          </h1>
          <h4 className="inter-large-semibold text-grey-90 pb-1">Details</h4>

          <div className="mb-8 flex justify-between gap-6">
            <InputField
              label="Name"
              type="string"
              name="name"
              value={name}
              className="w-[338px]"
              placeholder="Give this category a name"
              onChange={(ev) => setName(ev.target.value)}
            />

            <InputField
              label="Handle"
              type="string"
              name="handle"
              value={handle}
              className="w-[338px]"
              placeholder="Custom handle"
              onChange={(ev) => setHandle(ev.target.value)}
            />
          </div>

          <div className="mb-8 flex justify-between gap-6">
            <div className="flex-1">
              <Select
                label="Status"
                options={statusOptions}
                menuPortalStyles={{ zIndex: 300 }}
                value={statusOptions[isActive ? 0 : 1]}
                onChange={(o) => setIsActive(o.value === "active")}
              />
            </div>

            <div className="flex-1">
              <Select
                label="Visibility"
                options={visibilityOptions}
                menuPortalStyles={{ zIndex: 300 }}
                value={visibilityOptions[isPublic ? 0 : 1]}
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
