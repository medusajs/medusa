import { useAdminLogin } from "medusa-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import InputError from "../../atoms/input-error"
import Button from "../../fundamentals/button"
import SigninInput from "../../molecules/input-signin"

type FormValues = {
  email: string
  password: string
}

type LoginCardProps = {
  toResetPassword: () => void
}

const LoginCard = ({ toResetPassword }: LoginCardProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>()
  const navigate = useNavigate()
  const { mutate, isLoading } = useAdminLogin()

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        navigate("/a/orders")
      },
      onError: () => {
        setError(
          "password",
          {
            type: "manual",
            message: "These credentials do not match our records.",
          },
          {
            shouldFocus: true,
          }
        )
      },
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center">
        <h1 className="inter-xlarge-semibold text-grey-90 mb-large text-[20px]">
          Log in to Medusa
        </h1>
        <div>
          <SigninInput
            placeholder="Email"
            {...register("email", { required: true })}
            autoComplete="email"
            className="mb-small"
          />
          <SigninInput
            placeholder="Password"
            type={"password"}
            {...register("password", { required: true })}
            autoComplete="current-password"
            className="mb-xsmall"
          />
          <InputError errors={errors} name="password" />
        </div>
        <Button
          className="rounded-rounded inter-base-regular mt-4 w-[280px]"
          variant="secondary"
          size="medium"
          type="submit"
          loading={isLoading}
        >
          Continue
        </Button>
        <span
          className="inter-small-regular text-grey-50 mt-8 cursor-pointer"
          onClick={toResetPassword}
        >
          Forgot your password?
        </span>
      </div>
    </form>
  )
}

export default LoginCard
