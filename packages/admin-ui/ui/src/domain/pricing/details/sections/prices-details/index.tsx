import { Product } from "@medusajs/medusa"
import * as React from "react"
import { useTranslation } from "react-i18next"
import Fade from "../../../../../components/atoms/fade-wrapper"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import UploadIcon from "../../../../../components/fundamentals/icons/upload-icon"
import BodyCard from "../../../../../components/organisms/body-card"
import useToggleState from "../../../../../hooks/use-toggle-state"
import EditPrices from "./edit-prices"
import EditPricesOverridesModal from "./edit-prices-overrides"
import ImportPrices from "../../../batch-job/import"
import PricesTable from "./prices-table"

const Prices = ({ id }) => {
  const { t } = useTranslation()
  const { state: showEdit, open: openEdit, close: closeEdit } = useToggleState()
  const [showUpload, openUpload, closeUpload] = useToggleState()
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  )
  const actionables = [
    {
      label: t("prices-details-edit-manually", "Edit manually"),
      onClick: openEdit,
      icon: <EditIcon size={20} />,
    },
    {
      label: t("prices-details-import-price-list", "Import price list"),
      onClick: openUpload,
      icon: <UploadIcon size={20} />,
    },
  ]
  return (
    <BodyCard title="Prices" actionables={actionables} forceDropdown>
      <PricesTable id={id} selectProduct={setSelectedProduct} />
      <Fade isVisible={showEdit} isFullScreen={true}>
        <EditPrices close={closeEdit} id={id} />{" "}
      </Fade>
      {showUpload && (
        <ImportPrices priceListId={id} handleClose={() => closeUpload()} />
      )}
      {selectedProduct && (
        <EditPricesOverridesModal
          product={selectedProduct}
          close={() => setSelectedProduct(null)}
        />
      )}
    </BodyCard>
  )
}

export default Prices
