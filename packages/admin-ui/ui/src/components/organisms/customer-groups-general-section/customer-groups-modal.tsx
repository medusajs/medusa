import { CustomerGroup } from "@medusajs/medusa"
import Modal from "../../molecules/modal"

type CustomerGroupsModalProps = {
  open: boolean
  onClose: () => void
  customerGroup?: CustomerGroup
  isEdit?: boolean
}

const CustomerGroupsModal = ({
  open,
  onClose,
  customerGroup,
}: CustomerGroupsModalProps) => {
  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header></Modal.Header>
      </Modal.Body>
    </Modal>
  )
}
