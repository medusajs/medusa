import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  AdminCloudAnnouncementPreferencesResponse,
  AdminUpdateCloudAnnouncementPreferences,
} from "../../types"
import { sdk } from "../lib/sdk"
import { cloudAnnouncementsQueryKey } from "./announcements"

export const cloudAnnouncementPreferencesQueryKey = [
  "cloud",
  "announcement-preferences",
]

export const useCloudAnnouncementPreferences = () => {
  const { data, ...rest } = useQuery({
    queryKey: cloudAnnouncementPreferencesQueryKey,
    queryFn: async () =>
      sdk.client.fetch<AdminCloudAnnouncementPreferencesResponse>(
        "/admin/cloud/announcement-preferences"
      ),
  })

  return { preferences: data?.announcement_preferences, ...rest }
}

export const useUpdateCloudAnnouncementPreferences = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: AdminUpdateCloudAnnouncementPreferences) =>
      sdk.client.fetch<AdminCloudAnnouncementPreferencesResponse>(
        "/admin/cloud/announcement-preferences",
        { method: "POST", body }
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(cloudAnnouncementPreferencesQueryKey, data)
      queryClient.invalidateQueries({ queryKey: cloudAnnouncementsQueryKey })
    },
  })
}
