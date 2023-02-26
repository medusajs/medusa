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
              {...register('email', { required: true })}
              className="mb-0 mt-xlarge" />
            {unrecognizedEmail && (
              <div className="mt-xsmall w-[318px]">
                <span className="inter-small-regular text-rose-50 text-left">
                  We can't find a user with that email address
                </span>
              </div>
            )}
            {invalidEmail && (
              <div className="mt-xsmall w-[318px]">
                <span className="inter-small-regular text-rose-50 text-left">
                  Not a valid email address
                </span>
              </div>
            )}
            <button
              className="text-grey-0 w-[320px] h-[48px] border rounded-rounded mt-4 bg-violet-50 inter-base-regular py-3 px-4"
              type="submit"
            >
              Send reset instructions
            </button>
          </>
        ) : (
          <div className="text-violet-60 rounded-rounded bg-violet-10 p-base flex gap-x-small mt-large">
            <div>
              <CheckCircleIcon size={20} />
            </div>
            <div className="flex flex-col gap-y-2xsmall">
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
  );
}

export default ResetTokenCard
