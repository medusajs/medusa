import { useAdminSendResetPasswordToken } from "medusa-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import SigninInput from "../../molecules/input-signin"

type ResetTokenCardProps = {
  goBack: () => void
}

type FormValues = {
  email: string
}

const checkMail = /^\S+@\S+$/i

const ResetTokenCard: React.FC<ResetTokenCardProps> = ({ goBack }) => {
  const [unrecognizedEmail, setUnrecognizedEmail] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [mailSent, setSentMail] = useState(false)
  const { register, handleSubmit } = useForm<FormValues>()

  const sendEmail = useAdminSendResetPasswordToken()

  const onSubmit = (values: FormValues) => {
    if (!checkMail.test(values.email)) {
      setInvalidEmail(true)
      return
    }

    setInvalidEmail(false)
    setUnrecognizedEmail(false)

    sendEmail.mutate(
      {
        email: values.email,
      },
      {
        onSuccess: () => {
          setSentMail(true)
        },
        onError: () => {
          setUnrecognizedEmail(true)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center">
        <span className="inter-2xlarge-semibold mt-base text-grey-90">
          Reset your password
        </span>
        <span className="inter-base-regular text-grey-50 mt-xsmall text-center">
          Enter your email address below, and we'll send you
          <br />
          instructions on how to reset your password.
        </span>
        {!mailSent ? (
          <>
            <SigninInput
              placeholder="lebron@james.com..."
              {...register("email", { required: true })}
              className="mt-xlarge mb-0"
            />
            {unrecognizedEmail && (
              <div className="mt-xsmall w-[318px]">
                <span className="inter-small-regular text-left text-rose-50">
                  We can't find a user with that email address
                </span>
              </div>
            )}
            {invalidEmail && (
              <div className="mt-xsmall w-[318px]">
                <span className="inter-small-regular text-left text-rose-50">
                  Not a valid email address
                </span>
              </div>
            )}
            <button
              className="text-grey-0 rounded-rounded inter-base-regular mt-4 h-[48px] w-[320px] border bg-violet-50 py-3 px-4"
              type="submit"
            >
              Send reset instructions
            </button>
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
