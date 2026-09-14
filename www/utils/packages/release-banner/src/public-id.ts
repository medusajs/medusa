import { randomBytes } from "node:crypto"

/** Bytes of randomness in the suffix — 3 gives 6 hex characters. */
const SUFFIX_BYTES = 3

/**
 * A random, URL-safe suffix.
 *
 * Drawn from `crypto` rather than `Math.random` so two runs starting in the same
 * millisecond cannot land on the same value.
 */
export function randomSuffix(): string {
  return randomBytes(SUFFIX_BYTES).toString("hex")
}

/**
 * Appends a random suffix to a public ID, so every upload gets its own URL.
 *
 * A stable ID would let a re-upload replace the image behind a URL that is
 * already published; a fresh one per upload means an image, once linked, keeps
 * showing what it showed when it was linked.
 *
 * The trade-off is that re-running for the same version no longer updates the
 * asset in place — it adds another one, and the previous one is left behind.
 */
export function withRandomSuffix(publicId: string): string {
  return `${publicId}-${randomSuffix()}`
}

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
