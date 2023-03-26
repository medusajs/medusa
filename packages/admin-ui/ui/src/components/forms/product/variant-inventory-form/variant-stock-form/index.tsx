import { InventoryLevelDTO, StockLocationDTO } from "@medusajs/medusa"
import { useAdminStockLocations } from "medusa-react"
import React, { useMemo, useState } from "react"
import { Controller, useFieldArray } from "react-hook-form"
import { NestedForm } from "../../../../../utils/nested-form"
import Switch from "../../../../atoms/switch"
import Button from "../../../../fundamentals/button"
import IconBadge from "../../../../fundamentals/icon-badge"
import BuildingsIcon from "../../../../fundamentals/icons/buildings-icon"
import InputField from "../../../../molecules/input"
import Modal from "../../../../molecules/modal"
import { useLayeredModal } from "../../../../molecules/modal/layered-modal"

export type VariantStockFormType = {
  manage_inventory?: boolean
  allow_backorder: boolean
  inventory_quantity: number | null
  sku: string | null
  ean: string | null
  upc: string | null
  barcode: string | null
  location_levels?: Partial<InventoryLevelDTO>[] | null
}

type Props = {
  locationLevels: InventoryLevelDTO[]
  form: NestedForm<VariantStockFormType>
}

const VariantStockForm = ({ form, locationLevels }: Props) => {
  const locationLevelMap = useMemo(
    () => new Map(locationLevels.map((l) => [l.location_id, l])),
    [locationLevels]
  )

  const layeredModalContext = useLayeredModal()

  const { stock_locations: locations, isLoading } = useAdminStockLocations()

  const locationsMap = useMemo(() => {
    if (isLoading) {
      return new Map()
    }

    return new Map(locations.map((l) => [l.id, l]))
  }, [locations, isLoading])
  const { path, control, register, watch } = form

  const manageInventory = watch(path("manage_inventory"))

  const {
    fields: selectedLocations,
    append,
    remove,
  } = useFieldArray({
    control,
    name: path("location_levels"),
  })

  const selectedLocationLevels = watch(path("location_levels"))

  const levelMap = new Map(
    selectedLocationLevels?.map((l) => [l.location_id, l])
  )

  const handleUpdateLocations = async (data: {
    added: string[]
    removed: string[]
  }) => {
    const removed = data.removed.map((r) =>
      selectedLocations.findIndex((sl) => sl.location_id === r)
    )

    removed.forEach((r) => remove(r))

    data.added.forEach((added) => {
      append({
        location_id: added,
        stocked_quantity: locationLevelMap.get(added)?.stocked_quantity ?? 0,
        reserved_quantity: locationLevelMap.get(added)?.reserved_quantity ?? 0,
      })
    })
  }

  return (
    <div>
      <div className="gap-y-xlarge flex flex-col">
        <div className="flex flex-col gap-y-4">
          <h3 className="inter-base-semibold">General</h3>
          <div className="gap-large grid grid-cols-2">
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
        <div className="gap-y-2xsmall flex flex-col">
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
        {manageInventory && (
          <>
            <div className="gap-y-2xsmall flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="inter-base-semibold mb-2xsmall">
                  Allow backorders
                </h3>
                <Controller
                  control={control}
                  name={path("allow_backorder")}
                  render={({ field: { value, onChange } }) => {
                    return <Switch checked={value} onCheckedChange={onChange} />
                  }}
                />
              </div>
              <p className="inter-base-regular text-grey-50">
                When checked the product will be available for purchase despite
                the product being sold out
              </p>
            </div>
            <div className="flex w-full flex-col text-base">
              <h3 className="inter-base-semibold mb-2xsmall">Quantity</h3>
              {!isLoading && locations && (
                <div className="flex w-full flex-col">
                  <div className="inter-base-regular text-grey-50 flex justify-between py-3">
                    <div className="">Location</div>
                    <div className="">In Stock</div>
                  </div>
                  {selectedLocations.map((level, i) => {
                    const locationDetails = locationsMap.get(level.location_id)
                    const locationLevel = levelMap.get(level.location_id)

                    return (
                      <div key={level.id} className="flex items-center py-3">
                        <div className="inter-base-regular flex items-center">
                          <IconBadge className="mr-base">
                            <BuildingsIcon />
                          </IconBadge>
                          {locationDetails?.name}
                        </div>
                        <div className="ml-auto flex">
                          <div className="mr-base text-small text-grey-50 flex flex-col">
                            <span className="whitespace-nowrap text-right">
                              {`${locationLevel!.reserved_quantity} reserved`}
                            </span>
                            <span className="whitespace-nowrap text-right">{`${
                              locationLevel!.stocked_quantity! -
                              locationLevel!.reserved_quantity!
                            } available`}</span>
                          </div>
                          <InputField
                            placeholder={"0"}
                            type="number"
                            min={0}
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
                      selectedLocations,
                      locations || [],
                      handleUpdateLocations
                    )
                  )
                }}
              >
                Manage locations
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export const ManageLocationsScreen = (
  pop: () => void,
  levels: Partial<InventoryLevelDTO>[],
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
  existingLevels: Partial<InventoryLevelDTO>[]
  locationOptions: StockLocationDTO[]
  onSubmit: (value: any) => Promise<void>
}

const ManageLocationsForm = ({
  existingLevels,
  locationOptions,
  onSubmit,
}: ManageLocationFormProps) => {
  const layeredModalContext = useLayeredModal()
  const { pop } = layeredModalContext

  const existingLocations = useMemo(() => {
    return existingLevels.map((level) => level.location_id!)
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
      (locationId) => !!locationId && !selectedLocations.includes(locationId)
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
    <div className="h-full w-full">
      <form onSubmit={handleSubmit}>
        <Modal.Content>
          <div>
            <div className="border-grey-20 pb-base text-grey-50 flex w-full items-center justify-between border-b">
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
                  className="border-grey-20 py-base flex items-center justify-between gap-6 border-b"
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
          <div className="gap-x-xsmall flex w-full justify-end">
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
