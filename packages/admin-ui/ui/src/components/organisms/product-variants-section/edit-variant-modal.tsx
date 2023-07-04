import { Product, ProductVariant } from "@medusajs/medusa"
import EditFlowVariantForm, {
  EditFlowVariantFormType,
} from "../../forms/product/variant-form/edit-flow-variant-form"
import LayeredModal, {
  LayeredModalContext,
} from "../../molecules/modal/layered-modal"

import { useMedusa } from "medusa-react"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import useEditProductActions from "../../../hooks/use-edit-product-actions"
import { countries } from "../../../utils/countries"
import { getMetadataFormValues } from "../../forms/general/metadata-form"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
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
    // @ts-ignore
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

  const { onUpdateVariant, onAddVariant, addingVariant, updatingVariant } =
    useEditProductActions(product.id)

  const { client } = useMedusa()

  const createStockLocationsForVariant = async (
    productRes: Product,
    stock_locations: { stocked_quantity: number; location_id: string }[]
  ) => {
    const { variants } = productRes

    const pvMap = new Map(product.variants.map((v) => [v.id, true]))
    const addedVariant = variants.find((variant) => !pvMap.get(variant.id))

    if (!addedVariant) {
      return
    }

    const inventory = await client.admin.variants.getInventory(addedVariant.id)

    await Promise.all(
      inventory.variant.inventory
        .map(async (item) => {
          return Promise.all(
            stock_locations.map(async (stock_location) => {
              client.admin.inventoryItems.createLocationLevel(item.id!, {
                location_id: stock_location.location_id,
                stocked_quantity: stock_location.stocked_quantity,
              })
            })
          )
        })
        .flat()
    )
  }

  const onSubmit = handleSubmit((data) => {
    const {
      stock: { stock_location },
    } = data
    delete data.stock.stock_location

    if (isDuplicate) {
      onAddVariant(createAddPayload(data), (productRes) => {
        if (typeof stock_location !== "undefined") {
          createStockLocationsForVariant(productRes, stock_location).then(
            () => {
              handleClose()
            }
          )
        } else {
          handleClose()
        }
      })
    } else {
      // @ts-ignore
      onUpdateVariant(variant.id, createUpdatePayload(data), handleClose)
    }
  })

  const layeredModalContext = useContext(LayeredModalContext)
  return (
    <LayeredModal context={layeredModalContext} handleClose={handleClose}>
      <Modal.Header handleClose={handleClose}>
        <h1 className="inter-xlarge-semibold">
          Edit Variant
          {variant.title && (
            <span className="inter-xlarge-regular text-grey-50">
              {" "}
              ({variant.title})
            </span>
          )}
        </h1>
      </Modal.Header>
      <form onSubmit={onSubmit} noValidate>
        <Modal.Content>
          <EditFlowVariantForm isEdit={true} form={form} />
        </Modal.Content>
        <Modal.Footer>
          <div className="gap-x-xsmall flex w-full items-center justify-end">
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
    </LayeredModal>
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
    metadata: getMetadataFormValues(variant.metadata),
  }
}

export default EditVariantModal
