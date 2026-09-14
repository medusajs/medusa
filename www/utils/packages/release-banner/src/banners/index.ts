import type { BaseSpec, DeepPartial } from "../types.js"
import {
  cloudChangelogBanner,
  type CloudChangelogInput,
  type CloudChangelogSpec,
} from "./cloud-changelog/index.js"
import {
  releaseBanner,
  type ReleaseInput,
  type ReleaseSpec,
} from "./release/index.js"
import type { BannerDefinition } from "./types.js"

/**
 * Every kind of banner this package renders.
 *
 * Adding one means adding a directory under `banners/`, exporting a
 * {@link BannerDefinition} from it, and listing it here — the renderer, the
 * preview page and the CLI all read the type off this registry.
 */
export const BANNERS = {
  release: releaseBanner,
  "cloud-changelog": cloudChangelogBanner,
} satisfies {
  release: BannerDefinition<ReleaseSpec, ReleaseInput>
  "cloud-changelog": BannerDefinition<CloudChangelogSpec, CloudChangelogInput>
}

export type BannerType = keyof typeof BANNERS

export const BANNER_TYPES = Object.keys(BANNERS) as BannerType[]

/** The default type, so callers that only ever wanted a release can omit it. */
export const DEFAULT_BANNER_TYPE: BannerType = "release"

/** One banner's input, discriminated by `type`. */
export type BannerInput = ReleaseInput | CloudChangelogInput

/** The input for a given type, e.g. `InputFor<"release">`. */
export type InputFor<T extends BannerType> = Extract<BannerInput, { type: T }>

/**
 * A definition with its per-type generics collapsed.
 *
 * `BANNERS[input.type]` gives TypeScript a *union* of definitions, which it
 * will not call with a union of inputs even though every pairing that reaches
 * it is sound — the type is the same key that selected the definition. This is
 * the one place that is papered over, rather than at every call site.
 */
export type ResolvedBanner = BannerDefinition<
  BaseSpec & Record<string, unknown>,
  { spec?: DeepPartial<BaseSpec & Record<string, unknown>> }
>

/** Looks up the definition for a type, ready to be called with its inputs. */
export function bannerOf(type: BannerType): ResolvedBanner {
  return BANNERS[type] as unknown as ResolvedBanner
}

/** Looks up the definition for an input, ready to be called with it. */
export function bannerFor(input: BannerInput): ResolvedBanner {
  return bannerOf(input.type)
}

export type { BannerDefinition, BannerPreview } from "./types.js"
export {
  normalizeVersion,
  releaseBanner,
  RELEASE_SPEC,
  FILL_RESOLVES_AT,
} from "./release/index.js"
export type {
  PillSpec,
  ReleaseContentSpec,
  ReleaseInput,
  ReleaseSpec,
} from "./release/index.js"
export {
  cloudChangelogBanner,
  CLOUD_CHANGELOG_SPEC,
} from "./cloud-changelog/index.js"
export type {
  CloudChangelogContentSpec,
  CloudChangelogInput,
  CloudChangelogSpec,
  CloudPillSpec,
} from "./cloud-changelog/index.js"
