import { v2 as cloudinary } from "cloudinary"

export type UploadResult = {
  /** The `https` delivery URL to reference from the release notes. */
  url: string
  /** Full public ID, folder included. */
  publicId: string
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
 * Uploads a banner to a folder in the media library and returns its delivery
 * URL. The folder and public ID come from the banner's definition.
 *
 * Uploading to a public ID that already exists overwrites it in place, and
 * `invalidate` purges the CDN so the new image is actually served. The CLI gives
 * every upload its own suffixed ID, so in practice that path is only taken if a
 * caller passes an ID of its own.
 */
export async function uploadBanner({
  png,
  folder,
  publicId,
}: {
  png: Buffer
  folder: string
  publicId: string
}): Promise<UploadResult> {
  configure()

  const result = await cloudinary.uploader.upload(
    `data:image/png;base64,${png.toString("base64")}`,
    {
      folder,
      public_id: publicId,
      resource_type: "image",
      overwrite: true,
      invalidate: true,
    }
  )

  return { url: result.secure_url, publicId: result.public_id }
}
