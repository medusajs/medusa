import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"
import TextArea from "../../../molecules/textarea"
import { useTranslation } from "react-i18next"

export type GeneralFormType = {
  title: string
  subtitle: string | null
  handle: string
  material: string | null
  description: string | null
}

type Props = {
  form: NestedForm<GeneralFormType>
  requireHandle?: boolean
  isGiftCard?: boolean
}

const GeneralForm = ({ form, requireHandle = true, isGiftCard }: Props) => {
  const { t } = useTranslation()
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <div className="gap-x-large mb-small grid grid-cols-2">
        <InputField
          label={t("general-form-title", "Title")}
          placeholder={
            isGiftCard
              ? t("general-form-title-placeholder-gift-card", "Gift Card")
              : t(
                  "general-form-title-placeholder-winter-jacket",
                  "Winter Jacket"
                )
          }
          required
          {...register(path("title"), {
            required: t("general-form-title-is-required", "Title is required"),
            minLength: {
              value: 1,
              message: t(
                "general-form-title-min-length",
                "Title must be at least 1 character"
              ),
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
        />
        <InputField
          label={t("general-form-subtitle", "Subtitle")}
          placeholder={t(
            "general-form-subtitle-placeholder",
            "Warm and cozy..."
          )}
          {...register(path("subtitle"), {
            pattern: FormValidator.whiteSpaceRule("Subtitle"),
          })}
          errors={errors}
        />
      </div>
      <p className="inter-base-regular text-grey-50 mb-large">
        {isGiftCard
          ? t(
              "general-form-title-hint-0-gift-card",
              "Give your gift card a short and clear title."
            )
          : t(
              "general-form-title-hint-0-product",
              "Give your product a short and clear title."
            )}
        <br />
        {t(
          "general-form-title-hint-1",
          "50-60 characters is the recommended length for search engines."
        )}
      </p>
      <div className="gap-x-large mb-large grid grid-cols-2">
        <InputField
          label={t("general-form-handle", "Handle")}
          tooltipContent={
            !requireHandle
              ? isGiftCard
                ? t(
                    "general-form-handle-tooltip-gift-card",
                    "The handle is the part of the URL that identifies the gift card. If not specified, it will be generated from the title."
                  )
                : t(
                    "general-form-handle-tooltip-product",
                    "The handle is the part of the URL that identifies the product. If not specified, it will be generated from the title."
                  )
              : undefined
          }
          placeholder={
            isGiftCard
              ? t("general-form-handle-placeholder-gift-card", "gift-card")
              : t(
                  "general-form-handle-placeholder-winter-jacket",
                  "winter-jacket"
                )
          }
          required={requireHandle}
          {...register(path("handle"), {
            required: requireHandle ? "Handle is required" : undefined,
            minLength: FormValidator.minOneCharRule("Handle"),
            pattern: FormValidator.whiteSpaceRule("Handle"),
          })}
          prefix="/"
          errors={errors}
        />
        <InputField
          label={t("general-form-material", "Material")}
          placeholder={
            isGiftCard
              ? t("general-form-material-placeholder-paper", "Paper")
              : t("general-form-material-placeholder-cotton", "100% Cotton")
          }
          {...register(path("material"), {
            minLength: FormValidator.minOneCharRule("Material"),
            pattern: FormValidator.whiteSpaceRule("Material"),
          })}
          errors={errors}
        />
      </div>
      <TextArea
        label={t("general-form-description", "Description")}
        placeholder={
          isGiftCard
            ? t(
                "general-form-description-placeholder-gift-card",
                "The gift card is..."
              )
            : t(
                "general-form-description-placeholder-product",
                "A warm and cozy jacket..."
              )
        }
        rows={3}
        className="mb-small"
        {...register(path("description"))}
        errors={errors}
      />
      <p className="inter-base-regular text-grey-50">
        {isGiftCard
          ? t(
              "general-form-description-hint-0-gift-card",
              "Give your product a short and clear description."
            )
          : t(
              "general-form-description-hint-0-product",
              "Give your product a short and clear description."
            )}
        <br />
        {t(
          "general-form-description-hint-1",
          "120-160 characters is the recommended length for search engines."
        )}
      </p>
    </div>
  )
}

export default GeneralForm
