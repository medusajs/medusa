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
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
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
      const title = customerGroup
        ? t("groups-group-updated", "Group Updated")
        : t("groups-group-created", "Group Created")
      const msg = customerGroup
        ? t(
            "groups-the-customer-group-has-been-updated",
            "The customer group has been updated"
          )
        : t(
            "groups-the-customer-group-has-been-created",
            "The customer group has been created"
          )

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
            {customerGroup
              ? t("groups-edit-customer-group", "Edit Customer Group")
              : t(
                  "groups-create-a-new-customer-group",
                  "Create a New Customer Group"
                )}
          </span>
        </Modal.Header>

        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="gap-y-xlarge flex flex-col">
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("groups-details", "Details")}
                </h2>
                <CustomerGroupGeneralForm form={nestedForm(form, "general")} />
              </div>
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("groups-metadata", "Metadata")}
                </h2>
                <MetadataForm form={nestedForm(form, "metadata")} />
              </div>
            </div>
          </Modal.Content>

          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full justify-end">
              <Button
                variant="secondary"
                className="text-small me-2 w-32 justify-center"
                size="small"
                type="button"
                onClick={onClose}
              >
                {t("groups-cancel", "Cancel")}
              </Button>
              <Button size="small" variant="primary" type="submit">
                <span>
                  {customerGroup
                    ? t("groups-edit-group", "Edit Group")
                    : t("groups-publish-group", "Publish Group")}
                </span>
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
