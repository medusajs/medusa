import { CustomerGroup } from "@medusajs/medusa"
import {
  useAdminCreateCustomerGroup,
  useAdminUpdateCustomerGroup,
} from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  CustomerGroupGeneralForm,
  CustomerGroupGeneralFormType,
} from "../../../components/forms/customer-group/customer-group-general-form"
import MetadataForm, {
  getMetadataFormValues,
  getSubmittableMetadata,
  MetadataFormType,
} from "../../../components/forms/general/metadata-form"

import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"

type CustomerGroupModalProps = {
  open: boolean
  customerGroup?: CustomerGroup
  onClose: () => void
}

type CustomerGroupModalFormType = {
  general: CustomerGroupGeneralFormType
  metadata: MetadataFormType
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

  const { mutate: update, isLoading: isUpdating } = useAdminUpdateCustomerGroup(
    customerGroup?.id!
  )
  const { mutate: create, isLoading: isCreating } =
    useAdminCreateCustomerGroup()

  const notification = useNotification()

  const { reset, handleSubmit: handleFormSubmit } = form

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(customerGroup))
    }
  }, [customerGroup, open, reset])

  const onSubmit = handleFormSubmit((data) => {
    const { general, metadata } = data

    const onSuccess = () => {
      const title = customerGroup ? "Group Updated" : "Group Created"
      const msg = customerGroup
        ? "The customer group has been updated"
        : "The customer group has been created"

      notification(title, msg, "success")

      onClose()
    }

    const onError = (err: Error) => {
      notification("Error", getErrorMessage(err), "error")
    }

    if (customerGroup) {
      update(
        {
          name: general.name,
          metadata: getSubmittableMetadata(metadata),
        },
        {
          onSuccess,
          onError,
        }
      )
    } else {
      create(
        {
          name: general.name,
          metadata: getSubmittableMetadata(metadata),
        },
        {
          onSuccess,
          onError,
        }
      )
    }

    onClose()
  })

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <span className="inter-xlarge-semibold">
            {customerGroup ? "Edit" : "Create a New"} Customer Group
          </span>
        </Modal.Header>

        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="gap-y-xlarge flex flex-col">
              <div>
                <h2 className="inter-base-semibold mb-base">Details</h2>
                <CustomerGroupGeneralForm form={nestedForm(form, "general")} />
              </div>
              <div>
                <h2 className="inter-base-semibold mb-base">Metadata</h2>
                <MetadataForm form={nestedForm(form, "metadata")} />
              </div>
            </div>
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

  return {
    general: {
      name: initialData.name,
    },
    metadata: getMetadataFormValues(initialData.metadata),
  }
}

export default CustomerGroupModal
