import { SiteSettings } from "@medusajs/medusa"
import { AxiosError, AxiosResponse } from "axios"
import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"

export interface UpdateSiteSettingsReq extends SiteSettings {}

export const useAdminUpdateSiteDetails = () => {
  const path = `/admin/site-settings`

  return useMutation<
    AxiosResponse<{ site_settings: SiteSettings }>,
    AxiosError,
    UpdateSiteSettingsReq
  >((payload) => medusaRequest("PUT", path, payload))
}
