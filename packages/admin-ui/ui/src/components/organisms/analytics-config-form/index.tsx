import clsx from "clsx"
import React, { useEffect } from "react"
import { Controller, useWatch } from "react-hook-form"
import { NestedForm } from "../../../utils/nested-form"
import Switch from "../../atoms/switch"

export type AnalyticsConfigFormType = {
  anonymize: boolean
  opt_out: boolean
}

type Props = {
  form: NestedForm<AnalyticsConfigFormType>
}

const AnalyticsConfigForm = ({ form }: Props) => {
  const { control, setValue, path } = form

  const watchOptOut = useWatch({
    control,
    name: path("opt_out"),
  })

  useEffect(() => {
    if (watchOptOut) {
      setValue(path("anonymize"), false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchOptOut])

  return (
    <div className="flex flex-col gap-y-xlarge">
      <div
        className={clsx("flex items-start transition-opacity", {
          "opacity-50": watchOptOut,
        })}
      >
        <div className="flex flex-col flex-1 gap-y-2xsmall">
          <h2 className="inter-base-semibold">Anonymize my usage data</h2>
          <p className="inter-base-regular text-grey-50">
            You can choose to anonymize your usage data. If this option is
            selected, we will not collect your personal information, such as
            your name and email address.
          </p>
        </div>
        <Controller
          name={path("anonymize")}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Switch
                checked={value}
                onCheckedChange={onChange}
                disabled={watchOptOut}
              />
            )
          }}
        />
      </div>
      <div className="flex items-start">
        <div className="flex flex-col flex-1 gap-y-2xsmall">
          <h2 className="inter-base-semibold">
            Opt out of sharing my usage data
          </h2>
          <p className="inter-base-regular text-grey-50">
            You can always opt out of sharing your usage data at any time.
          </p>
        </div>
        <Controller
          name={path("opt_out")}
          control={control}
          render={({ field: { value, onChange } }) => {
            return <Switch checked={value} onCheckedChange={onChange} />
          }}
        />
      </div>
    </div>
  )
}

export default AnalyticsConfigForm
