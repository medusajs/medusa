import { useTranslation } from "react-i18next"
import Button from "../../../components/fundamentals/button"
import SidedMouthFaceIcon from "../../../components/fundamentals/icons/sided-mouth-face"

function Placeholder({ showAddModal }) {
  const { t } = useTranslation()
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <span className="text-grey-50">
        <SidedMouthFaceIcon width="48" height="48" />
      </span>

      <h3 className="text-large text-gray-90 mt-6 font-semibold">
        {t(
          "tables-start-building-your-channels-setup",
          "Start building your channels setup..."
        )}
      </h3>
      <p className="text-grey-50 mt-2 mb-8 w-[358px] text-center">
        {t(
          "tables-no-products-in-channels",
          "You haven\u2019t added any products to this channels yet, but once you do they will live here."
        )}
      </p>

      <Button onClick={showAddModal} variant="primary" size="small">
        {t("tables-add-products", "Add products")}
      </Button>
    </div>
  )
}

export default Placeholder
