import Button from "../../fundamentals/button"
import UploadIcon from "../../fundamentals/icons/upload-icon"
import Actionables from "../actionables"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"

export interface ProductImportButtonProps {
  openModal: (type: "csv" | "etsy") => void
}

const ProductImportButton = ({ openModal }: ProductImportButtonProps) => {
  return (
    <Actionables
      customTrigger={
        <Button variant="secondary" size="small">
          <UploadIcon size={20} />
          Import Products
          <ChevronDownIcon size="16" />
        </Button>
      }
      actions={[
        { label: "CSV", onClick: () => openModal("csv") },
        { label: "Etsy", onClick: () => openModal("etsy") },
      ]}
    />
  )
}

export default ProductImportButton
