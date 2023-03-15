import { ReactNode } from "react"

import { ActionType } from "../../../../components/molecules/actionables"
import ClockIcon from "../../../../components/fundamentals/icons/clock-icon"
import { Discount } from "@medusajs/medusa"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { getErrorMessage } from "../../../../utils/error-messages"
import moment from "moment"
import { parse } from "iso8601-duration"
import { removeNullish } from "../../../../utils/remove-nullish"
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
    <span className="ml-3 flex items-center">
      <ClockIcon size={16} />
      <span className="ml-2.5">{moment.utc(date).format("UTC HH:mm")}</span>
    </span>
  </div>
)

const CommonDescription = ({ text }) => (
  <span className="text-grey-50 inter-small-regular">{text}</span>
)

const useDiscountConfigurations = (discount: Discount) => {
  const updateDiscount = useAdminUpdateDiscount(discount.id)
  const notification = useNotification()

  const conditions: displaySetting[] = []

  conditions.push({
    title: "Start date",
    description: <DisplaySettingsDateDescription date={discount.starts_at} />,
  })

  if (discount.ends_at) {
    conditions.push({
      title: "End date",
      description: <DisplaySettingsDateDescription date={discount.ends_at} />,
      actions: [
        {
          label: "Delete configuration",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { ends_at: null },
              {
                onSuccess: () => {
                  notification(
                    "Success",
                    "Discount end date removed",
                    "success"
                  )
                },
                onError: (error) => {
                  notification("Error", getErrorMessage(error), "error")
                },
              }
            ),
        },
      ],
    })
  }
  if (discount.usage_limit) {
    conditions.push({
      title: "Number of redemptions",
      description: (
        <CommonDescription text={discount.usage_limit.toLocaleString("en")} />
      ),
      actions: [
        {
          label: "Delete configuration",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { usage_limit: null },
              {
                onSuccess: () => {
                  notification("Success", "Redemption limit removed", "success")
                },
                onError: (error) => {
                  notification("Error", getErrorMessage(error), "error")
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
          text={Object.entries(removeNullish(parse(discount.valid_duration)))
            .map(([key, value]) => `${value} ${key}`)
            .join(", ")}
        />
      ),
      actions: [
        {
          label: "Delete setting",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { valid_duration: null },
              {
                onSuccess: () => {
                  notification(
                    "Success",
                    "Discount duration removed",
                    "success"
                  )
                },
                onError: (error) => {
                  notification("Error", getErrorMessage(error), "error")
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
