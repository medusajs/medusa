import { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { ActionType } from "../../../../components/molecules/actionables"
import ClockIcon from "../../../../components/fundamentals/icons/clock-icon"
import { Discount } from "@medusajs/medusa"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { getErrorMessage } from "../../../../utils/error-messages"
import moment from "moment"
import { parse } from "iso8601-duration"
import { removeFalsy } from "../../../../utils/remove-nullish"
import { useAdminUpdateDiscount } from "medusa-react"
import useNotification from "../../../../hooks/use-notification"

type displaySetting = {
  title: string
  description: ReactNode
  actions?: ActionType[]
}

const DisplaySettingsDateDescription = ({ date }: { date: Date }) => (
  <div className="text-grey-50 inter-small-regular flex ">
    {moment.utc(date).format("ddd, DD MMM YYYY")}
    <span className="ms-3 flex items-center">
      <ClockIcon size={16} />
      <span className="ms-2.5">{moment.utc(date).format("UTC HH:mm")}</span>
    </span>
  </div>
)

const CommonDescription = ({ text }) => (
  <span className="text-grey-50 inter-small-regular">{text}</span>
)

const useDiscountConfigurations = (discount: Discount) => {
  const { t } = useTranslation()
  const updateDiscount = useAdminUpdateDiscount(discount.id)
  const notification = useNotification()

  const conditions: displaySetting[] = []

  conditions.push({
    title: t("configurations-start-date", "Start date"),
    description: <DisplaySettingsDateDescription date={discount.starts_at} />,
  })

  if (discount.ends_at) {
    conditions.push({
      title: t("configurations-end-date", "End date"),
      description: <DisplaySettingsDateDescription date={discount.ends_at} />,
      actions: [
        {
          label: t(
            "configurations-delete-configuration",
            "Delete configuration"
          ),
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { ends_at: null },
              {
                onSuccess: () => {
                  notification(
                    t("configurations-success", "Success"),
                    t(
                      "configurations-discount-end-date-removed",
                      "Discount end date removed"
                    ),
                    "success"
                  )
                },
                onError: (error) => {
                  notification(
                    t("configurations-error", "Error"),
                    getErrorMessage(error),
                    "error"
                  )
                },
              }
            ),
        },
      ],
    })
  }
  if (discount.usage_limit) {
    conditions.push({
      title: t("configurations-number-of-redemptions", "Number of redemptions"),
      description: (
        <CommonDescription text={discount.usage_limit.toLocaleString("en")} />
      ),
      actions: [
        {
          label: t(
            "configurations-delete-configuration",
            "Delete configuration"
          ),
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { usage_limit: null },
              {
                onSuccess: () => {
                  notification(
                    t("configurations-success", "Success"),
                    t(
                      "configurations-redemption-limit-removed",
                      "Redemption limit removed"
                    ),
                    "success"
                  )
                },
                onError: (error) => {
                  notification(
                    t("configurations-error", "Error"),
                    getErrorMessage(error),
                    "error"
                  )
                },
              }
            ),
        },
      ],
    })
  }
  if (discount.valid_duration) {
    conditions.push({
      title: "Duration",
      description: (
        <CommonDescription
          text={Object.entries(removeFalsy(parse(discount.valid_duration)))
            .map(([key, value]) => `${value} ${key}`)
            .join(", ")}
        />
      ),
      actions: [
        {
          label: t("configurations-delete-setting", "Delete setting"),
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { valid_duration: null },
              {
                onSuccess: () => {
                  notification(
                    t("configurations-success", "Success"),
                    t(
                      "configurations-discount-duration-removed",
                      "Discount duration removed"
                    ),
                    "success"
                  )
                },
                onError: (error) => {
                  notification(
                    t("configurations-error", "Error"),
                    getErrorMessage(error),
                    "error"
                  )
                },
              }
            ),
        },
      ],
    })
  }

  return conditions
}

export default useDiscountConfigurations
