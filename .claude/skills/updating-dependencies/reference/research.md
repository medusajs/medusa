# Research

Find what changed between `from` and `to` and where the repo is affected. Do this for every package in a major group, and for any patch or minor package that fails verification.

## Sources, in order

1. **Context7 docs.** When the package has a `context7` ID, call `query-docs` with it directly. Without one, call `resolve-library-id` and only use an exact name match with High source reputation; otherwise skip Context7 for that package. Ask one topic per query:
   - `Migration guide from v<from major> to v<to major>`
   - `Breaking changes in v<to major>`
   - A specific API you found at a call site, e.g. `How does <function> work in v<to major>`
2. **Release notes and changelog**, through the read-only helper:

   ```bash
   bash scripts/get_dependency_releases.sh <owner/repo> [path/in/repo.md]
   ```

   - Find `owner/repo` with `npm view <package>@<to> repository.url`.
   - The second argument can be any Markdown file in the repo: a `CHANGELOG.md`, `History.md`, or a migration guide kept with the docs (for example `docs/guide/migration.md`).
   - Read every entry after `from` up to and including `to`. Ignore later versions and prereleases.
3. **The package's own types**, after installing the new version: read `node_modules/<package>/package.json` (`exports`, `type`, `engines`) and its `.d.ts` files for the APIs the repo calls.

If none of these has usable notes, say so in the PR body. Never invent breaking changes or migration steps.

Keep the URL of every migration guide, release note, or changelog entry you relied on: they go in the result's `sources` so reviewers can check your reading (`output.md`). Context7 results often name their source page; for GitHub releases use `https://github.com/<owner>/<repo>/releases/tag/<tag>`.

## What to extract

For each package, list:

- Removed, renamed, or retyped exports the repo might use.
- Changed defaults and behavior changes.
- Module format changes: ESM-only releases matter because many workspaces compile to CommonJS. An ESM-only dependency can't be `require`d from CJS output; check how the workspace builds (`tsconfig.json` `module`, `package.json` `type`) before bumping.
- Raised minimums: Node version, TypeScript version, peer dependencies.
- Official codemods or migration tools.

## Find affected call sites

Search only the workspaces that declare the package (from `changes[].workspace`) plus anything that imports it:

```
Grep pattern: from ["']<package>(/[^"']*)?["']|require\(["']<package>(/[^"']*)?["']\)
```

Then search for each affected API name inside those files. Record every call site that needs a change; that list drives Step 3 and the PR body.

## Blocked vs failed

- **Blocked:** the update can't work until something outside this repo changes (another dependency doesn't support the new version yet, a required Node or TypeScript version the repo doesn't use). Record the blocker precisely, e.g. `tsc-alias 1.9 uses the TypeScript compiler API, which TypeScript 7 removed`. Next week's run skips the package until a newer version is released.
- **Failed:** the update should work but you couldn't make it pass within the retry limit.
