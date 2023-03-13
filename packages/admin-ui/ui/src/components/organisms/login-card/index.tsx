import { useAdminLogin } from "medusa-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../fundamentals/button"
import SigninInput from "../../molecules/input-signin"

type FormValues = {
  email: string
  password: string
}

type LoginCardProps = {
  toResetPassword: () => void
}

const LoginCard: React.FC<LoginCardProps> = ({ toResetPassword }) => {
  const [isInvalidLogin, setIsInvalidLogin] = useState(false)
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const navigate = useNavigate()
  const login = useAdminLogin()

  const onSubmit = (values: FormValues) => {
    login.mutate(values, {
      onSuccess: () => {
        navigate("/a/orders")
      },
      onError: () => {
        setIsInvalidLogin(true)
        reset()
      },
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        <SigninInput
          placeholder="Email..."
          {...register("email", { required: true })}
          autoComplete="email"
        />
        <SigninInput
          placeholder="Password..."
          type={"password"}
          {...register("password", { required: true })}
          autoComplete="current-password"
        />
        {isInvalidLogin && (
          <span className="inter-small-regular mt-2 w-full text-rose-50">
            These credentials do not match our records
          </span>
        )}
        <Button
          className="rounded-rounded inter-base-regular mt-4 w-[320px]"
          variant="primary"
          size="large"
          type="submit"
          loading={login.isLoading}
        >
          Continue
        </Button>
        <span
          className="inter-small-regular text-grey-50 mt-8 cursor-pointer"
          onClick={toResetPassword}
        >
          Reset password
        </span>
      </div>
    </form>
  )
}

export default LoginCard
