import clsx from "clsx"
import { useEffect } from "react"
import { Controller, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { NestedForm } from "../../../utils/nested-form"
import Switch from "../../atoms/switch"
import InfoIcon from "../../fundamentals/icons/info-icon"
import Tooltip from "../../atoms/tooltip"

export type AnalyticsConfigFormType = {
  anonymize: boolean
  opt_out: boolean
}

type Props = {
  form: NestedForm<AnalyticsConfigFormType>
  compact?: boolean
}

const AnalyticsConfigForm = ({ form, compact }: Props) => {
  const { control, setValue, path } = form
  const { t } = useTranslation()

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
    <div className="gap-y-xlarge flex flex-col">
      <div
        className={clsx("flex items-center gap-3 transition-opacity", {
          "opacity-50": watchOptOut,
        })}
      >
        <div className="gap-y-2xsmall flex flex-1 flex-col">
          <div className="flex items-center">
            <h2 className="inter-base-semibold mr-2">
              {t("analytics-config-form-title", "Anonymize my usage data")}
            </h2>
            {compact && (
              <Tooltip
                content={t(
                  "analytics-config-form-description",
                  "You can choose to anonymize your usage data. If this option is selected, we will not collect your personal information, such as your name and email address."
                )}
                side="top"
              >
                <InfoIcon size="18px" color={"#889096"} />
              </Tooltip>
            )}
          </div>
          {!compact && (
            <p className="inter-base-regular text-grey-50">
              {t(
                "analytics-config-form-description",
                "You can choose to anonymize your usage data. If this option is selected, we will not collect your personal information, such as your name and email address."
              )}
            </p>
          )}
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
      <div className="flex items-center gap-3">
        <div className="gap-y-2xsmall flex flex-1 flex-col">
          <div className="flex items-center">
            <h2 className="inter-base-semibold mr-2">
              {t(
                "analytics-config-form-opt-out",
                "Opt out of sharing my usage data"
              )}
            </h2>
            {compact && (
              <Tooltip
                content={t(
                  "analytics-config-form-opt-out-later",
                  "You can always opt out of sharing your usage data at any time."
                )}
                side="top"
              >
                <InfoIcon size="18px" color={"#889096"} />
              </Tooltip>
            )}
          </div>
          {!compact && (
            <p className="inter-base-regular text-grey-50">
              {t(
                "analytics-config-form-opt-out-later",
                "You can always opt out of sharing your usage data at any time."
              )}
            </p>
          )}
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
