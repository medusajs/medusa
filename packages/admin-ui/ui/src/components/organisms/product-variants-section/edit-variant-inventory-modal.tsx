import { useTranslation } from "react-i18next"
import EditFlowVariantForm, {
  EditFlowVariantFormType,
} from "../../forms/product/variant-inventory-form/edit-flow-variant-form"
import LayeredModal, {
  LayeredModalContext,
} from "../../molecules/modal/layered-modal"
import { Product, ProductVariant, VariantInventory } from "@medusajs/medusa"
import {
  adminInventoryItemsKeys,
  useAdminVariantsInventory,
  useMedusa,
} from "medusa-react"

import Button from "../../fundamentals/button"
import { InventoryLevelDTO } from "@medusajs/types"
import Modal from "../../molecules/modal"
import { Option } from "../../../types/shared"
import { countries } from "../../../utils/countries"
import { queryClient } from "../../../constants/query-client"
import { removeFalsy, removeNullish } from "../../../utils/remove-nullish"
import { useContext } from "react"
import useEditProductActions from "../../../hooks/use-edit-product-actions"
import { useForm } from "react-hook-form"

type Props = {
  onClose: () => void
  product: Product
  variant: ProductVariant
  isDuplicate?: boolean
}

const EditVariantInventoryModal = ({ onClose, product, variant }: Props) => {
  const { t } = useTranslation()
  const { client } = useMedusa()
  const layeredModalContext = useContext(LayeredModalContext)
  const {
    // @ts-ignore
    variant: variantInventory,
    isLoading: isLoadingInventory,
    refetch,
  } = useAdminVariantsInventory(variant.id)

  const handleClose = () => {
    onClose()
  }

  const { onUpdateVariant, updatingVariant } = useEditProductActions(product.id)

  const createUpdateInventoryItemPayload = (
    data: Partial<EditFlowVariantFormType>
  ) => {
    const updateDimensions = data.dimensions || {}
    const updateCustoms = data.customs || {}
    const originCountry = data.customs?.origin_country?.value

    delete data.dimensions
    delete data.customs
    delete data.ean
    delete data.barcode
    delete data.upc
    delete data.allow_backorder

    return removeFalsy({
      ...updateDimensions,
      ...updateCustoms,
      ...data,
      ...(originCountry && { origin_country: originCountry }),
    })
  }

  const onSubmit = async (data: EditFlowVariantFormType) => {
    const locationLevels = data.location_levels || []
    const manageInventory = data.manage_inventory

    const variantInventoryItem = variantInventory?.inventory?.[0]
    const itemId = variantInventoryItem?.id

    delete data.manage_inventory
    delete data.location_levels

    let inventoryItemId: string | undefined = itemId

    const { ean, barcode, upc, allow_backorder } = data
    const upsertPayload = createUpdateInventoryItemPayload(data)
    let shouldInvalidateCache = false

    if (variantInventoryItem) {
      // variant inventory exists and we can remove location levels
      // (it's important to do this before potentially deleting the inventory item)
      const deleteLocations = manageInventory
        ? (variantInventoryItem?.location_levels?.filter(
            (itemLevel: InventoryLevelDTO) => {
              return !locationLevels.find(
                (level) => level.location_id === itemLevel.location_id
              )
            }
          ) ?? [])
        : []

      if (inventoryItemId) {
        await Promise.all(
          deleteLocations.map(async (location: InventoryLevelDTO) => {
            await client.admin.inventoryItems.deleteLocationLevel(
              inventoryItemId!,
              location.location_id
            )
          })
        )
        if (deleteLocations.length) {
          shouldInvalidateCache = true
        }
      }

      if (!manageInventory) {
        // has an inventory item but no longer wants to manage inventory
        await client.admin.inventoryItems.delete(itemId!)
        inventoryItemId = undefined
        shouldInvalidateCache = true
      } else {
        // has an inventory item and wants to update inventory
        await client.admin.inventoryItems.update(itemId!, upsertPayload)
      }
    } else if (manageInventory) {
      await client.admin.products.updateVariant(product.id, variant.id, {
        manage_inventory: true,
      })
      // does not have an inventory item but wants to manage inventory
      const { inventory_item } = await client.admin.inventoryItems.create({
        variant_id: variant.id,
        ...upsertPayload,
      })
      inventoryItemId = inventory_item.id
    }

    // If some inventory Item exists update location levels
    if (inventoryItemId) {
      await Promise.all(
        locationLevels.map(async (level) => {
          if (!level.location_id) {
            return
          }
          if (level.id) {
            await client.admin.inventoryItems.updateLocationLevel(
              inventoryItemId!,
              level.location_id,
              {
                stocked_quantity: level.stocked_quantity,
              }
            )
          } else {
            await client.admin.inventoryItems.createLocationLevel(
              inventoryItemId!,
              {
                location_id: level.location_id,
                stocked_quantity: level.stocked_quantity!,
              }
            )
          }
        })
      )
      if (locationLevels.length) {
        shouldInvalidateCache = true
      }
    }

    const { dimensions, customs, ...stock } = data

    // @ts-ignore
    onUpdateVariant(
      variant.id,
      {
        ...removeNullish({
          ...dimensions,
          ...customs,
          ...stock,
          ean,
          barcode,
          upc,
          allow_backorder,
        }),
      },
      () => {
        refetch()
        if (shouldInvalidateCache) {
          queryClient.invalidateQueries(adminInventoryItemsKeys.lists())
        }
        handleClose()
      }
    )
  }

  return (
    <LayeredModal context={layeredModalContext} handleClose={handleClose}>
      <Modal.Header handleClose={handleClose}>
        <h1 className="inter-xlarge-semibold">
          {t(
            "product-variants-section-edit-stock-inventory",
            "Edit stock & inventory"
          )}
        </h1>
      </Modal.Header>
      {!isLoadingInventory && (
        <StockForm
          variantInventory={variantInventory!}
          onSubmit={onSubmit}
          variant={variant}
          isLoadingInventory={isLoadingInventory}
          handleClose={handleClose}
          updatingVariant={updatingVariant}
        />
      )}
    </LayeredModal>
  )
}

const StockForm = ({
  variantInventory,
  onSubmit,
  isLoadingInventory,
  handleClose,
  updatingVariant,
  variant,
}: {
  variantInventory: VariantInventory
  variant: ProductVariant
  onSubmit: (data: EditFlowVariantFormType) => void
  isLoadingInventory: boolean
  handleClose: () => void
  updatingVariant: boolean
}) => {
  const { t } = useTranslation()
  const form = useForm<EditFlowVariantFormType>({
    // @ts-ignore
    defaultValues: getEditVariantDefaultValues(variantInventory, variant),
  })

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  const locationLevels = variantInventory.inventory[0]?.location_levels || []

  const handleOnSubmit = handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Modal.Content>
        <EditFlowVariantForm
          form={form}
          locationLevels={locationLevels}
          isLoading={isLoadingInventory}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full items-center justify-end">
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={() => {
              reset(getEditVariantDefaultValues(variantInventory))
              handleClose()
            }}
          >
            {t("product-variants-section-cancel", "Cancel")}
          </Button>
          <Button
            variant="primary"
            size="small"
            type="submit"
            disabled={!isDirty}
            loading={updatingVariant}
          >
            {t("product-variants-section-save-and-close", "Save and close")}
          </Button>
        </div>
      </Modal.Footer>
    </form>
  )
}

export const getEditVariantDefaultValues = (
  variantInventory?: any,
  variant?: ProductVariant
): EditFlowVariantFormType => {
  const inventoryItem = variantInventory?.inventory[0]
  if (!inventoryItem) {
    return {
      sku: null,
      ean: variant?.ean || null,
      barcode: variant?.barcode || null,
      upc: variant?.upc || null,
      inventory_quantity: null,
      manage_inventory: false,
      allow_backorder: variant?.allow_backorder ?? false,
      location_levels: null,
      dimensions: {
        height: null,
        length: null,
        width: null,
        weight: null,
      },
      customs: {
        origin_country: null,
        mid_code: null,
        hs_code: null,
      },
    }
  }

  let originCountry: Option | null = null
  if (inventoryItem.origin_country) {
    const country = countries.find(
      (c) =>
        c.alpha2 === inventoryItem.origin_country ||
        c.alpha3 === inventoryItem.origin_country
    )
    if (country) {
      originCountry = {
        label: country?.name,
        value: country?.alpha2,
      }
    }
  }

  return {
    sku: inventoryItem.sku,
    ean: variant?.ean || null,
    barcode: variant?.barcode || null,
    upc: variant?.upc || null,
    inventory_quantity: inventoryItem.inventory_quantity,
    manage_inventory: !!inventoryItem,
    allow_backorder: !!variant?.allow_backorder,
    location_levels: inventoryItem.location_levels,
    dimensions: {
      height: inventoryItem.height,
      length: inventoryItem.length,
      width: inventoryItem.width,
      weight: inventoryItem.weight,
    },
    customs: {
      origin_country: originCountry,
      mid_code: inventoryItem.mid_code,
      hs_code: inventoryItem.hs_code,
    },
  }
}

export default EditVariantInventoryModal
