import clsx from "clsx"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import useNotification from "../../../hooks/use-notification"
import { useAnalytics } from "../../../providers/analytics-provider"
import { useAdminCreateAnalyticsConfig } from "../../../services/analytics"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import FocusModal from "../../molecules/modal/focus-modal"
import AnalyticsConfigForm, {
  AnalyticsConfigFormType,
} from "../analytics-config-form"

type AnalyticsPreferenceFormType = {
  email?: string
  config: AnalyticsConfigFormType
}

const AnalyticsPreferencesModal = () => {
  const { t } = useTranslation()
  const notification = useNotification()
  const { mutate, isLoading } = useAdminCreateAnalyticsConfig()

  const form = useForm<AnalyticsPreferenceFormType>({
    defaultValues: {
      config: {
        anonymize: false,
        opt_out: false,
      },
    },
  })
  const {
    register,
    formState: { errors },
    control,
  } = form

  const { setSubmittingConfig, trackUserEmail } = useAnalytics()

  const watchOptOut = useWatch({
    control: control,
    name: "config.opt_out",
  })

  const watchAnonymize = useWatch({
    control: control,
    name: "config.anonymize",
  })

  const onSubmit = form.handleSubmit((data) => {
    setSubmittingConfig(true)
    const { email, config } = data

    const shouldTrackEmail = !config.anonymize && !config.opt_out

    mutate(config, {
      onSuccess: () => {
        notification(
          t("analytics-preferences-success", "Success"),
          t(
            "analytics-preferences-your-preferences-were-successfully-updated",
            "Your preferences were successfully updated"
          ),
          "success"
        )

        if (shouldTrackEmail) {
          trackUserEmail({ email })
        }

        setSubmittingConfig(false)
      },
      onError: (err) => {
        notification(
          t("analytics-preferences-error", "Error"),
          getErrorMessage(err),
          "error"
        )
        setSubmittingConfig(false)
      },
    })
  })

  return (
    <FocusModal>
      <FocusModal.Main>
        <div className="flex flex-col items-center">
          <div className="mt-5xlarge flex w-full max-w-[664px] flex-col">
            <h1 className="inter-xlarge-semibold mb-large">
              {t(
                "analytics-preferences-help-us-get-better",
                "Help us get better"
              )}
            </h1>
            <p className="text-grey-50">
              {t(
                "analytics-preferences-disclaimer",
                "To create the most compelling e-commerce experience we would like to gain insights in how you use Medusa. User insights allow us to build a better, more engaging, and more usable products. We only collect data for product improvements. Read what data we gather in our"
              )}{" "}
              <a
                href="https://docs.medusajs.com/usage"
                rel="noreferrer noopener"
                target="_blank"
                className="text-violet-60"
              >
                {t("analytics-preferences-documentation", "documentation")}
              </a>
              .
            </p>
            <div className="mt-xlarge gap-y-xlarge flex flex-col">
              <InputField
                label={"Email"}
                placeholder="you@company.com"
                disabled={watchOptOut || watchAnonymize}
                className={clsx("transition-opacity", {
                  "opacity-50": watchOptOut || watchAnonymize,
                })}
                {...register("email", {
                  pattern: {
                    message: t(
                      "analytics-preferences-please-enter-a-valid-email",
                      "Please enter a valid email"
                    ),
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  },
                })}
                errors={errors}
              />
              <AnalyticsConfigForm form={nestedForm(form, "config")} />
            </div>
            <div className="mt-5xlarge flex items-center justify-end">
              <Button
                variant="primary"
                size="small"
                loading={isLoading}
                onClick={onSubmit}
              >
                {t("analytics-preferences-continue", "Continue")}
              </Button>
            </div>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default AnalyticsPreferencesModal
