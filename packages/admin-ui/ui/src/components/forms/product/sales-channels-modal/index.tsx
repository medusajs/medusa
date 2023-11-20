import { SalesChannel } from "@medusajs/medusa"
import Button from "../../../fundamentals/button"
import Modal from "../../../molecules/modal"
import LayeredModal, {
  useLayeredModal,
} from "../../../molecules/modal/layered-modal"
import AvailableScreen from "./available-screen"
import { SalesChannelsModalContext } from "./use-sales-channels-modal"
import { useTranslation } from "react-i18next"
type Props = {
  open: boolean
  source?: SalesChannel[]
  onClose: () => void
  onSave: (salesChannels: SalesChannel[]) => void
}

/**
 * Re-usable Sales Channels Modal, used for adding and editing sales channels both when creating a new product and editing an existing product.
 */
const SalesChannelsModal = ({ open, source = [], onClose, onSave }: Props) => {
  const context = useLayeredModal()
  const { t } = useTranslation()
  return (
    <SalesChannelsModalContext.Provider
      value={{
        source,
        onClose,
        onSave,
      }}
    >
      <LayeredModal open={open} handleClose={onClose} context={context}>
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            <h1 className="inter-xlarge-semibold">
              {t("Current Sales Channels")}
            </h1>
          </Modal.Header>
          <AvailableScreen />
          <Modal.Footer>
            <div className="flex w-full items-center justify-end">
              <Button
                variant="primary"
                size="small"
                type="button"
                onClick={onClose}
              >
                {t("Close")}
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </LayeredModal>
    </SalesChannelsModalContext.Provider>
  )
}

export default SalesChannelsModal
