import { SalesChannel, StockLocationExpandedDTO } from "@medusajs/medusa"
import { useFieldArray } from "react-hook-form"
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
          Add sales channels
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
            Edit channels
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
