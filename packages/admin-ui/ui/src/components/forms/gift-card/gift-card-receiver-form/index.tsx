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
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div className="gap-y-large flex flex-col">
      <InputField
        label="Email"
        {...register(path("email"), {
          required: FormValidator.required("Email"),
          pattern: FormValidator.email("Email"),
        })}
        required
        errors={errors}
      />
      <TextArea
        label="Personal Message"
        placeholder="Write a personal message here"
        rows={7}
        {...register(path("message"))}
      />
    </div>
  )
}

export default GiftCardReceiverForm
