"use server"

import { CloudAnnouncement } from "types"

export async function getAnnouncements(): Promise<CloudAnnouncement[]> {
  const response = await fetch(
    "https://api.prod.medusajs.cloud/v1/announcements?limit=3&offset=0&order=-published_at&type%5B0%5D=feature",
    {
      // @ts-expect-error - next is not in the types for this package
      next: {
        revalidate: 3000,
        tags: ["announcements"],
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch announcements")
  }

  const data = await response.json()
  // we'll merge them with the version announcement
  return data as CloudAnnouncement[]
}
