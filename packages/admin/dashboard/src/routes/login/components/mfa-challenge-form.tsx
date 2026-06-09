import { Button, Heading, Hint, Input, OtpInput, Text } from "@medusajs/ui"
import type { AuthTypes } from "@medusajs/types"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useVerifyAuthMfaChallenge } from "../../../hooks/api"

const getDefaultMethod = (
  methods: AuthTypes.AuthMfaChallengeMethod[]
): AuthTypes.AuthMfaChallengeMethod => {
  if (methods.includes("totp")) {
    return "totp"
  }

  return methods[0] ?? "totp"
}

type MfaChallengeFormProps = {
  challenge: AuthTypes.AuthMfaChallengeDTO
  onSuccess: (token: string) => void | Promise<void>
  onBack?: () => void
}

export const MfaChallengeForm = ({
  challenge,
  onSuccess,
  onBack,
}: MfaChallengeFormProps) => {
  const { t } = useTranslation()
  const [method, setMethod] = useState<AuthTypes.AuthMfaChallengeMethod>(
    getDefaultMethod(challenge.methods)
  )
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const { mutateAsync, isPending } = useVerifyAuthMfaChallenge()

  const isRecoveryCode = method === "recovery_code"
  const canUseRecoveryCode = challenge.methods.includes("recovery_code")
  const canVerify = isRecoveryCode ? !!code.trim() : code.length === 6
  const isLoading = isPending || isCompleting

  const handleVerify = async (nextCode = code) => {
    const verificationCode = nextCode.trim()

    if (
      !verifiedToken &&
      (!verificationCode || (!isRecoveryCode && verificationCode.length !== 6))
    ) {
      return
    }

    setError(null)

    let token = verifiedToken

    if (!token) {
      try {
        token = await mutateAsync({
          id: challenge.id,
          method,
          code: verificationCode,
        })
        setVerifiedToken(token)
      } catch (e) {
        setError(e instanceof Error ? e.message : t("login.mfa.verifyError"))
        setCode("")
        return
      }
    }

    setIsCompleting(true)

    try {
      await onSuccess(token)
    } catch (e) {
      setError(e instanceof Error ? e.message : t("login.mfa.completeError"))
    } finally {
      setIsCompleting(false)
    }
  }

  const handleOtpChange = (value: string) => {
    setCode(value)
  }

  const handleMethodChange = (nextMethod: AuthTypes.AuthMfaChallengeMethod) => {
    setMethod(nextMethod)
    setCode("")
    setError(null)
    setVerifiedToken(null)
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 flex flex-col items-center">
        <Heading>{t("login.mfa.title")}</Heading>
        <Text size="small" className="text-ui-fg-subtle text-center">
          {isRecoveryCode
            ? t("login.mfa.recoveryDescription")
            : t("login.mfa.description")}
        </Text>
      </div>
      <div className="flex w-full flex-col gap-y-4">
        {isRecoveryCode ? (
          <Input
            autoComplete="one-time-code"
            className="bg-ui-bg-field-component"
            placeholder={t("login.mfa.recoveryCodePlaceholder")}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading || !!verifiedToken}
          />
        ) : (
          <OtpInput
            value={code}
            onChange={handleOtpChange}
            onComplete={handleVerify}
            disabled={isLoading || !!verifiedToken}
            autoFocus
          />
        )}
        {error && (
          <div className="text-center">
            <Hint className="inline-flex" variant="error">
              {error}
            </Hint>
          </div>
        )}
        <Button
          className="w-full"
          isLoading={isLoading}
          disabled={!verifiedToken && !canVerify}
          onClick={() => handleVerify()}
        >
          {t("login.mfa.verify")}
        </Button>
        {onBack && (
          <Link
            to="/login"
            className="txt-small text-ui-fg-muted transition-fg hover:text-ui-fg-subtle focus-visible:text-ui-fg-subtle text-center outline-none"
            onClick={onBack}
          >
            {t("login.mfa.backToLogin")}
          </Link>
        )}
      </div>
      {canUseRecoveryCode && (
        <div className="text-ui-fg-muted txt-small mt-6 text-center">
          {isRecoveryCode
            ? t("login.mfa.useAuthenticatorPrompt")
            : t("login.mfa.useRecoveryCodePrompt")}{" "}
          <button
            type="button"
            className="text-ui-fg-interactive transition-fg hover:text-ui-fg-interactive-hover focus-visible:text-ui-fg-interactive-hover font-medium outline-none"
            onClick={() =>
              handleMethodChange(isRecoveryCode ? "totp" : "recovery_code")
            }
          >
            {isRecoveryCode
              ? t("login.mfa.useAuthenticator")
              : t("login.mfa.useRecoveryCode")}
          </button>
        </div>
      )}
    </div>
  )
}
