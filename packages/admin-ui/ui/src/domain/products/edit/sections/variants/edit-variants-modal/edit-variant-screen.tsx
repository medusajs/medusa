import {
  AdminPostProductsProductVariantsVariantReq,
  Product,
  ProductVariant,
} from "@medusajs/medusa"
import React, { useContext, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../../components/fundamentals/button"
import Modal from "../../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../../components/molecules/modal/layered-modal"
import EditFlowVariantForm, {
  EditFlowVariantFormType,
} from "../../../../components/variant-form/edit-flow-variant-form"
import useEditProductActions from "../../../hooks/use-edit-product-actions"
import { getEditVariantDefaultValues } from "../edit-variant-modal"
import { useEditVariantsModal } from "./use-edit-variants-modal"

type Props = {
  variant: ProductVariant
  product: Product
}

const EditVariantScreen = ({ variant, product }: Props) => {
  const { onClose } = useEditVariantsModal()
  const form = useForm<EditFlowVariantFormType>({
    defaultValues: getEditVariantDefaultValues(variant, product),
  })

  const { pop, reset } = useContext(LayeredModalContext)
  const { updatingVariant, onUpdateVariant } = useEditProductActions(product.id)

  const popAndReset = () => {
    form.reset(getEditVariantDefaultValues(variant, product))
    pop()
  }

  const closeAndReset = () => {
    form.reset(getEditVariantDefaultValues(variant, product))
    reset()
    onClose()
  }

  useEffect(() => {
    form.reset(getEditVariantDefaultValues(variant, product))
  }, [variant, product])

  const onSubmitAndBack = form.handleSubmit((data) => {
    // @ts-ignore
    onUpdateVariant(variant.id, createUpdatePayload(data), popAndReset)
  })

  const onSubmitAndClose = form.handleSubmit((data) => {
    // @ts-ignore
    onUpdateVariant(variant.id, createUpdatePayload(data), closeAndReset)
  })

  return (
    <>
      <form noValidate>
        <Modal.Content>
          <EditFlowVariantForm form={form} />
        </Modal.Content>
        <Modal.Footer>
          <div className="flex items-center w-full justify-end gap-x-xsmall">
            <Button variant="secondary" size="small" type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              disabled={updatingVariant || !form.formState.isDirty}
              loading={updatingVariant}
              onClick={onSubmitAndBack}
            >
              Save and go back
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              disabled={updatingVariant || !form.formState.isDirty}
              loading={updatingVariant}
              onClick={onSubmitAndClose}
            >
              Save and close
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </>
  )
}

export const createUpdatePayload = (
  data: EditFlowVariantFormType
): AdminPostProductsProductVariantsVariantReq => {
  const { customs, dimensions, prices, options, general, stock } = data

  const priceArray = prices.prices
    .filter((price) => typeof price.amount === "number")
    .map((price) => {
      return {
        amount: price.amount,
        currency_code: price.region_id ? undefined : price.currency_code,
        region_id: price.region_id,
        id: price.id || undefined,
      }
    })

  return {
    // @ts-ignore
    ...general,
    ...customs,
    ...stock,
    ...dimensions,
    ...customs,
    // @ts-ignore
    origin_country: customs.origin_country
      ? customs.origin_country.value
      : null,
    // @ts-ignore
    prices: priceArray,
    options: options.map((option) => ({
      option_id: option.id,
      value: option.value,
    })),
  }
}

export const useEditVariantScreen = (props: Props) => {
  const { pop } = React.useContext(LayeredModalContext)

  const screen = useMemo(() => {
    return {
      title: "Edit Variant",
      subtitle: props.variant.title,
      onBack: pop,
      view: <EditVariantScreen {...props} />,
    }
  }, [props])

  return screen
}

export default EditVariantScreen
