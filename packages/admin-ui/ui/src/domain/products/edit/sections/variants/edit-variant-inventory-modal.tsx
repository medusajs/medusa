import {
  AdminPostInventoryItemsInventoryItemReq,
  InventoryLevelDTO,
  Product,
  ProductVariant,
} from "@medusajs/medusa"
import { useMedusa } from "medusa-react"
import { useAdminVariantsInventory } from "medusa-react"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import EditFlowVariantForm, {
  EditFlowVariantFormType,
} from "../../../components/variant-inventory-form/edit-flow-variant-form"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../../components/molecules/modal/layered-modal"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { createUpdatePayload } from "./edit-variants-modal/edit-variant-screen"
import useEditProductActions from "../../hooks/use-edit-product-actions"

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

  const variantInventoryItem = variantInventory?.inventory[0]
  const itemId = variantInventoryItem?.id

  const handleClose = () => {
    onClose()
  }

  const { onUpdateVariant, updatingVariant } = useEditProductActions(product.id)

  const onSubmit = async (data: EditFlowVariantFormType) => {
    const locationLevels = data.stock.location_levels || []
    const manageInventory = data.stock.manage_inventory
    console.log(locationLevels)

    let itemIdd = itemId
    if (!manageInventory && variantInventory) {
      await client.admin.inventoryItems.delete(itemId)
      itemIdd = null
    } else if (manageInventory && !variantInventory) {
      const { id } = await createInventoryItem(data.stock)
      itemIdd = id
    } else if (manageInventory && variantInventory) {
      await client.admin.inventoryItems.update(
        itemId,
        data.stock as AdminPostInventoryItemsInventoryItemReq
      )
    }

    const deleteLocations = variantInventoryItem.location_levels.filter(
      (location: InventoryLevelDTO) => {
        return !locationLevels.find(
          (level) => level.location_id === location.id
        )
      }
    )
    await Promise.all([
      ...(locationLevels.map(async (level) => {
        if (!itemIdd) {
          return
        }
        if (level.id) {
          await client.admin.inventoryItems.updateLocationLevel(
            itemIdd,
            level.location_id,
            {
              stocked_quantity: level.stocked_quantity,
            }
          )
        } else {
          await client.admin.inventoryItems.createLocationLevel(itemIdd, {
            location_id: level.location_id,
            stocked_quantity: level.stocked_quantity,
          })
        }
      }) || []),
      ...deleteLocations.map(async (location: InventoryLevelDTO) => {
        await client.admin.inventoryItems.deleteLocationLevel(
          itemIdd,
          location.id
        )
      }),
    ])

    // / TODO: Call update location level with new values
    delete data.stock.location_levels

    console.log(createUpdatePayload(data))
    // @ts-ignore
    onUpdateVariant(variant.id, createUpdatePayload(data), () => {
      refetch()
      handleClose()
    })
  }

  const createInventoryItem = async (test: any) => {}

  return (
    <LayeredModal context={layeredModalContext} handleClose={handleClose}>
      <Modal.Header handleClose={handleClose}>
        <h1 className="inter-xlarge-semibold">Edit stock & inventory</h1>
      </Modal.Header>
      {!isLoadingInventory && (
        <StockForm
          variantInventory={variantInventory}
          refetchInventory={refetch}
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
  refetchInventory,
  isLoadingInventory,
  handleClose,
  updatingVariant,
}: any) => {
  const form = useForm<EditFlowVariantFormType>({
    defaultValues: getEditVariantDefaultValues(variantInventory),
  })

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  const { location_levels } = variantInventory.inventory[0]

  const itemId = variantInventory.inventory[0].id

  const handleOnSubmit = handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Modal.Content>
        <EditFlowVariantForm
          form={form}
          refetchInventory={refetchInventory}
          locationLevels={location_levels || []}
          itemId={itemId}
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
