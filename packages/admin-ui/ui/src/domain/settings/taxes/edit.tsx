import { useAdminTaxRate } from "medusa-react"
import React, { useContext } from "react"
import Spinner from "../../../components/atoms/spinner"
import Modal from "../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import EditForm, { SimpleEditForm } from "./edit-form"

const EditTaxRate = ({ taxRate, taxRateId, regionId, onDismiss }) => {
  const { isLoading, tax_rate } = useAdminTaxRate(
    taxRateId,
    {
      expand: ["products", "product_types", "shipping_options"],
    },
    {
      enabled: taxRate.type === "rate",
    }
  )

  const layeredModalContext = useContext(LayeredModalContext)

  return (
    <LayeredModal
      isLargeModal
      context={layeredModalContext}
      handleClose={onDismiss}
    >
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <div>
            <h1 className="inter-xlarge-semibold">Edit Tax Rate</h1>
          </div>
        </Modal.Header>
        {taxRate.type === "region" ? (
          <SimpleEditForm taxRate={taxRate} onDismiss={onDismiss} />
        ) : isLoading || !tax_rate ? (
          <Spinner />
        ) : (
          <EditForm
            regionId={regionId}
            modalContext={layeredModalContext}
            taxRate={tax_rate}
            onDismiss={onDismiss}
          />
        )}
      </Modal.Body>
    </LayeredModal>
  )
}

export default EditTaxRate
