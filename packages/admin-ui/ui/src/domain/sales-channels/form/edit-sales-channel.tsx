import { useAdminUpdateSalesChannel } from "medusa-react"
import { useState } from "react"

import { SalesChannel } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"

import Button from "../../../components/fundamentals/button"
import InputField from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"

type EditSalesChannelProps = {
  salesChannel: SalesChannel
  handleClose: () => void
}

/**
 * Modal with sales channels edit form.
 */
function EditSalesChannel(props: EditSalesChannelProps) {
  const { handleClose, salesChannel } = props

  const notification = useNotification()
  const { t } = useTranslation()

  const { mutate: updateSalesChannel, isLoading } = useAdminUpdateSalesChannel(
    salesChannel.id
  )

  const [name, setName] = useState(salesChannel.name)
  const [description, setDescription] = useState(salesChannel.description)

  const handleSubmit = () => {
    updateSalesChannel(
      { name, description },
      {
        onSuccess: () => {
          notification(
            t("form-success", "Success"),
            t(
              "form-the-sales-channel-is-successfully-updated",
              "The sales channel is successfully updated"
            ),
            "success"
          )
          handleClose()
        },
        onError: () =>
          notification(
            t("form-error", "Error"),
            t(
              "form-failed-to-update-the-sales-channel",
              "Failed to update the sales channel"
            ),
            "error"
          ),
      }
    )
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">
            {t("form-sales-channel-details", "Sales channel details")}
          </span>
        </Modal.Header>
        <Modal.Content>
          <div className="inter-base-semibold text-grey-90 mb-4">
            {t("form-general-info", "General info")}
          </div>

          <div className="flex w-full flex-col gap-3">
            <InputField
              label={t("form-name", "Name")}
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              label={t("form-description", "Description")}
              name="description"
              value={description!}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              {t("form-close", "Close")}
            </Button>
            <Button
              disabled={!name.length || isLoading}
              variant="primary"
              className="min-w-[100px]"
              size="small"
              onClick={handleSubmit}
              loading={isLoading}
            >
              {t("form-save", "Save")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditSalesChannel
