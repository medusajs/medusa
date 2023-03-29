import { CustomerGroup } from "@medusajs/medusa"
import { useForm } from "react-hook-form"
import {
  CustomerGroupGeneralForm,
  CustomerGroupGeneralFormType,
} from "../../../components/forms/customer-groups/customer-group-general-form"
import { getMetadataFormValues } from "../../../components/forms/general/metadata-form"

import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import { nestedForm } from "../../../utils/nested-form"

type CustomerGroupModalProps = {
  open: boolean
  customerGroup?: CustomerGroup
  onClose: () => void
}

type CustomerGroupModalFormType = {
  form: CustomerGroupGeneralFormType
}

/*
 * A modal for crating/editing customer groups.
 */
function CustomerGroupModal({
  customerGroup,
  onClose,
  open,
}: CustomerGroupModalProps) {
  const form = useForm<CustomerGroupModalFormType>({
    defaultValues: getDefaultValues(customerGroup),
  })

  const { register, handleSubmit: handleFormSubmit } = form

  const onSubmit = handleFormSubmit((data) => {})

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <span className="inter-xlarge-semibold">
            {customerGroup ? "Edit" : "Create a New"} Customer Group
          </span>
        </Modal.Header>

        <form>
          <Modal.Content>
            <CustomerGroupGeneralForm form={nestedForm(form, "form")} />
          </Modal.Content>

          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full justify-end">
              <Button
                variant="secondary"
                className="text-small mr-2 w-32 justify-center"
                size="small"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button size="small" variant="primary" type="submit">
                <span>{customerGroup ? "Edit" : "Publish"} Group</span>
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (
  initialData?: CustomerGroup
): CustomerGroupModalFormType | undefined => {
  if (!initialData) {
    return undefined
  }

  console.log(initialData.metadata)

  return {
    form: {
      name: initialData.name,
      metadata: getMetadataFormValues(initialData.metadata),
    },
  }
}

export default CustomerGroupModal
