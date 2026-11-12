import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Label, Switch, Text, toast } from "@medusajs/ui"
import { CloudAnnouncementCategory } from "../../../../types"
import {
  useCloudAnnouncementPreferences,
  useUpdateCloudAnnouncementPreferences,
} from "../../../hooks/announcement-preferences"

const categories: {
  id: CloudAnnouncementCategory
  label: string
  description: string
}[] = [
  {
    id: "security",
    label: "Security updates",
    description: "Security advisories and incidents that affect your app.",
  },
  {
    id: "feature",
    label: "Feature announcements",
    description: "New Medusa features and releases.",
  },
  {
    id: "cloud",
    label: "Cloud announcements",
    description: "Medusa Cloud features and tips shown on admin pages.",
  },
]

const AnnouncementSettingsPage = () => {
  const { preferences } = useCloudAnnouncementPreferences()
  const { mutate, isPending } = useUpdateCloudAnnouncementPreferences()

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading>Announcements</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Choose the announcements your team sees in the admin.
        </Text>
      </div>
      {categories.map(({ id, label, description }) => (
        <div
          key={id}
          className="flex items-center justify-between gap-x-4 px-6 py-4"
        >
          <div className="flex flex-col">
            <Label htmlFor={id} size="small" weight="plus">
              {label}
            </Label>
            <Text size="small" className="text-ui-fg-subtle">
              {description}
            </Text>
          </div>
          <Switch
            id={id}
            checked={preferences?.[id] ?? false}
            disabled={!preferences || isPending}
            onCheckedChange={(checked) =>
              mutate(
                { [id]: checked },
                {
                  onSuccess: () =>
                    toast.success(
                      `${label} ${checked ? "enabled" : "disabled"}`
                    ),
                  onError: (error) => toast.error(error.message),
                }
              )
            }
          />
        </div>
      ))}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Announcements",
})

export default AnnouncementSettingsPage
