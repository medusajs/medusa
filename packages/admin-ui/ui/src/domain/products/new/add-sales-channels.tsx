import { SalesChannel } from "@medusajs/medusa"
import clsx from "clsx"
import { useAdminStore } from "medusa-react"
import { useEffect, useState } from "react"
import { useFieldArray } from "react-hook-form"
import Switch from "../../../components/atoms/switch"
import SalesChannelsModal from "../../../components/forms/product/sales-channels-modal"
import Button from "../../../components/fundamentals/button"
import ChannelsIcon from "../../../components/fundamentals/icons/channels-icon"
import SalesChannelsDisplay from "../../../components/molecules/sales-channels-display"
import useToggleState from "../../../hooks/use-toggle-state"
import { NestedForm } from "../../../utils/nested-form"

export type AddSalesChannelsFormType = {
  channels: SalesChannel[]
}

type Props = {
  form: NestedForm<AddSalesChannelsFormType>
}

const AddSalesChannelsForm = ({ form }: Props) => {
  const { control, path } = form
  const [removedDefaultSalesChannel, setRemovedDefaultSalesChannel] =
    useState(false)

  const { fields, replace, append } = useFieldArray({
    control,
    name: path("channels"),
    keyName: "fieldId",
  })

  const { state: isEnabled, toggle: toggleEnabled } = useToggleState()
  const {
    state: open,
    toggle: toggleModal,
    close: closeModal,
  } = useToggleState()
  const { store } = useAdminStore()

  const onAddChannels = (channels: SalesChannel[]) => {
    if (store?.default_sales_channel) {
      if (!channels.find(({ id }) => id === store.default_sales_channel.id)) {
        setRemovedDefaultSalesChannel(true)
      }
    }

    replace(channels)
  }

  useEffect(() => {
    if (store?.default_sales_channel && fields) {
      const alreadyAdded = fields.find(
        ({ id }) => id === store.default_sales_channel.id
      )

      if (!alreadyAdded && !removedDefaultSalesChannel) {
        append(store.default_sales_channel)
      }

      /**
       * In case the default sales channel is added more than once, we remove the duplicates.
       */
      const duplicates = fields.filter(
        (channel, index) =>
          fields.findIndex((c) => c.id === channel.id) !== index
      )

      if (duplicates.length > 0) {
        replace(fields.filter((channel) => !duplicates.includes(channel)))
      }
    }
  }, [store, append, fields, replace, removedDefaultSalesChannel])

  return (
    <>
      <div>
        <div>
          <div className="flex items-center justify-between">
            <h2 className="inter-base-semibold">Sales channels</h2>
            <Switch checked={isEnabled} onCheckedChange={toggleEnabled} />
          </div>
          <p className="inter-base-regular text-grey-50 mt-2xsmall">
            This product will only be available in the default sales channel if
            left untouched.
          </p>
        </div>
        <div
          className={clsx({
            hidden: !isEnabled,
          })}
        >
          <div className="mt-base">
            <SalesChannelsDisplay channels={fields} />
          </div>
          <Button
            variant="secondary"
            className="mt-large h-[40px] w-full"
            type="button"
            onClick={toggleModal}
          >
            <ChannelsIcon size={20} />
            <span>Change availablity</span>
          </Button>
        </div>
      </div>
      <SalesChannelsModal
        source={fields}
        open={open}
        onClose={closeModal}
        onSave={onAddChannels}
      />
    </>
  )
}

export default AddSalesChannelsForm
