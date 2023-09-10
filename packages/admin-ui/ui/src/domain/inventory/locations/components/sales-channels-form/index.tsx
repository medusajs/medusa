import { SalesChannel, StockLocationExpandedDTO } from "@medusajs/medusa"
import { useFieldArray } from "react-hook-form"
import { useTranslation } from "react-i18next"
import SalesChannelsModal from "../../../../../components/forms/product/sales-channels-modal"
import Button from "../../../../../components/fundamentals/button"
import SalesChannelsList from "../../../../../components/molecules/sales-channels-list"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { NestedForm } from "../../../../../utils/nested-form"
import { AddSalesChannelsFormType } from "../../../../products/new/add-sales-channels"

const SalesChannelsForm = ({
  location,
  form,
}: {
  location: StockLocationExpandedDTO | null
  form: NestedForm<AddSalesChannelsFormType>
}) => {
  const { t } = useTranslation()
  const {
    state: showSalesChannelsModal,
    close: closeSalesChannelsModal,
    open: openSalesChannelsModal,
  } = useToggleState()

  const { control, path } = form

  const { fields, replace } = useFieldArray({
    control,
    name: path("channels"),
    keyName: "fieldId",
  })

  const onClose = () => {
    closeSalesChannelsModal()
  }

  const onChannelsSave = (channels: SalesChannel[]) => replace(channels)

  return (
    <>
      {!location?.sales_channels && !fields.length ? (
        <Button
          variant="secondary"
          className="w-full"
          size="small"
          onClick={openSalesChannelsModal}
          type="button"
        >
          {t("sales-channels-form-add-sales-channels", "Add sales channels")}
        </Button>
      ) : (
        <div className="flex w-full items-center justify-between">
          <SalesChannelsList
            salesChannels={location?.sales_channels || fields}
            showMax={1}
          />
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={openSalesChannelsModal}
          >
            {t("sales-channels-form-edit-channels", "Edit channels")}
          </Button>
        </div>
      )}
      <SalesChannelsModal
        open={showSalesChannelsModal}
        source={fields}
        onClose={onClose}
        onSave={onChannelsSave}
      />
    </>
  )
}

export default SalesChannelsForm
