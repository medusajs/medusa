import { useAdminLogin } from "medusa-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button, InputError, SigninInput } from "../../atoms"

type LoginFormDataType = {
  login: {
    email: string
    password: string
  }
}

type Props = {
  onGoToResetPassword: () => void
}

export const LoginForm = ({ onGoToResetPassword }: Props) => {
  const navigate = useNavigate()
  const {
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<LoginFormDataType>()

  const { mutate, isLoading } = useAdminLogin()

  const onSubmit = handleSubmit((data) => {
    mutate(
      { ...data.login },
      {
        onSuccess: () => {
          navigate("/")
        },
        onError: () => {
          setError("login", {
            type: "manual",
            message: "These credentials do not match our records",
          })
        },
      }
    )
  })

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col items-center">
        <span className="inter-2xlarge-semibold text-grey-90 mt-4">
          Welcome back!
        </span>
        <span className="inter-base-regular text-grey-50 mt-2">
          It's great to see you 👋🏼
        </span>
        <span className="inter-base-regular text-grey-50 mb-xlarge">
          Log in to your account below
        </span>
        <div className="gap-y-xsmall flex flex-col">
          <SigninInput
            placeholder="Email"
            errors={errors}
            {...register("login.email", { required: "Email is required" })}
            autoComplete="email"
          />
          <SigninInput
            placeholder="Password"
            errors={errors}
            type={"password"}
            {...register("login.password", {
              required: "Password is required",
            })}
            autoComplete="current-password"
          />
        </div>
        <div className="flex w-full items-center justify-start">
          <InputError errors={errors} name="login" />
        </div>
        <Button
          className="rounded-rounded inter-base-regular mt-4 w-[320px]"
          variant="primary"
          size="large"
          type="submit"
          loading={isLoading}
        >
          Continue
        </Button>
        <button
          className="inter-small-regular text-grey-50 mt-8 cursor-pointer appearance-none"
          onClick={onGoToResetPassword}
          type="button"
        >
          Reset password
        </button>
      </div>
    </form>
  )
}
