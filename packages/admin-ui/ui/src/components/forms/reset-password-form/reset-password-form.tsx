import { useAdminSendResetPasswordToken } from "medusa-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button, InputError, SigninInput } from "../../atoms"
import { CheckCircleIcon } from "../../icons"

type Props = {
  onGoToLogin: () => void
}

type ResetPasswordFormDataType = {
  reset: {
    email: string
  }
}

export const ResetPasswordForm = ({ onGoToLogin }: Props) => {
  const [mailSent, setSentMail] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormDataType>()

  const { mutate, isLoading } = useAdminSendResetPasswordToken()

  const onSubmit = handleSubmit((data) => {
    mutate(
      { email: data.reset.email },
      {
        onSuccess: () => {
          setSentMail(true)
        },
        onError: () => {
          setError("reset", {
            type: "manual",
            message: "We can't find a user with that email address",
          })
        },
      }
    )
  })

  return (
    <form onSubmit={onSubmit}>
      <div className="flex w-[320px] flex-col items-center">
        <span className="inter-2xlarge-semibold mt-base text-grey-90">
          Reset your password
        </span>
        <span className="inter-base-regular text-grey-50 mt-xsmall text-center">
          Enter your email address below, and we'll send you instructions on how
          to reset your password.
        </span>
        {!mailSent ? (
          <>
            <SigninInput
              placeholder="lebron@james.com..."
              errors={errors}
              {...register("reset.email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="mt-xlarge mb-0"
            />
            <div className="flex w-full items-center justify-start">
              <InputError errors={errors} name="reset" />
            </div>
            <Button
              className="rounded-rounded inter-base-regular mt-4 w-full"
              type="submit"
              variant="primary"
              size="large"
              loading={isLoading}
            >
              Send reset instructions
            </Button>
          </>
        ) : (
          <div className="text-violet-60 rounded-rounded bg-violet-10 p-base gap-x-small mt-large flex">
            <div>
              <CheckCircleIcon size={20} />
            </div>
            <div className="gap-y-2xsmall flex flex-col">
              <span className="inter-small-semibold">
                Succesfully sent you an email
              </span>
              <span className="inter-small-regular">
                We've sent you an email which you can use to reset your
                password. Check your spam folder if you haven't received it
                after a few minutes.
              </span>
            </div>
          </div>
        )}
        <button
          className="inter-small-regular text-grey-50 mt-8 cursor-pointer appearance-none"
          type="button"
          onClick={onGoToLogin}
        >
          Go back to sign in
        </button>
      </div>
    </form>
  )
}
