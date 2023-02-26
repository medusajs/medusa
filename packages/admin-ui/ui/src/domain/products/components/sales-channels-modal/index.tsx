import { SalesChannel } from "@medusajs/medusa"
import React from "react"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../components/molecules/modal/layered-modal"
import AvailableScreen from "./available-screen"
import { SalesChannelsModalContext } from "./use-sales-channels-modal"

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
  const context = React.useContext(LayeredModalContext)

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
            <h1 className="inter-xlarge-semibold">Current Sales Channels</h1>
          </Modal.Header>
          <AvailableScreen />
          <Modal.Footer>
            <div className="flex items-center justify-end w-full">
              <Button
                variant="primary"
                size="small"
                type="button"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </LayeredModal>
    </SalesChannelsModalContext.Provider>
  )
}

export default SalesChannelsModal
