import { Spinner } from "@medusajs/icons"
import type { AuthTypes } from "@medusajs/types"
import { Heading, InlineTip, Text } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import { Link, useLocation, useNavigate } from "react-router-dom"

import AvatarBox from "../../components/common/logo-box/avatar-box"
import { useAuthProviders } from "../../hooks/api"
import { useExtension } from "../../providers/extension-provider"
import { CloudAuthLogin } from "./components/cloud-auth-login"
import { EmailPassLogin } from "./components/email-pass-login"
import { MfaChallengeCard } from "./components/mfa-challenge-card"
import { SsoLogin } from "./components/sso-login"
import { hasEmailPassProvider } from "./utils"

export const Login = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { getWidgets } = useExtension()
  const [mfaChallenge, setMfaChallenge] =
    useState<AuthTypes.AuthMfaChallengeDTO | null>(null)
  const [mfaSuccessHandler, setMfaSuccessHandler] = useState<
    ((token: string) => void | Promise<void>) | null
  >(null)

  const from = location.state?.from?.pathname || "/orders"

  const { providers, isLoading: isProvidersLoading } = useAuthProviders()

  const providerList = useMemo(() => providers ?? [], [providers])
  const isEmailPassInstalled = useMemo(
    () => hasEmailPassProvider(providerList),
    [providerList]
  )

  const handleMfaChallenge = (
    challenge: AuthTypes.AuthMfaChallengeDTO,
    onSuccess: (token: string) => void | Promise<void>
  ) => {
    setMfaChallenge(challenge)
    setMfaSuccessHandler(() => onSuccess)
  }

  if (mfaChallenge) {
    return (
      <div className="bg-ui-bg-subtle flex min-h-dvh w-dvw items-center justify-center">
        <MfaChallengeCard
          challenge={mfaChallenge}
          onSuccess={(token) => {
            if (mfaSuccessHandler) {
              return mfaSuccessHandler(token)
            }

            navigate(from, { replace: true })
          }}
          onBack={() => {
            setMfaChallenge(null)
            setMfaSuccessHandler(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="bg-ui-bg-subtle flex min-h-dvh w-dvw items-center justify-center">
      <div className="m-4 flex w-full max-w-[280px] flex-col items-center">
        <AvatarBox />
        <div className="mb-4 flex flex-col items-center">
          <Heading>{t("login.title")}</Heading>
          <Text size="small" className="text-ui-fg-subtle text-center">
            {t("login.hint")}
          </Text>
        </div>
        <div className="flex w-full flex-col gap-y-3">
          {getWidgets("login.before").map((Component, i) => {
            return <Component key={i} />
          })}
          {isProvidersLoading ? (
            <div className="flex w-full items-center justify-center py-6">
              <Spinner className="text-ui-fg-subtle animate-spin" />
            </div>
          ) : !providerList.length ? (
            <div>
              <InlineTip label={t("general.tip")}>
                {t("auth.login.noProviders")}
              </InlineTip>
            </div>
          ) : (
            isEmailPassInstalled && (
              <EmailPassLogin onMfaChallenge={handleMfaChallenge} />
            )
          )}
          {getWidgets("login.after").map((Component, i) => {
            return <Component key={i} />
          })}
          <CloudAuthLogin onMfaChallenge={handleMfaChallenge} />
          <SsoLogin
            providers={providerList}
            onMfaChallenge={handleMfaChallenge}
          />
        </div>
        {isEmailPassInstalled && (
          <span className="text-ui-fg-muted txt-small my-6">
            <Trans
              i18nKey="login.forgotPassword"
              components={[
                <Link
                  key="reset-password-link"
                  to="/reset-password"
                  className="text-ui-fg-interactive transition-fg hover:text-ui-fg-interactive-hover focus-visible:text-ui-fg-interactive-hover font-medium outline-none"
                />,
              ]}
            />
          </span>
        )}
      </div>
    </div>
  )
}
