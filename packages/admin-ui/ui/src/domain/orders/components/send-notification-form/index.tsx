import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import IndeterminateCheckbox from "../../../../components/molecules/indeterminate-checkbox"
import { NestedForm } from "../../../../utils/nested-form"

export type SendNotificationFormType = {
  send_notification: boolean
}

type Props = {
  form: NestedForm<SendNotificationFormType>
  type: "return" | "swap" | "claim"
}

const SendNotificationForm = ({ form, type }: Props) => {
  const { t } = useTranslation()
  const { control, path } = form

  const subject = {
    return: t("send-notification-form-return", "return"),
    swap: t("send-notification-form-exchange", "exchange"),
    claim: t("send-notification-form-claim", "claim"),
  }[type]

  return (
    <Controller
      control={control}
      name={path("send_notification")}
      render={({ field: { value, onChange } }) => {
        return (
          <div className="flex items-center">
            <div className="me-xsmall">
              <IndeterminateCheckbox checked={value} onChange={onChange} />
            </div>
            <p className="inter-small-semibold me-1.5">
              {t(
                "send-notification-form-send-notifications",
                "Send notifications"
              )}
            </p>
            <IconTooltip
              type="info"
              content={t(
                "send-notification-form-if-unchecked-the-customer-will-not-receive-communication",
                "If unchecked the customer will not receive communication about this {{subject}}.",
                { subject }
              )}
            />
          </div>
        )
      }}
    />
  )
}

export default SendNotificationForm
