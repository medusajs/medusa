export function isEnterprise(featureName: string): boolean {
  return featureName === "rbac"
}

export function getEnterpriseFeatureFlagUrl(featureName: string): string | undefined {
  switch (featureName) {
    case "rbac":
      return "/resources/commerce-modules/rbac#how-to-use-the-rbac-module"
    default:
      return undefined
  }
}

export function getEnterpriseFeatureName(featureName: string): string {
  switch (featureName) {
    case "rbac":
      return "role-based access control feature"
    default:
      return featureName
  }
}

export function getEnterpriseFeatureFlag(featureName: string): string | undefined {
  switch (featureName) {
    case "rbac":
      return "rbac"
    default:
      return undefined
  }
}

type EnterpriseInfo = {
  isEnterprise: boolean
  featureFlag: string | undefined
  featureFlagUrl: string | undefined
  featureNameForDisplay: string
}

export function getEnterpriseInfo(featureName: string): EnterpriseInfo {
  const isEnterpriseFeature = isEnterprise(featureName)
  return {
    isEnterprise: isEnterpriseFeature,
    featureFlag: getEnterpriseFeatureFlag(featureName),
    featureFlagUrl: getEnterpriseFeatureFlagUrl(featureName),
    featureNameForDisplay: getEnterpriseFeatureName(featureName),
  }
}

export function getEnterpriseNotice(featureName: string): string {
  const enterpriseInfo = getEnterpriseInfo(featureName)
  const { isEnterprise, featureFlag, featureFlagUrl, featureNameForDisplay } = enterpriseInfo

  if (!isEnterprise) {
    return ""
  }

  return `<EnterpriseNotice featureName="${featureNameForDisplay}" featureFlag="${featureFlag}" featureFlagHref="${featureFlagUrl}" />\n\n`
}