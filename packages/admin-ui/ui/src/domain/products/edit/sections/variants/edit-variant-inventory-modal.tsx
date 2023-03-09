import { InventoryLevelDTO, Product, ProductVariant } from "@medusajs/medusa"
import { useAdminDeleteLocationLevel } from "medusa-react"
import { useAdminDeleteInventoryItem } from "medusa-react"
import { useAdminCreateLocationLevel } from "medusa-react"
import {
  useAdminUpdateLocationLevel,
  useAdminVariantsInventory,
} from "medusa-react"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../../components/molecules/modal/layered-modal"
import EditFlowVariantForm, {
  EditFlowVariantFormType,
} from "../../../components/variant-inventory-form/edit-flow-variant-form"
import useEditProductActions from "../../hooks/use-edit-product-actions"
import { createUpdatePayload } from "./edit-variants-modal/edit-variant-screen"

type Props = {
  onClose: () => void
  product: Product
  variant: ProductVariant
  isDuplicate?: boolean
}

const EditVariantInventoryModal = ({ onClose, product, variant }: Props) => {
  const layeredModalContext = useContext(LayeredModalContext)
  const {
    // @ts-ignore
    variant: variantInventory,
    isLoading: isLoadingInventory,
    refetch,
  } = useAdminVariantsInventory(variant.id)

  console.log(variantInventory)
  const variantInventoryItem = variantInventory?.inventory[0]
  const itemId = variantInventoryItem?.id

  const { mutate: updateLocationLevel } = useAdminUpdateLocationLevel(
    itemId || ""
  )
  const { mutate: deleteLevel } = useAdminDeleteLocationLevel(itemId)
  const { mutate: createLevel } = useAdminCreateLocationLevel(itemId)
  const { mutate: deleteInventoryItem } = useAdminDeleteInventoryItem(itemId)

  const handleClose = () => {
    onClose()
  }

  const { onUpdateVariant, updatingVariant } = useEditProductActions(product.id)

  const onSubmit = async (data: EditFlowVariantFormType) => {
    const locationLevels = data.stock.location_levels || []
    const manageInventory = data.stock.manage_inventory
    console.log(locationLevels)

    console.log(data)
    const deleteLocations = variantInventoryItem.location_levels.filter(
      (location: InventoryLevelDTO) => {
        return !locationLevels.find(
          (level) => level.location_id === location.id
        )
      }
    )
    await Promise.all([
      ...(locationLevels.map(async (level) => {
        if (level.id) {
          await updateLocationLevel({
            stockLocationId: level.location_id,
            stocked_quantity: level.stocked_quantity,
          })
        } else {
          await createLevel({
            location_id: level.location_id,
            stocked_quantity: level.stocked_quantity,
          })
        }
      }) || []),
      ...deleteLocations.map(async (location: InventoryLevelDTO) => {
        await deleteLevel(location.id)
      }),
    ])

    // / TODO: Call update location level with new values
    delete data.stock.location_levels

    if (!manageInventory && variantInventory) {
      await deleteInventoryItem()
    } else if (manageInventory && !variantInventory) {
      await createInventoryItem()
    }

    // @ts-ignore
    onUpdateVariant(variant.id, createUpdatePayload(data), () => {
      refetch()
      handleClose()
    })
  }

  const createInventoryItem = async () => {}

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
