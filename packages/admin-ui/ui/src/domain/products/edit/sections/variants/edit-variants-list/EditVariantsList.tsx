import {
  AdminPostProductsProductVariantsVariantReq,
  Product,
  ProductVariant,
  Store,
} from "@medusajs/medusa"
import { ProductVariantPricesUpdateReq } from "@medusajs/medusa/dist/types/product-variant"
import pick from "lodash/pick"
import { useCallback, useEffect, useState } from "react"
import { FormProvider, useForm, UseFormSetValue } from "react-hook-form"
import { useAdminStore } from "medusa-react"
import Button from "../../../../../../components/fundamentals/button"
import useEditProductActions from "../../../hooks/use-edit-product-actions"
import { VariantCard } from "./variant-card"

export interface PostProductsProductVariantsVariantReq
  extends AdminPostProductsProductVariantsVariantReq {
  id: string
  metadata: Record<string, any>
  variant_rank: number
}

const useCustomFieldArray = (
  initialFields: Record<string, PostProductsProductVariantsVariantReq>,
  setValue: UseFormSetValue<EditVariantsForm>
) => {
  const [fields, setFields] = useState(
    Object.values(initialFields).sort((a, b) => a.variant_rank - b.variant_rank)
  )

  useEffect(() => {
    setFields(
      Object.values(initialFields).sort(
        (a, b) => a.variant_rank - b.variant_rank
      )
    )
  }, [initialFields])

  const move = (dragIndex: number, hoverIndex: number) => {
    const updatedFields = [...fields]
    const draggedItem = updatedFields[dragIndex]

    updatedFields.splice(dragIndex, 1)
    updatedFields.splice(hoverIndex, 0, draggedItem)

    updatedFields.forEach((item, index) => {
      item.variant_rank = index + 1
      setValue(`variants.${item.id}`, item, { shouldDirty: true })
    })

    updatedFields.sort((a, b) => a.variant_rank - b.variant_rank)

    setFields(updatedFields)
  }

  return { fields, move }
}

type EditVariantsListProps = {
  product: Product
  actions: {
    deleteVariant: (variantId: string) => void
    duplicateVariant: (variant: ProductVariant) => void
    updateVariant: (variant: ProductVariant) => void
  }
}

export type EditVariantsForm = {
  variants: Record<string, PostProductsProductVariantsVariantReq>
}

const EditVariantsList = ({ product, actions }: EditVariantsListProps) => {
  const { onUpdate, updating } = useEditProductActions(product.id)

  const { store } = useAdminStore()

  const form = useForm<EditVariantsForm>({
    defaultValues: getDefaultValues(product, store),
  })

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isDirty },
    setValue,
  } = form

  const { fields, move } = useCustomFieldArray(
    watch("variants", getDefaultValues(product, store).variants),
    setValue
  )

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      move(dragIndex, hoverIndex)
    },
    [move]
  )

  useEffect(() => {
    reset(getDefaultValues(product, store))
  }, [product, product.variants])

  const onSubmit = handleSubmit((data) => {
    onUpdate(
      {
        variants: Object.values(data.variants)
          .sort((a, b) => a.variant_rank - b.variant_rank)
          .map((variant) => {
            const variantData = {
              ...pick(variant, [
                "id",
                "title",
                "sku",
                "barcode",
                "ean",
                "upc",
                "inventory_quantity",
                "allow_backorder",
                "manage_inventory",
                "hs_code",
                "origin_country",
                "mid_code",
                "material",
                "weight",
                "length",
                "height",
                "width",
                "options",
              ]),
              prices: variant.prices?.map((price) => ({
                amount: price.amount,
                currency_code: store?.default_currency_code,
              })),
            }

            if (variantData.options)
              variantData.options = variantData.options.map((option) =>
                pick(option, ["value", "option_id"])
              )

            return variantData
          }),
      },
      (updatedProduct) => {
        reset(getDefaultValues(updatedProduct, store))
      },
      "Variants were successfully updated"
    )
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <div className="-mx-4 grid grid-cols-[52px_1fr_100px_120px_48px] pr-base inter-small-semibold text-grey-50">
          <p className="col-start-2 text-left">Name</p>
          <p className="col-start-3 text-left">Price</p>
          <p className="col-start-4 text-left">Inventory</p>
        </div>
        <div className="-mx-4 mb-4">
          {fields.map((card, i) => (
            <VariantCard
              key={card.id}
              index={i}
              actions={actions}
              id={card.id}
              title={card.title || ""}
              ean={card.ean || ""}
              sku={card.sku || ""}
              inventory_quantity={card.inventory_quantity || 0}
              moveCard={moveCard}
              product={product}
            />
          ))}
        </div>
        <div className="flex items-center gap-x-xsmall justify-end w-full">
          <Button
            variant="secondary"
            size="small"
            type="button"
            disabled={updating || !isDirty}
            onClick={() => reset(getDefaultValues(product, store))}
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
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

const getDefaultValues = (
  product: Product,
  store?: Store
): EditVariantsForm => {
  const variants = (product.variants || []).reduce((acc, variant, i) => {
    const prices: ProductVariantPricesUpdateReq[] =
      variant.prices as ProductVariantPricesUpdateReq[]

    if (prices?.length < 1) {
      const defaultPrice = (product.default_price || []).filter(
        (price) =>
          price.currency_code === store?.default_currency_code &&
          !price.region_id
      )

      prices.push({
        currency_code: store?.default_currency_code,
        amount: defaultPrice?.amount as number,
      })
    }
    const updatedVariant = {
      ...variant,
      prices,
      variant_rank: variant.variant_rank || i + 1,
    }

    return {
      ...acc,
      [variant.id]: updatedVariant,
    }
  }, {})

  return {
    variants,
  }
}

export default EditVariantsList
