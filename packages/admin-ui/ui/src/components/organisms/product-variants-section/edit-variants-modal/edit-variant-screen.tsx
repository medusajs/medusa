import {
  AdminPostProductsProductVariantsVariantReq,
  Product,
  ProductVariant,
} from "@medusajs/medusa"
import React, { useContext, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import EditFlowVariantForm, {
  EditFlowVariantFormType,
} from "../../../forms/product/variant-form/edit-flow-variant-form"

import { useForm } from "react-hook-form"
import useEditProductActions from "../../../../hooks/use-edit-product-actions"
import { getSubmittableMetadata } from "../../../forms/general/metadata-form"
import Button from "../../../fundamentals/button"
import Modal from "../../../molecules/modal"
import { LayeredModalContext } from "../../../molecules/modal/layered-modal"
import { getEditVariantDefaultValues } from "../edit-variant-modal"
import { useEditVariantsModal } from "./use-edit-variants-modal"

type Props = {
  variant: ProductVariant
  product: Product
}

const EditVariantScreen = ({ variant, product }: Props) => {
  const { t } = useTranslation()
  const { onClose } = useEditVariantsModal()
  const form = useForm<EditFlowVariantFormType>({
    defaultValues: getEditVariantDefaultValues(variant, product),
  })

  const { reset: formReset } = form

  const { pop, reset } = useContext(LayeredModalContext)
  const { updatingVariant, onUpdateVariant } = useEditProductActions(product.id)

  const popAndReset = () => {
    formReset(getEditVariantDefaultValues(variant, product))
    pop()
  }

  const closeAndReset = () => {
    formReset(getEditVariantDefaultValues(variant, product))
    reset()
    onClose()
  }

  useEffect(() => {
    formReset(getEditVariantDefaultValues(variant, product))
  }, [variant, product, formReset])

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
          <EditFlowVariantForm isEdit={true} form={form} />
        </Modal.Content>
        <Modal.Footer>
          <div className="gap-x-xsmall flex w-full items-center justify-end">
            <Button variant="secondary" size="small" type="button">
              {t("edit-variants-modal-cancel", "Cancel")}
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              disabled={updatingVariant || !form.formState.isDirty}
              loading={updatingVariant}
              onClick={onSubmitAndBack}
            >
              {t("edit-variants-modal-save-and-go-back", "Save and go back")}
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              disabled={updatingVariant || !form.formState.isDirty}
              loading={updatingVariant}
              onClick={onSubmitAndClose}
            >
              {t("edit-variants-modal-save-and-close", "Save and close")}
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

  const priceArray = prices?.prices
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
    ...general,
    ...customs,
    ...stock,
    ...dimensions,
    ...customs,
    metadata: getSubmittableMetadata(data.metadata),
    // @ts-ignore
    origin_country: customs?.origin_country
      ? customs.origin_country.value
      : null,
    // @ts-ignore
    prices: priceArray,
    options: options?.map((option) => ({
      option_id: option.id,
      value: option.value,
    })),
  }
}

export const useEditVariantScreen = (props: Props) => {
  const { t } = useTranslation()
  const { pop } = React.useContext(LayeredModalContext)

  const screen = useMemo(() => {
    return {
      title: t("edit-variants-modal-edit-variant", "Edit Variant"),
      subtitle: props.variant.title,
      onBack: pop,
      view: <EditVariantScreen {...props} />,
    }
  }, [props])

  return screen
}

export default EditVariantScreen
