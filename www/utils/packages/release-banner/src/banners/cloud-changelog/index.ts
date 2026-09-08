import { toPublicId } from "../../public-id.js"
import type { BannerDefinition } from "../types.js"
import { CLOUD_CHANGELOG_SPEC, type CloudChangelogSpec } from "./spec.js"
import { buildCloudChangelog, type CloudChangelogInput } from "./template.js"

/** The banner that heads an entry in the Medusa Cloud changelog. */
export const cloudChangelogBanner: BannerDefinition<
  CloudChangelogSpec,
  CloudChangelogInput
> = {
  spec: CLOUD_CHANGELOG_SPEC,
  folder: "Cloud Changelog",
  normalize: (input) => ({ ...input, date: input.date.trim() }),
  build: buildCloudChangelog,
  // The date is the only thing that varies between these banners, so it is also
  // what identifies one. Pass a date that carries its year if two entries a year
  // apart must not overwrite each other.
  publicId: ({ date }) => toPublicId(date),
  label: ({ date }) => toPublicId(date),
  preview: {
    // A short date, a wider one, and one carrying a year — enough to see the
    // pill size correctly around whatever the date turns out to be.
    inputs: [
      { type: "cloud-changelog", date: "Aug 17" },
      { type: "cloud-changelog", date: "Sep 30" },
      { type: "cloud-changelog", date: "Dec 1, 2026" },
    ],
  },
}

export { CLOUD_CHANGELOG_SPEC } from "./spec.js"
export type {
  CloudChangelogContentSpec,
  CloudChangelogSpec,
  CloudPillSpec,
} from "./spec.js"
export type { CloudChangelogInput } from "./template.js"
