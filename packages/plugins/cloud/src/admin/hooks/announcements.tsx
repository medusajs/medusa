import { usePermissions } from "@medusajs/dashboard/hooks"
import { useQuery } from "@tanstack/react-query"
import { AdminCloudAnnouncementListResponse } from "../../types"
import { sdk } from "../lib/sdk"

export const cloudAnnouncementsQueryKey = ["cloud", "announcements"]

export const useCloudAnnouncements = () => {
  const { hasPermission } = usePermissions()
  const { data, ...rest } = useQuery({
    queryKey: cloudAnnouncementsQueryKey,
    queryFn: async () =>
      sdk.client.fetch<AdminCloudAnnouncementListResponse>(
        "/admin/cloud/announcements"
      ),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: hasPermission("cloud_announcement:read"),
  })

  return { announcements: data?.announcements ?? [], ...rest }
}
