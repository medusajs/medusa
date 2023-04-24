import { useBasePath } from "../../../utils/routePathing"

export const useVendorSettingsBasePath = (vendorId, appendPath?: string) => {
  const basePath = useBasePath(`/settings${appendPath || ""}`)
  const modifiedBasePath = basePath.replace(
    "/admin",
    `/admin/vendor/${vendorId}`
  )

  return modifiedBasePath
}
