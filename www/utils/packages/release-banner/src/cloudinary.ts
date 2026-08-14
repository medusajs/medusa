import { v2 as cloudinary } from "cloudinary"

/** Folder the release banners live in, inside the Cloudinary media library. */
export const CLOUDINARY_FOLDER = "Releases"

export type UploadResult = {
  /** The `https` delivery URL to reference from the release notes. */
  url: string
  /** Full public ID, folder included. */
  publicId: string
}

/**
 * Turns a version into a Cloudinary public ID.
 *
 * The dots are replaced because Cloudinary reads the segment after the last dot
 * in a public ID as the format, which would make `v2.19.0` deliver as a file
 * named `v2.19` in a `0` format. Dashes also keep these consistent with the
 * banners that were uploaded by hand before this was automated.
 */
export function versionToPublicId(version: string): string {
  return version.replace(/\./g, "-")
}

/**
 * Reads Cloudinary credentials from the environment.
 *
 * `CLOUDINARY_URL` is the SDK's own convention and keeps this to a single
 * secret; the three separate variables are accepted as a fallback.
 */
function configure(): void {
  if (process.env.CLOUDINARY_URL) {
    // The SDK parses CLOUDINARY_URL by itself.
    cloudinary.config(true)
    return
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary credentials: set CLOUDINARY_URL, or all of " +
        "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    )
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

/**
 * Uploads a banner to the `Releases` folder and returns its delivery URL.
 *
 * Re-running for the same version overwrites in place, so regenerating a draft
 * updates the existing image rather than piling up variants — and `invalidate`
 * purges the CDN so the new one is actually served.
 */
export async function uploadBanner({
  png,
  version,
  folder = CLOUDINARY_FOLDER,
}: {
  png: Buffer
  version: string
  folder?: string
}): Promise<UploadResult> {
  configure()

  const result = await cloudinary.uploader.upload(
    `data:image/png;base64,${png.toString("base64")}`,
    {
      folder,
      public_id: versionToPublicId(version),
      resource_type: "image",
      overwrite: true,
      invalidate: true,
    }
  )

  return { url: result.secure_url, publicId: result.public_id }
}
