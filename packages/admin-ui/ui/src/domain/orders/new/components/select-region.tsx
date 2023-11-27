import { useAdminRegions } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { Controller, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { SteppedContext } from "../../../../components/molecules/modal/stepped-modal"
import { NextSelect } from "../../../../components/molecules/select/next-select"
import { useNewOrderForm } from "../form"

const SelectRegionScreen = () => {
  const { t } = useTranslation()
  const { enableNextPage, disableNextPage } = React.useContext(SteppedContext)

  const {
    form: { control },
  } = useNewOrderForm()

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
    <div className="flex min-h-[705px] flex-col">
      <span className="inter-base-semibold mb-4">
        {t("components-choose-region", "Choose region")}
      </span>
      <Controller
        control={control}
        name="region"
        render={({ field: { onChange, value } }) => {
          return (
            <NextSelect
              label={t("components-region", "Region")}
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
