import clsx from "clsx"
import { useState } from "react"
import { LoginForm, ResetPasswordForm } from "../components/forms"
import { MedusaIcon } from "../components/icons"
import { PublicLayout } from "../components/layouts"

const Login = () => {
  const [resetPassword, setResetPassword] = useState(false)

  return (
    <PublicLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div
          className={clsx(
            "bg-grey-0 rounded-rounded flex min-h-[600px] w-[640px] justify-center transition-['min-height'] duration-300",
            {
              "min-h-[480px]": resetPassword,
            }
          )}
        >
          <div className="flex w-full flex-col items-center px-[120px] pt-12">
            <MedusaIcon />
            {resetPassword ? (
              <ResetPasswordForm onGoToLogin={() => setResetPassword(false)} />
            ) : (
              <LoginForm onGoToResetPassword={() => setResetPassword(true)} />
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default Login
