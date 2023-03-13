import clsx from "clsx"
import { useState } from "react"
import MedusaIcon from "../components/fundamentals/icons/medusa-icon"
import LoginCard from "../components/organisms/login-card"
import ResetTokenCard from "../components/organisms/reset-token-card"
import SEO from "../components/seo"
import LoginLayout from "../components/templates/login-layout"

const LoginPage = () => {
  const [resetPassword, setResetPassword] = useState(false)

  return (
    <LoginLayout>
      <SEO title="Login" />
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
              <ResetTokenCard goBack={() => setResetPassword(false)} />
            ) : (
              <LoginCard toResetPassword={() => setResetPassword(true)} />
            )}
          </div>
        </div>
      </div>
    </LoginLayout>
  )
}

export default LoginPage
