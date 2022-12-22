import { Product } from "@medusajs/medusa"
import React, { useCallback, useContext, useEffect } from "react"
import {
  FieldArrayWithId,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form"
import Button from "../../../../../../components/fundamentals/button"
import Modal from "../../../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../../../components/molecules/modal/layered-modal"
import useEditProductActions from "../../../hooks/use-edit-product-actions"
import { EditVariantsModalContext } from "./use-edit-variants-modal"
import { VariantCard } from "./variant-card"

type Props = {
  open: boolean
  onClose: () => void
  product: Product
}

export type VariantItem = {
  id: string
  title: string | null
  ean: string | null
  sku: string | null
  inventory_quantity: number
}

export type EditVariantsForm = {
  variants: VariantItem[]
}

const EditVariantsModal = ({ open, onClose, product }: Props) => {
  const context = useContext(LayeredModalContext)
  const { onUpdate, updating } = useEditProductActions(product.id)

  const form = useForm<EditVariantsForm>({
    defaultValues: getDefaultValues(product),
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form

  const { fields, move } = useFieldArray({
    control,
    name: "variants",
    keyName: "fieldId",
  })

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    move(dragIndex, hoverIndex)
  }, [])

  const renderCard = useCallback(
    (
      card: FieldArrayWithId<EditVariantsForm, "variants", "fieldId">,
      index: number
    ) => {
      return (
        <VariantCard
          key={card.fieldId}
          index={index}
          id={card.id}
          title={card.title}
          ean={card.ean}
          sku={card.sku}
          inventory_quantity={card.inventory_quantity}
          moveCard={moveCard}
          product={product}
        />
      )
    },
    [product]
  )

  const handleFormReset = () => {
    reset(getDefaultValues(product))
  }

  const resetAndClose = () => {
    handleFormReset()
    context.reset()
    onClose()
  }

  useEffect(() => {
    handleFormReset()
  }, [product])

  const onSubmit = handleSubmit((data) => {
    onUpdate(
      {
        // @ts-ignore
        variants: data.variants.map((variant) => {
          return {
            id: variant.id,
            inventory_quantity: variant.inventory_quantity,
          }
        }),
      },
      () => {
        resetAndClose()
      },
      "Variants were successfully updated"
    )
  })

  return (
    <EditVariantsModalContext.Provider
      value={{
        onClose,
      }}
    >
      <LayeredModal handleClose={resetAndClose} open={open} context={context}>
        <Modal.Body>
          <Modal.Header handleClose={resetAndClose}>
            <h1 className="inter-xlarge-semibold">Edit Variants</h1>
          </Modal.Header>
          <FormProvider {...form}>
            <form onSubmit={onSubmit}>
              <Modal.Content>
                <h2 className="inter-base-semibold mb-small">
                  Product variants{" "}
                  <span className="inter-base-regular text-grey-50">
                    ({product.variants.length})
                  </span>
                </h2>
                <div className="grid grid-cols-[1fr_1fr_48px] pr-base inter-small-semibold text-grey-50 mb-small">
                  <p className="col-start-1 col-end-1 text-left">Variant</p>
                  <p className="col-start-2 col-end-2 text-right">Inventory</p>
                </div>
                <div>{fields.map((card, i) => renderCard(card, i))}</div>
              </Modal.Content>
              <Modal.Footer>
                <div className="flex items-center gap-x-xsmall justify-end w-full">
                  <Button
                    variant="secondary"
                    size="small"
                    type="button"
                    onClick={resetAndClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    type="submit"
                    loading={updating}
                    disabled={updating || !isDirty}
                  >
                    Save and close
                  </Button>
                </div>
              </Modal.Footer>
            </form>
          </FormProvider>
        </Modal.Body>
      </LayeredModal>
    </EditVariantsModalContext.Provider>
  )
}

const getDefaultValues = (product: Product): EditVariantsForm => {
  const variants = product.variants || []

  const sortedVariants = variants.sort(
    (a, b) => a.variant_rank - b.variant_rank
  )

  return {
    variants: sortedVariants.map((variant, i) => ({
      id: variant.id,
      title: variant.title,
      ean: variant.ean,
      sku: variant.sku,
      variant_rank: variant.variant_rank || i + 1,
      inventory_quantity: variant.inventory_quantity,
    })),
  }
}

export default EditVariantsModal
