import { AdminApiKeyResponse } from "@medusajs/types"
import { TFunction } from "i18next"
import { ApiKeyType } from "./constants"

export function getApiKeyTypeFromPathname(pathname: string) {
  const isSecretKey = pathname.startsWith("/settings/api-key-management/secret")

  switch (isSecretKey) {
    case true:
      return ApiKeyType.SECRET
    case false:
      return ApiKeyType.PUBLISHABLE
  }
}

export function getApiKeyStatusProps(
  revokedAt: Date | string | null,
  t: TFunction
): { color: "red" | "green"; label: string } {
  if (!revokedAt) {
    return {
      color: "green",
      label: t("apiKeyManagement.status.active"),
    }
  }

  return {
    color: "red",
    label: t("apiKeyManagement.status.revoked"),
  }
}

export function getApiKeyTypeProps(
  type: AdminApiKeyResponse["api_key"]["type"],
  t: TFunction
): { color: "green" | "blue"; label: string } {
  if (type === ApiKeyType.PUBLISHABLE) {
    return {
      color: "green",
      label: t("apiKeyManagement.type.publishable"),
    }
  }

  return {
    color: "blue",
    label: t("apiKeyManagement.type.secret"),
  }
}
