import {
  ContainerReflection,
  DeclarationReflection,
  PageEvent,
  ProjectReflection,
  Reflection,
  RenderTemplate,
} from "typedoc"
import { MarkdownTheme } from "./theme.js"
import { Mapping } from "./types.js"
import { buildSlugMap, resolveLink } from "./utils/resolve-page-slug.js"
import { buildDocPage } from "./utils/build-doc-page.js"

/**
 * A TypeDoc theme that emits the references doc-model (`DocPage` JSON) instead
 * of MDX. It extends {@link MarkdownTheme} so it reuses, unchanged:
 *
 *  - the URL / file-path mapping logic (`getUrls`, `buildUrls`, `getMappings`,
 *    `toUrl`, `applyAnchorUrl`, `getAllowedReflectionDocuments`) so page slugs
 *    and the `files-map` stay identical to the MDX pipeline during migration;
 *  - the whole Handlebars helper set (`registerHelpers`) — the doc-page builder
 *    calls the same helpers (`comments`, `reflectionTitle`, `example`, ...) and
 *    the `reflection-formatter` used for `TypeList` data;
 *  - the regex-keyed `formatting` options that drive titles / frontmatter.
 *
 * The only behavioural differences are:
 *  - output files use a `.json` extension;
 *  - `render` returns `JSON.stringify(DocPage)` rather than formatted markdown;
 *  - internal links are resolved to their final website URL at build time
 *    (see {@link getRelativeUrl}), removing the runtime per-link R2 fetch.
 */
export class JsonTheme extends MarkdownTheme {
  private slugMap?: Map<string, string>

  constructor(renderer: ConstructorParameters<typeof MarkdownTheme>[0]) {
    super(renderer)
    // emit `_index.json` etc. instead of the configured `.mdx` entry document
    this.entryDocument = this.entryDocument.replace(/\.(mdx|md)$/, ".json")
  }

  /**
   * The doc-model has no separate markdown/JSON formatting pass — the template
   * already returns the serialized `DocPage`.
   */
  render(
    page: PageEvent<Reflection>,
    template: RenderTemplate<PageEvent<Reflection>>
  ): string {
    return template(page) as string
  }

  toUrl(mapping: Mapping, reflection: DeclarationReflection): string {
    return super.toUrl(mapping, reflection).replace(/\/page\.(mdx|md)$/, "/page.json")
  }

  get globalsFile() {
    return "modules.json"
  }

  // The merge-phase `formatting` regexes are written against `page.mdx`
  // locations (e.g. the core-flows workflow key that sets the
  // `/references/medusa-workflows/{{alias}}` slug). Normalize the JSON theme's
  // `page.json` location back to `page.mdx` so every existing regex — slugs,
  // titles, descriptions, group filtering — matches unchanged.
  getFormattingOptions(location: string) {
    return super.getFormattingOptions(
      location.replace(/page\.json$/, "page.mdx")
    )
  }

  /**
   * All three template getters build a `DocPage` from the page's reflection and
   * return it serialized. The `kind` mirrors which Handlebars template the MDX
   * theme would have used, so the builder can branch on page shape.
   */
  getReflectionTemplate() {
    return (pageEvent: PageEvent<ContainerReflection>) =>
      this.renderDocPage(pageEvent, "reflection")
  }

  getReflectionMemberTemplate() {
    return (pageEvent: PageEvent<ContainerReflection>) =>
      this.renderDocPage(pageEvent, "member")
  }

  getIndexTemplate() {
    return (pageEvent: PageEvent<ContainerReflection>) =>
      this.renderDocPage(pageEvent, "index")
  }

  private renderDocPage(
    pageEvent: PageEvent<ContainerReflection>,
    kind: "reflection" | "member" | "index"
  ): string {
    const docPage = buildDocPage({
      theme: this,
      page: pageEvent,
      kind,
    })

    return JSON.stringify(docPage)
  }

  /**
   * Lazily builds (and caches) the map of page URL -> final website slug for
   * the current project. Safe to call during rendering: by then every page
   * reflection has had its `url` assigned by `buildUrls`.
   */
  getSlugMap(): Map<string, string> {
    if (!this.slugMap) {
      this.slugMap = buildSlugMap(
        this,
        this.project as ProjectReflection
      )
    }

    return this.slugMap
  }

  /**
   * Overrides the base relative-URL logic (used by the `relativeURL` helper and
   * every type/link renderer) to return the target's final website URL instead
   * of a `../../page.mdx` relative path.
   */
  getRelativeUrl(absolute: string): string {
    return resolveLink(this.getSlugMap(), absolute)
  }
}
