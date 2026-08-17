# Cloud Changelog Entries

Each dated entry of the [Cloud changelog](../../app/changelog/page.mdx) is a
`{YYYY-MM-DD}.mjs` file in this directory:

```js
/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-08-10",
  summary:
    "Environment variables can be scoped to build time or runtime, and the sidebar is now grouped by project.",
  image:
    "https://res.cloudinary.com/<cloud>/image/upload/v1/Cloud%20Changelog/august-10-2026.png",
  content: `- You can now do a new thing. Refer to [Environment Variables](/environments/environment-variables) for more details.
- Another change that went live on this date.`,
}
```

- `date` matches the file name, and the changelog is sorted by it, newest first.
- `content` is Markdown, **without** the date heading. The heading is rendered
  from `date`, so `## August 10, 2026` must never be in the content.
- Links to other Cloud documentation pages are root-relative and omit both the
  `/cloud` base path and the `page.mdx` suffix, such as
  `/environments/custom-domains`. Links to other documentation projects are full
  URLs. Root-relative links are rewritten to absolute URLs for the public
  endpoint and the page's Markdown version.
- `content` is a template literal, so any backtick or `${` in it must be
  escaped.
- `summary` is one plain sentence covering the entry as a whole. It's optional,
  and **not rendered on the changelog page** — it exists for consumers of the
  `/cloud/api/changelog` endpoint.
- `image` is the entry's banner, also **not rendered on the page** and only
  returned by the endpoint. Don't write it by hand; see below.

After adding or changing an entry, run `yarn prep` in `www/apps/cloud` to
regenerate `index.mjs`, the manifest the changelog page and the
`/cloud/api/changelog` endpoint read. Don't edit `index.mjs` by hand.

## Banner images

Banners are rendered by the [`release-banner`](../../../../utils/packages/release-banner)
package's `cloud-changelog` type and hosted on Cloudinary. The banner's only
input is the entry's **display date**, so its public ID is derived from the date
alone — `August 10, 2026` uploads to `Cloud Changelog/august-10-2026`, and
re-uploading overwrites it in place.

The [cloud docs automation
workflow](../../../../../.github/workflows/cloud-docs-automation.yml) does this
after Claude writes the entry: it uploads the banner, then runs
`scripts/set-changelog-image.mjs` to patch the URL into the entry's `image`.

To attach one by hand, from the repository root:

```bash
# CLOUDINARY_URL must be set
BANNER_URL=$(node www/utils/packages/release-banner/dist/cli.js upload \
  --type cloud-changelog --date "August 10, 2026")

node www/apps/cloud/scripts/set-changelog-image.mjs \
  --date 2026-08-10 --url "$BANNER_URL"
```

An entry without an `image` is valid — the endpoint returns `null` for it.
