import { Order } from "@medusajs/medusa"
import { useAdminRegion } from "medusa-react"
import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import { useLayeredModal } from "../../../../components/molecules/modal/layered-modal"
import AddressForm, {
  AddressPayload,
  AddressType,
} from "../../../../components/templates/address-form"
import { NestedForm } from "../../../../utils/nested-form"

type Props = {
  form: NestedForm<AddressPayload>
  order: Order
}

const ShippingAddressFormScreen = ({ form, order }: Props) => {
  const {
    resetField,
    path,
    formState: { errors },
    control,
  } = form
  const { region } = useAdminRegion(order.region_id)

  const subscriber = useWatch({
    control,
    name: path(),
  })

  const isValid = useMemo(() => {
    const fieldsToValidate = [
      "first_name",
      "last_name",
      "address_1",
      "city",
      "country_code",
      "postal_code",
      "country_code",
    ] as const

    const isValid = fieldsToValidate.every((field) => {
      return !!subscriber[field] && !errors[path(field)]
    })

    return isValid
  }, [subscriber, errors, path])

  const countryOptions = useMemo(() => {
    return (
      region?.countries.map((c) => ({
        value: c.iso_2,
        label: c.display_name,
      })) || []
    )
  }, [region])

  const { pop } = useLayeredModal()

  const cancelAndPop = () => {
    resetField(path())
    pop()
  }

  return (
    <>
      <Modal.Content>
        <AddressForm
          form={form}
          type={AddressType.SHIPPING}
          countryOptions={countryOptions}
          required={true}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full items-center justify-end gap-x-xsmall">
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={cancelAndPop}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="small"
            disabled={!isValid}
            type="button"
            onClick={pop}
          >
            Save and go back
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export const useShippingAddressFormScreen = () => {
  const { pop, push } = useLayeredModal()

  const pushScreen = (props: Props) => {
    push({
      title: "Shipping Information",
      onBack: () => pop(),
      view: <ShippingAddressFormScreen {...props} />,
    })
  }

  return { pushScreen }
}
