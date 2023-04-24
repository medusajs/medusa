export const useGlobalSettingsBasePath = (appendPath?: string) =>
  `/admin/settings${appendPath || ""}`
