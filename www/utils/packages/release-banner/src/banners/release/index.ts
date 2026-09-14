import { toPublicId } from "../../public-id.js"
import type { BannerDefinition } from "../types.js"
import { RELEASE_SPEC, type ReleaseSpec } from "./spec.js"
import { buildRelease, type ReleaseInput } from "./template.js"

/** Normalises a version so the banner always shows the `v` prefix. */
export function normalizeVersion(version: string): string {
  return version.startsWith("v") ? version : `v${version}`
}

/** The banner that heads the release notes for a Medusa version. */
export const releaseBanner: BannerDefinition<ReleaseSpec, ReleaseInput> = {
  spec: RELEASE_SPEC,
  folder: "Releases",
  normalize: (input) => ({
    ...input,
    version: normalizeVersion(input.version),
  }),
  build: buildRelease,
  publicId: ({ version }) => toPublicId(version),
  label: ({ version }) => version,
  preview: {
    reference: {
      url: "https://gh-release-images.s3.eu-north-1.amazonaws.com/v-2-13-0.jpg",
      input: { type: "release", version: "v2.13.0" },
    },
    // A short version and two longer ones — enough to see that the pill sizes
    // correctly around whatever the version string turns out to be.
    inputs: [
      { type: "release", version: "v2.9.0" },
      { type: "release", version: "v2.19.0" },
      { type: "release", version: "v2.100.0" },
    ],
  },
}

export { RELEASE_SPEC, FILL_RESOLVES_AT } from "./spec.js"
export type { PillSpec, ReleaseContentSpec, ReleaseSpec } from "./spec.js"
export type { ReleaseInput } from "./template.js"
