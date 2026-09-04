import type { BannerNode, BaseSpec, DeepPartial } from "../types.js"

/** What the `preview` command renders for a banner type when given nothing. */
export type BannerPreview<TInput> = {
  /**
   * An existing banner to compare against, when the design reproduces one. The
   * preview page puts it side by side with the generated banner for the same
   * input, and stacks the two as a difference overlay.
   */
  reference?: { url: string; input: TInput }
  /** Inputs rendered underneath, to check the design against varying content. */
  inputs: TInput[]
}

/**
 * Everything the renderer, the CLI and the uploader need to know about one kind
 * of banner. Adding a type means adding a definition and registering it in
 * `banners/index.ts`; nothing else switches on the type.
 */
export type BannerDefinition<
  TSpec extends BaseSpec,
  TInput extends { spec?: DeepPartial<TSpec> },
> = {
  /** The design's default spec, authored at its reference resolution. */
  spec: TSpec
  /** Folder these banners are uploaded into, inside the Cloudinary library. */
  folder: string
  /** Tidies input before it is rendered, e.g. adding a version's `v` prefix. */
  normalize: (input: TInput) => TInput
  /** Builds the element tree for one banner. */
  build: (input: TInput, spec: TSpec) => BannerNode
  /** Cloudinary public ID for one banner, folder excluded. */
  publicId: (input: TInput) => string
  /** Short name for one banner, used for filenames and preview captions. */
  label: (input: TInput) => string
  preview: BannerPreview<TInput>
}
