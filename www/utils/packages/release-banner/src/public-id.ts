/**
 * Turns a label into a Cloudinary public ID.
 *
 * Dots are replaced because Cloudinary reads the segment after the last dot in
 * a public ID as the format, which would make `v2.19.0` deliver as a file named
 * `v2.19` in a `0` format. Dashes also keep these consistent with the banners
 * that were uploaded by hand before this was automated.
 */
export function toPublicId(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
