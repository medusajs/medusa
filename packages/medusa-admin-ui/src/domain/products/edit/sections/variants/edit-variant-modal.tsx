import { Product, ProductVariant } from "@medusajs/medusa"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { countries } from "../../../../../utils/countries"
import EditFlowVariantForm, {
  EditFlowVariantFormType,
} from "../../../components/variant-form/edit-flow-variant-form"
import useEditProductActions from "../../hooks/use-edit-product-actions"
import { createAddPayload } from "./add-variant-modal"
import { createUpdatePayload } from "./edit-variants-modal/edit-variant-screen"

type Props = {
  onClose: () => void
  product: Product
  variant: ProductVariant
  isDuplicate?: boolean
}

const EditVariantModal = ({
  onClose,
  product,
  variant,
  isDuplicate = false,
}: Props) => {
  const form = useForm<EditFlowVariantFormType>({
    defaultValues: getEditVariantDefaultValues(variant, product),
  })

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  const handleClose = () => {
    reset(getEditVariantDefaultValues(variant, product))
    onClose()
  }

  const {
    onUpdateVariant,
    onAddVariant,
    addingVariant,
    updatingVariant,
  } = useEditProductActions(product.id)

  const onSubmit = handleSubmit((data) => {
    if (isDuplicate) {
      onAddVariant(createAddPayload(data), handleClose)
    } else {
      // @ts-ignore
      onUpdateVariant(variant.id, createUpdatePayload(data), handleClose)
    }
  })

  return (
    <Modal handleClose={handleClose}>
      <Modal.Header handleClose={handleClose}>
        <h1 className="inter-xlarge-semibold">
          Edit Variant
          {variant.title && (
            <span className="text-grey-50 inter-xlarge-regular">
              {" "}
              ({variant.title})
            </span>
          )}
        </h1>
      </Modal.Header>
      <form onSubmit={onSubmit} noValidate>
        <Modal.Content>
          <EditFlowVariantForm form={form} />
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex items-center gap-x-xsmall justify-end">
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              type="submit"
              disabled={!isDirty && !isDuplicate}
              loading={addingVariant || updatingVariant}
            >
              Save and close
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export const getEditVariantDefaultValues = (
  variant: ProductVariant,
  product: Product
): EditFlowVariantFormType => {
  const options = product.options.map((option) => ({
    title: option.title,
    id: option.id,
    value:
      variant.options.find((optionValue) => optionValue.option_id === option.id)
        ?.value || "",
  }))

  const country = countries.find(
    (country) =>
      country.name.toLowerCase() === variant.origin_country?.toLowerCase()
  )

  const countryOption = country
    ? { label: country.name, value: country.alpha2 }
    : null

  return {
    general: {
      title: variant.title,
      material: variant.material,
    },
    stock: {
      sku: variant.sku,
      ean: variant.ean,
      inventory_quantity: variant.inventory_quantity,
      manage_inventory: variant.manage_inventory,
      allow_backorder: variant.allow_backorder,
      barcode: variant.barcode,
      upc: variant.upc,
    },
    customs: {
      hs_code: variant.hs_code,
      mid_code: variant.mid_code,
      origin_country: countryOption,
    },
    dimensions: {
      weight: variant.weight,
      width: variant.width,
      height: variant.height,
      length: variant.length,
    },
    prices: {
      prices: variant.prices.map((price) => ({
        id: price.id,
        amount: price.amount,
        currency_code: price.currency_code,
        region_id: price.region_id,
      })),
    },
    options,
  }
}

export default EditVariantModal
