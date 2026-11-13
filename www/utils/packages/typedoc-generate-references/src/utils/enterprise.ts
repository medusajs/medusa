export function isEnterprise(featureName: string): boolean {
  return featureName === "rbac"
}

export function getEnterpriseFeatureName(featureName: string): string {
  switch (featureName) {
    case "rbac":
      return "role-based access control feature"
    default:
      return featureName
  }
}

export function getEnterpriseNotice(featureName: string): string {
  if (!isEnterprise(featureName)) {
    return ""
  }

  return `<EnterpriseNotice featureName="${getEnterpriseFeatureName(
    featureName
  )}" />\n\n`
}
