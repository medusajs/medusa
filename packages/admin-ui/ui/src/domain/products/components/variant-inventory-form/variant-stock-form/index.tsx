import React, { useMemo, useState, useContext } from "react"
import Modal from "../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import {
  useAdminCreateLocationLevel,
  useAdminDeleteLocationLevel,
  useAdminStockLocations,
} from "medusa-react"
import { InventoryLevelDTO, StockLocationDTO } from "@medusajs/medusa"
import { Controller } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Switch from "../../../../../components/atoms/switch"
import InputField from "../../../../../components/molecules/input"
import { NestedForm } from "../../../../../utils/nested-form"
import IconBadge from "../../../../../components/fundamentals/icon-badge"
import BuildingsIcon from "../../../../../components/fundamentals/icons/buildings-icon"

export type VariantStockFormType = {
  manage_inventory: boolean
  allow_backorder: boolean
  inventory_quantity: number | null
  sku: string | null
  ean: string | null
  upc: string | null
  barcode: string | null
  location_levels: InventoryLevelDTO[] | null
}

type Props = {
  itemId: string
  locationLevels: InventoryLevelDTO[]
  refetchInventory: () => void
  form: NestedForm<VariantStockFormType>
}

const VariantStockForm = ({
  form,
  locationLevels,
  refetchInventory,
  itemId,
}: Props) => {
  const layeredModalContext = useContext(LayeredModalContext)

  const { stock_locations: locations, isLoading } = useAdminStockLocations()

  const deleteLevel = useAdminDeleteLocationLevel(itemId)
  const createLevel = useAdminCreateLocationLevel(itemId)

  const { path, control, register } = form

  const handleUpdateLocations = async (value) => {
    await Promise.all(
      value.removed.map(async (id) => {
        await deleteLevel.mutateAsync(id)
      })
    )

    await Promise.all(
      value.added.map(async (id) => {
        await createLevel.mutateAsync({
          stocked_quantity: 0,
          location_id: id,
        })
      })
    )

    refetchInventory()
  }

  return (
    <div>
      <div className="flex flex-col gap-y-xlarge">
        <div className="flex flex-col gap-y-4">
          <h3 className="inter-base-semibold">General</h3>
          <div className="grid grid-cols-2 gap-large">
            <InputField
              label="Stock keeping unit (SKU)"
              placeholder="SUN-G, JK1234..."
              {...register(path("sku"))}
            />
            <InputField
              label="EAN (Barcode)"
              placeholder="123456789102..."
              {...register(path("ean"))}
            />
            <InputField
              label="UPC (Barcode)"
              placeholder="023456789104..."
              {...register(path("upc"))}
            />
            <InputField
              label="Barcode"
              placeholder="123456789104..."
              {...register(path("barcode"))}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-2xsmall">
          <div className="flex items-center justify-between">
            <h3 className="inter-base-semibold mb-2xsmall">Manage inventory</h3>
            <Controller
              control={control}
              name={path("manage_inventory")}
              render={({ field: { value, onChange } }) => {
                return <Switch checked={value} onCheckedChange={onChange} />
              }}
            />
          </div>
          <p className="inter-base-regular text-grey-50">
            When checked Medusa will regulate the inventory when orders and
            returns are made.
          </p>
        </div>
        <div className="flex flex-col gap-y-2xsmall">
          <div className="flex items-center justify-between">
            <h3 className="inter-base-semibold mb-2xsmall">Allow backorders</h3>
            <Controller
              control={control}
              name={path("allow_backorder")}
              render={({ field: { value, onChange } }) => {
                return <Switch checked={value} onCheckedChange={onChange} />
              }}
            />
          </div>
          <p className="inter-base-regular text-grey-50">
            When checked the product will be available for purchase despite the
            product being sold out
          </p>
        </div>
        <div className="flex flex-col w-full text-base">
          <h3 className="inter-base-semibold mb-2xsmall">Quantity</h3>
          {!isLoading && locations && (
            <div className="flex flex-col w-full">
              <div className="flex justify-between py-3 inter-base-regular text-grey-50">
                <div className="">Location</div>
                <div className="">In Stock</div>
              </div>
              {locationLevels.map((level, i) => {
                const locationDetails = locations.find(
                  (l) => l.id === level.location_id
                )

                return (
                  <div key={level.id} className="flex items-center py-3">
                    <div className="flex items-center inter-base-regular">
                      <IconBadge className="mr-base">
                        <BuildingsIcon />
                      </IconBadge>
                      {locationDetails?.name}
                    </div>
                    <div className="flex ml-auto">
                      <div className="flex flex-col mr-base text-small text-grey-50">
                        <span className="whitespace-nowrap">
                          {`${
                            level.stocked_quantity - level.available_quantity
                          } reserved`}
                        </span>
                        <span className="whitespace-nowrap">{`${level.available_quantity} available`}</span>
                      </div>
                      <InputField
                        placeholder={"0"}
                        type="number"
                        {...register(
                          path(`location_levels.${i}.stocked_quantity`),
                          { valueAsNumber: true }
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex">
          <Button
            variant="secondary"
            size="small"
            type="button"
            className="w-full"
            onClick={() => {
              layeredModalContext.push(
                // @ts-ignore
                ManageLocationsScreen(
                  layeredModalContext.pop,
                  locationLevels,
                  locations,
                  handleUpdateLocations
                )
              )
            }}
          >
            Manage locations
          </Button>
        </div>
      </div>
    </div>
  )
}

export const ManageLocationsScreen = (
  pop: () => void,
  levels: InventoryLevelDTO[],
  locations: StockLocationDTO[],
  onSubmit: (value: any) => Promise<void>
) => {
  return {
    title: "Manage locations",
    onBack: () => pop(),
    view: (
      <ManageLocationsForm
        existingLevels={levels}
        locationOptions={locations}
        onSubmit={onSubmit}
      />
    ),
  }
}

type ManageLocationFormProps = {
  existingLevels: InventoryLevelDTO[]
  locationOptions: StockLocationDTO[]
  onSubmit: (value: any) => Promise<void>
}

const ManageLocationsForm = ({
  existingLevels,
  locationOptions,
  onSubmit,
}: ManageLocationFormProps) => {
  const layeredModalContext = useContext(LayeredModalContext)
  const { pop } = layeredModalContext

  const existingLocations = useMemo(() => {
    return existingLevels.map((level) => level.location_id)
  }, [existingLevels])

  const [selectedLocations, setSelectedLocations] =
    useState<string[]>(existingLocations)

  const [isDirty, setIsDirty] = useState(false)

  React.useEffect(() => {
    const selectedIsExisting = selectedLocations.every((locationId) =>
      existingLocations.includes(locationId)
    )
    setIsDirty(
      !selectedIsExisting ||
        selectedLocations.length !== existingLocations.length
    )
  }, [existingLocations, selectedLocations])

  const handleToggleLocation = (locationId: string) => {
    if (selectedLocations.includes(locationId)) {
      setSelectedLocations(selectedLocations.filter((id) => id !== locationId))
    } else {
      setSelectedLocations([...selectedLocations, locationId])
    }
  }

  // TODO: On submit, create location level and refetch locations if needed, so that object exists correctly
  const handleSubmit = async (e) => {
    e.preventDefault()

    const newLevels = selectedLocations.filter(
      (locationId: string) => !existingLocations.includes(locationId)
    )
    const removedLevels = existingLocations.filter(
      (locationId) => !selectedLocations.includes(locationId)
    )

    await onSubmit({
      added: newLevels,
      removed: removedLevels,
    }).then(() => {
      pop()
    })
  }

  const handleSelectAll = (e) => {
    e.preventDefault()

    setSelectedLocations(locationOptions.map((l) => l.id))
  }

  return (
    <div className="w-full h-full">
      <form onSubmit={handleSubmit}>
        <Modal.Content>
          <div>
            <div className="flex items-center justify-between w-full border-b border-grey-20 pb-base text-grey-50">
              <div className="">
                <p>Select locations that stock the selected variant</p>
                <p>{`(${selectedLocations.length} of ${locationOptions.length} selected)`}</p>
              </div>
              <Button
                size="small"
                variant="ghost"
                className="border"
                onClick={handleSelectAll}
              >
                Select all
              </Button>
            </div>
            {locationOptions.map((loc) => {
              const existingLevel = selectedLocations.find((l) => l === loc.id)

              return (
                <div
                  className="flex items-center justify-between gap-6 border-b border-grey-20 py-base"
                  key={loc.id}
                >
                  <div className="flex items-center">
                    <IconBadge className="mr-base">
                      <BuildingsIcon />
                    </IconBadge>
                    <h3>{loc.name}</h3>
                  </div>
                  <Switch
                    checked={!!existingLevel}
                    onCheckedChange={() => handleToggleLocation(loc.id)}
                  />
                </div>
              )
            })}
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-x-xsmall">
            <Button
              variant="ghost"
              size="small"
              className="w-[112px]"
              onClick={() => pop()}
              type="button"
            >
              Back
            </Button>
            <Button
              variant="primary"
              className="nowrap w-[134px]"
              size="small"
              type="submit"
              disabled={!isDirty}
            >
              Save and go back
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </div>
  )
}

export default VariantStockForm
