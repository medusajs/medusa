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
import { createUpdatePayload } from "./edit-variants-modal/edit-variant-screen"
import { queryClient } from "../../../constants/query-client"
import { removeNullish } from "../../../utils/remove-nullish"
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

  const onSubmit = async (data: EditFlowVariantFormType) => {
    const locationLevels = data.stock.location_levels || []
    const manageInventory = data.stock.manage_inventory

    const variantInventoryItem = variantInventory?.inventory?.[0]
    const itemId = variantInventoryItem?.id

    delete data.stock.manage_inventory
    delete data.stock.location_levels

    let inventoryItemId: string | undefined = itemId

    const upsertPayload = removeNullish(data.stock)
    let shouldInvalidateCache = false

    if (variantInventoryItem) {
      // variant inventory exists and we can remove location levels
      // (it's important to do this before potentially deleting the inventory item)
      const deleteLocations = manageInventory
        ? variantInventoryItem?.location_levels?.filter(
            (itemLevel: InventoryLevelDTO) => {
              return !locationLevels.find(
                (level) => level.location_id === itemLevel.location_id
              )
            }
          ) ?? []
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

    // @ts-ignore
    onUpdateVariant(variant.id, createUpdatePayload(data), () => {
      refetch()
      if (shouldInvalidateCache) {
        queryClient.invalidateQueries(adminInventoryItemsKeys.lists())
      }
      handleClose()
    })
  }

  return (
    <LayeredModal context={layeredModalContext} handleClose={handleClose}>
      <Modal.Header handleClose={handleClose}>
        <h1 className="inter-xlarge-semibold">Edit stock & inventory</h1>
      </Modal.Header>
      {!isLoadingInventory && (
        <StockForm
          variantInventory={variantInventory!}
          onSubmit={onSubmit}
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
}: {
  variantInventory: VariantInventory
  onSubmit: (data: EditFlowVariantFormType) => void
  isLoadingInventory: boolean
  handleClose: () => void
  updatingVariant: boolean
}) => {
  const form = useForm<EditFlowVariantFormType>({
    // @ts-ignore
    defaultValues: getEditVariantDefaultValues(variantInventory),
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
            Cancel
          </Button>
          <Button
            variant="primary"
            size="small"
            type="submit"
            disabled={!isDirty}
            loading={updatingVariant}
          >
            Save and close
          </Button>
        </div>
      </Modal.Footer>
    </form>
  )
}

export const getEditVariantDefaultValues = (
  variantInventory?: any
): EditFlowVariantFormType => {
  const inventoryItem = variantInventory?.inventory[0]
  if (!inventoryItem) {
    return {
      stock: {
        sku: null,
        ean: null,
        inventory_quantity: null,
        manage_inventory: false,
        allow_backorder: false,
        barcode: null,
        upc: null,
        location_levels: null,
      },
    }
  }

  return {
    stock: {
      sku: inventoryItem.sku,
      ean: inventoryItem.ean,
      inventory_quantity: inventoryItem.inventory_quantity,
      manage_inventory: !!inventoryItem,
      allow_backorder: inventoryItem.allow_backorder,
      barcode: inventoryItem.barcode,
      upc: inventoryItem.upc,
      location_levels: inventoryItem.location_levels,
    },
  }
}

export default EditVariantInventoryModal
