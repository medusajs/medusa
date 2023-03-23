import { Product } from "@medusajs/medusa"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import useEditProductActions from "../../../hooks/use-edit-product-actions"
import { countries } from "../../../utils/countries"
import { nestedForm } from "../../../utils/nested-form"
import CustomsForm, { CustomsFormType } from "../../forms/product/customs-form"
import DimensionsForm, {
  DimensionsFormType,
} from "../../forms/product/dimensions-form"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

type AttributesForm = {
  dimensions: DimensionsFormType
  customs: CustomsFormType
}

const AttributeModal = ({ product, open, onClose }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const form = useForm<AttributesForm>({
    defaultValues: getDefaultValues(product),
  })
  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product])

  const onReset = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    onUpdate(
      {
        // @ts-ignore
        weight: data.dimensions.weight,
        // @ts-ignore
        width: data.dimensions.width,
        // @ts-ignore
        height: data.dimensions.height,
        // @ts-ignore
        length: data.dimensions.length,
        // @ts-ignore
        mid_code: data.customs.mid_code,
        // @ts-ignore
        hs_code: data.customs.hs_code,
        origin_country: data.customs.origin_country?.value,
      },
      onReset
    )
  })

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">Edit Attributes</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="mb-xlarge">
              <h2 className="inter-large-semibold mb-2xsmall">Dimensions</h2>
              <p className="inter-base-regular text-grey-50 mb-large">
                Configure to calculate the most accurate shipping rates
              </p>
              <DimensionsForm form={nestedForm(form, "dimensions")} />
            </div>
            <div>
              <h2 className="inter-large-semibold mb-2xsmall">Customs</h2>
              <p className="inter-base-regular text-grey-50 mb-large">
                Configure to calculate the most accurate shipping rates
              </p>
              <CustomsForm form={nestedForm(form, "customs")} />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end gap-x-2">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updating}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): AttributesForm => {
  const country = countries.find(
    (country) => country.alpha2 === product.origin_country
  )
  const countryOption = country
    ? { label: country.name, value: country.alpha2 }
    : null

  return {
    dimensions: {
      weight: product.weight,
      width: product.width,
      height: product.height,
      length: product.length,
    },
    customs: {
      mid_code: product.mid_code,
      hs_code: product.hs_code,
      origin_country: countryOption,
    },
  }
}

export default AttributeModal
