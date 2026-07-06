import { Octokit } from "@octokit/core"
import * as core from "@actions/core"

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
})

interface AnnouncementPayload {
  title: string
  subtitle?: string
  image: {
    content: string
    mimeType: string
    filename?: string
  }
  content: string
  type: string
  link_url?: string
  published: boolean
  published_at?: string
}

/**
 * Extracts metadata from the release markdown content.
 * Expected format:
 * <!--
 * ![alt](image-url)
 * # Subtitle text
 * Content text
 * CMS_BREAK -->
 */
function parseReleaseContent(body: string): {
  imageUrl: string | null
  subtitle: string | null
  content: string | null
} {
  let imageUrl: string | null = null
  let subtitle: string | null = null
  let content: string | null = null

  // Extract content between <!-- and CMS_BREAK -->
  const commentMatch = body.match(/<!--\s*([\s\S]*?)\s*CMS_BREAK\s*-->/i)
  if (!commentMatch) {
    return { imageUrl, subtitle, content }
  }

  const commentContent = commentMatch[1].trim()

  // Extract image URL from markdown image syntax
  const imageMatch = commentContent.match(/!\[.*?\]\((.*?)\)/)
  if (imageMatch) {
    imageUrl = imageMatch[1].trim()
  }

  // Extract h1 heading as subtitle
  const h1Match = commentContent.match(/^#\s+(.+)$/m)
  if (h1Match) {
    subtitle = h1Match[1].trim()
  }

  // Extract content after h1 heading
  if (h1Match) {
    const h1Index = commentContent.indexOf(h1Match[0])
    const afterH1 = commentContent.substring(h1Index + h1Match[0].length).trim()
    // Remove any remaining markdown image syntax
    content = afterH1.replace(/!\[.*?\]\(.*?\)/g, "").trim()
  }

  return { imageUrl, subtitle, content }
}

/**
 * Downloads an image and converts it to base64
 */
async function downloadImageAsBase64(
  imageUrl: string
): Promise<{ content: string; mimeType: string; filename: string }> {
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const base64 = buffer.toString("base64")

  // Determine mime type from response or URL
  const mimeType = response.headers.get("content-type") || "image/jpeg"

  // Extract filename from URL
  const urlParts = imageUrl.split("/")
  const filename = urlParts[urlParts.length - 1] || "release-image.jpg"

  return {
    content: base64,
    mimeType,
    filename,
  }
}

/**
 * Sends the announcement to the cloud API
 */
async function sendAnnouncement(payload: AnnouncementPayload): Promise<void> {
  const apiUrl = process.env.ANNOUNCEMENTS_API_URL
  const apiToken = process.env.ANNOUNCEMENTS_API_TOKEN
  if (!apiUrl || !apiToken) {
    throw new Error(
      "ANNOUNCEMENTS_API_URL or ANNOUNCEMENTS_API_TOKEN environment variable is not set"
    )
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${apiToken}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to create announcement: ${response.status} ${response.statusText} - ${errorText}`
    )
  }

  const result = await response.json()
  console.log("Announcement created successfully:", result)
}

async function createCloudAnnouncement() {
  console.log("Fetching latest release...")

  // Retrieve latest release
  const { data: release } = await octokit.request(
    "GET /repos/{owner}/{repo}/releases/latest",
    {
      owner: process.env.GIT_OWNER || "medusajs",
      repo: process.env.GIT_REPO || "medusa",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  )

  if (!release) {
    throw new Error("No release found.")
  }

  console.log(`Found release: ${release.name} (${release.tag_name})`)

  // Parse release body
  const { imageUrl, subtitle, content } = parseReleaseContent(
    release.body || ""
  )

  if (!imageUrl) {
    throw new Error(
      "No image URL found in release body. Expected format: <!-- ![alt](image-url) ... CMS_BREAK -->"
    )
  }

  if (!subtitle) {
    console.warn(
      "No subtitle found in release body. Using release title as fallback."
    )
  }

  if (!content) {
    console.warn(
      "No content found in release body. Using default message as fallback."
    )
  }

  console.log(`Downloading image from: ${imageUrl}`)

  // Download and convert image to base64
  const image = await downloadImageAsBase64(imageUrl)

  console.log(`Image downloaded: ${image.filename} (${image.mimeType})`)

  // Prepare announcement payload
  const payload: AnnouncementPayload = {
    title: "New Medusa Version Released",
    subtitle: subtitle || release.name || undefined,
    image,
    content: content || "Learn more about the latest Medusa release",
    type: "release",
    link_url: release.html_url,
    published: false,
    published_at: new Date().toISOString(),
  }

  console.log("Sending announcement to API...")

  // Send to API
  await sendAnnouncement(payload)

  core.setOutput("announcement_created", true)
  core.setOutput("release_tag", release.tag_name)
}

void createCloudAnnouncement()
