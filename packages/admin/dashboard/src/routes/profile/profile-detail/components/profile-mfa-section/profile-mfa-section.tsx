import { Key, ShieldCheck } from "@medusajs/icons"
import {
  Badge,
  Button,
  Container,
  Heading,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  AuthMfa,
  AuthMfaSetupResponse,
  useAuthMfa,
  useDisableAuthMfa,
  useStartAuthMfa,
} from "../../../../../hooks/api"
import { MfaDisableModal } from "./mfa-disable-modal"
import { MfaSetupModal } from "./mfa-setup-modal"

export const ProfileMfaSection = () => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mfa_factors: factors = [], isPending } = useAuthMfa()
  const [setup, setSetup] = useState<AuthMfaSetupResponse | null>(null)
  const [disableChallengeFactor, setDisableChallengeFactor] =
    useState<AuthMfa | null>(null)
  const { mutateAsync: startMfa, isPending: isStarting } = useStartAuthMfa()

  const enabledFactor = useMemo(() => {
    return factors.find((factor) => factor.status === "enabled")
  }, [factors])

  const pendingFactor = useMemo(() => {
    return factors.find((factor) => factor.status === "pending")
  }, [factors])

  const enabledFactorLabel =
    typeof enabledFactor?.metadata?.label === "string"
      ? enabledFactor.metadata.label
      : undefined

  const { mutateAsync: disableMfa, isPending: isDisabling } = useDisableAuthMfa(
    enabledFactor?.id ?? ""
  )
  const { mutateAsync: cancelPendingMfa, isPending: isCancellingPending } =
    useDisableAuthMfa(pendingFactor?.id ?? "")

  const handleSetup = async () => {
    try {
      if (pendingFactor) {
        await cancelPendingMfa()
      }

      const response = await startMfa({
        provider: "totp",
        label: t("profile.mfa.authenticatorApp"),
      })

      setSetup(response)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("profile.mfa.setupError"))
    }
  }

  const handleDisable = async () => {
    if (!enabledFactor) {
      return
    }

    const confirmed = await prompt({
      title: t("profile.mfa.disableTitle"),
      description: t("profile.mfa.disableDescription"),
      confirmText: t("actions.disable"),
      cancelText: t("actions.cancel"),
      variant: "danger",
    })

    if (!confirmed) {
      return
    }

    try {
      await disableMfa()
      toast.success(t("profile.mfa.disableSuccess"))
    } catch {
      setDisableChallengeFactor(enabledFactor)
    }
  }

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading>{t("profile.mfa.title")}</Heading>
            <Text className="text-ui-fg-subtle" size="small">
              {t("profile.mfa.description")}
            </Text>
          </div>
          {enabledFactor ? (
            <Button
              size="small"
              variant="danger"
              isLoading={isDisabling}
              onClick={handleDisable}
            >
              {t("actions.disable")}
            </Button>
          ) : (
            <Button
              size="small"
              variant="secondary"
              isLoading={isStarting || isCancellingPending}
              disabled={isPending}
              onClick={handleSetup}
            >
              {t("actions.enable")}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("profile.mfa.status")}
          </Text>
          <div>
            {enabledFactor ? (
              <Badge color="green" size="2xsmall">
                {t("profile.mfa.enabled")}
              </Badge>
            ) : pendingFactor ? (
              <Badge color="orange" size="2xsmall">
                {t("profile.mfa.pending")}
              </Badge>
            ) : (
              <Badge color="grey" size="2xsmall">
                {t("profile.mfa.disabled")}
              </Badge>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("profile.mfa.method")}
          </Text>
          <div className="flex items-center gap-x-2">
            {enabledFactor || pendingFactor ? (
              <>
                <ShieldCheck className="text-ui-fg-subtle" />
                <Text size="small" leading="compact">
                  {enabledFactorLabel || t("profile.mfa.authenticatorApp")}
                </Text>
              </>
            ) : (
              <>
                <Key className="text-ui-fg-muted" />
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {t("profile.mfa.noMethod")}
                </Text>
              </>
            )}
          </div>
        </div>
      </Container>
      {setup && <MfaSetupModal setup={setup} onClose={() => setSetup(null)} />}
      {disableChallengeFactor && (
        <MfaDisableModal
          factor={disableChallengeFactor}
          onClose={() => setDisableChallengeFactor(null)}
          onSuccess={() => {
            setDisableChallengeFactor(null)
            toast.success(t("profile.mfa.disableSuccess"))
          }}
        />
      )}
    </>
  )
}
