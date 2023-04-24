import { useAdminRegions } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { Controller, useWatch } from "react-hook-form"
import { SteppedContext } from "../../../../components/molecules/modal/stepped-modal"
import Select from "../../../../components/molecules/select"
import { useNewOrderForm } from "../form"

const SelectRegionScreen = () => {
  const { enableNextPage, disableNextPage } = React.useContext(SteppedContext)

  const { control } = useNewOrderForm()

  const reg = useWatch({
    control,
    name: "region",
  })

  const { regions } = useAdminRegions()

  const regionOptions = useMemo(() => {
    if (!regions) {
      return []
    }

    return regions.map((region) => ({
      label: region.name,
      value: region.id,
    }))
  }, [regions])

  useEffect(() => {
    if (!reg) {
      disableNextPage()
    } else {
      enableNextPage()
    }
  }, [reg])

  return (
    <div className="flex flex-col min-h-[705px]">
      <span className="inter-base-semibold mb-4">Choose region</span>
      <Controller
        control={control}
        name="region"
        render={({ field: { onChange, value } }) => {
          return (
            <Select
              label="Region"
              onChange={onChange}
              value={value}
              options={regionOptions}
            />
          )
        }}
      />
    </div>
  )
}

export default SelectRegionScreen
