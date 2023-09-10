import { Product } from "@medusajs/medusa"
import { useCallback, useContext, useEffect } from "react"
import {
  FieldArrayWithId,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import useEditProductActions from "../../../../hooks/use-edit-product-actions"
import Button from "../../../fundamentals/button"
import Modal from "../../../molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../molecules/modal/layered-modal"
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
  const { t } = useTranslation()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    [moveCard, product]
  )

  const handleFormReset = useCallback(() => {
    reset(getDefaultValues(product))
  }, [product, reset])

  const resetAndClose = () => {
    handleFormReset()
    context.reset()
    onClose()
  }

  useEffect(() => {
    handleFormReset()
  }, [product, handleFormReset])

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
      t(
        "edit-variants-modal-update-success",
        "Variants were successfully updated"
      )
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
            <h1 className="inter-xlarge-semibold">
              {t("edit-variants-modal-edit-variants", "Edit Variants")}
            </h1>
          </Modal.Header>
          <FormProvider {...form}>
            <form onSubmit={onSubmit}>
              <Modal.Content>
                <h2 className="inter-base-semibold mb-small">
                  {t(
                    "edit-variants-modal-product-variants",
                    "Product variants"
                  )}{" "}
                  <span className="inter-base-regular text-grey-50">
                    ({product.variants.length})
                  </span>
                </h2>
                <div className="pr-base inter-small-semibold text-grey-50 mb-small grid grid-cols-[1fr_1fr_48px]">
                  <p className="col-start-1 col-end-1 text-left">
                    {t("edit-variants-modal-variant", "Variant")}
                  </p>
                  <p className="col-start-2 col-end-2 text-right">
                    {t("edit-variants-modal-inventory", "Inventory")}
                  </p>
                </div>
                <div>{fields.map((card, i) => renderCard(card, i))}</div>
              </Modal.Content>
              <Modal.Footer>
                <div className="gap-x-xsmall flex w-full items-center justify-end">
                  <Button
                    variant="secondary"
                    size="small"
                    type="button"
                    onClick={resetAndClose}
                  >
                    {t("edit-variants-modal-cancel", "Cancel")}
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    type="submit"
                    loading={updating}
                    disabled={updating || !isDirty}
                  >
                    {t("edit-variants-modal-save-and-close", "Save and close")}
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
