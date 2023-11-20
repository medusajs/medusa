import { useTranslation } from "react-i18next"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"
import TextArea from "../../../molecules/textarea"

export type GiftCardReceiverFormType = {
  email: string
  message?: string
}

type GiftCardReceiverFormProps = {
  form: NestedForm<GiftCardReceiverFormType>
}

const GiftCardReceiverForm = ({ form }: GiftCardReceiverFormProps) => {
  const { t } = useTranslation()
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div className="gap-y-large flex flex-col">
      <InputField
        label={t("Email")}
        {...register(path("email"), {
          required: FormValidator.required(t("Email")),
          pattern: FormValidator.email(t("Email")),
        })}
        required
        errors={errors}
      />
      <TextArea
        label={t("Personal Message")}
        placeholder={t("Write a personal message here")}
        rows={7}
        {...register(path("message"))}
      />
    </div>
  )
}

export default GiftCardReceiverForm
