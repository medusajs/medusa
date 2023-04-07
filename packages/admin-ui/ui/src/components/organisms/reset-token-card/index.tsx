import { useAdminSendResetPasswordToken } from "medusa-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import FormValidator from "../../../utils/form-validator"
import InputError from "../../atoms/input-error"
import Button from "../../fundamentals/button"
import CheckCircleFillIcon from "../../fundamentals/icons/check-circle-fill-icon"
import SigninInput from "../../molecules/input-signin"

type ResetTokenCardProps = {
  goBack: () => void
}

type FormValues = {
  email: string
}

const emailRegex = new RegExp(
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
)

const ResetTokenCard: React.FC<ResetTokenCardProps> = ({ goBack }) => {
  const [mailSent, setSentMail] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const { mutate, isLoading } = useAdminSendResetPasswordToken()
  const notification = useNotification()

  const onSubmit = handleSubmit((values: FormValues) => {
    mutate(
      {
        email: values.email,
      },
      {
        onSuccess: () => {
          setSentMail(true)
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  })

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col items-center">
        <h1 className="inter-xlarge-semibold text-grey-90 mb-xsmall text-[20px]">
          Reset your password
        </h1>
        <span className="inter-base-regular text-grey-50 mb-large text-center">
          Enter your email address below, and we&apos;ll
          <br />
          send you instructions on how to reset
          <br />
          your password.
        </span>
        {!mailSent ? (
          <>
            <div className="w-[280px]">
              <SigninInput
                placeholder="Email"
                {...register("email", {
                  required: FormValidator.required("Email"),
                  pattern: {
                    value: emailRegex,
                    message: "This is not a valid email",
                  },
                })}
              />
              <InputError errors={errors} name="email" />
            </div>
            <Button
              variant="secondary"
              size="medium"
              className="mt-large w-[280px]"
              type="submit"
              loading={isLoading}
            >
              Send reset instructions
            </Button>
          </>
        ) : (
          <div className="text-grey-60 rounded-rounded bg-grey-5 border-grey-20 p-base gap-x-small flex w-[280px] items-center border">
            <div>
              <CheckCircleFillIcon className="text-blue-50" size={20} />
            </div>
            <div className="gap-y-2xsmall flex flex-col">
              <span className="inter-base-regular">
                Succesfully sent you an email
              </span>
            </div>
          </div>
        )}
        <span
          className="inter-small-regular text-grey-50 mt-8 cursor-pointer"
          onClick={goBack}
        >
          Go back to sign in
        </span>
      </div>
    </form>
  )
}

export default ResetTokenCard
