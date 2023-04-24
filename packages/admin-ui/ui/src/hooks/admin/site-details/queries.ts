import { SiteSettings } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"

export const useGetSiteSettings = (
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ site_settings: SiteSettings }>,
    Error,
    ReturnType<any>
  >
) => {
  const path = "/admin/site-settings"

  const { data, refetch, ...rest } = useQuery(
    "admin/site-settings",
    () => medusaRequest<Response<{ site_settings: SiteSettings }>>("GET", path),
    options
  )

  const storefrontURL = (
    data?.data.site_settings?.storefront_url || "http://localhost:3000"
  ).replace(/\/$/, "")

  return { ...data?.data, storefrontURL, ...rest, refetch }
}
