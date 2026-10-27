import { useQuery } from "@tanstack/react-query"
import { AdminCloudAnnouncementListResponse } from "../../types"
import { sdk } from "../lib/sdk"

export const cloudAnnouncementsQueryKey = ["cloud", "announcements"]

export const useCloudAnnouncements = () => {
  const { data, ...rest } = useQuery({
    queryKey: cloudAnnouncementsQueryKey,
    queryFn: async () =>
      sdk.client.fetch<AdminCloudAnnouncementListResponse>(
        "/admin/cloud/announcements"
      ),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  })

  return { announcements: data?.announcements ?? [], ...rest }
}
