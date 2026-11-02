# Applying

## Manifests and the lockfile

Handle each change by its `action`:

- **`lockfile`**: apply every lockfile change in the group with one command, then read its last line:

  ```bash
  node scripts/deps-update/apply-lockfile.mjs --group <group.json>
  ```

  It leaves manifests alone, refreshes packages whose target is their newest in-range release in a single install, pins the rest with `yarn set resolution`, and lists any range that didn't land on its target. For a package it lists, pin it yourself with `yarn set resolution "<name>@npm:<spec>" npm:<to>`, or drop it. Never run `yarn set resolution` once per package for the whole group: each call is a full install.

- **`range`**: set the manifest range to `newSpec` in that `workspace`'s `package.json`, in the same dependency field. Keep the file's formatting and key order.

After the range changes, run `yarn install` once to refresh `yarn.lock`.

Never run `yarn up <package>` without an explicit version: it resolves the newest release, which may be inside the cooldown.

## Cooldown

`yarn install` resolves new transitive dependencies to their newest matching versions, which may be younger than the plan's cooldown. Check with:

```bash
node scripts/deps-update/check-patch.mjs --group <group.json> --worktree
```

For every `too-new` entry, pin that descriptor to the newest version that's old enough, then run `yarn install` again:

```bash
npm view <name> time --json   # pick the newest version published before the cutoff
yarn set resolution "<name>@npm:<range from yarn.lock>" npm:<older version>
```

If no old-enough version satisfies the range, drop the package that pulled it in (see `verifying.md`).

## Code changes

1. **Codemod first.** If the library ships an official codemod or migration tool, run it scoped to the affected workspaces (`npx <codemod> <paths>`), then review its diff and revert anything outside those workspaces.
2. **Targeted edits.** Fix each call site from your research list. Follow the surrounding code's style. Don't add comments explaining the migration; that goes in the PR body.
3. **Peer ranges.** Only in a major group, and only when the new version requires it, update a published package's `peerDependencies` range. Prefer widening (`^18.0.0 || ^19.0.0`) over replacing, so consumers aren't forced to upgrade.
4. **New dev dependencies.** Only in a major group, and only when the migration guide requires one (for example `@eslint/js` for an ESLint flat config). Pin it to a version older than the cooldown.

Never edit tests to make them pass unless the test asserts on behavior the library deliberately changed; explain each such edit in the PR body.

## Changesets

Add a `patch` changeset for every published package (no `"private": true`) whose `package.json` changed. Lockfile-only changes need no changeset. One file can list several packages:

```md
---
"@medusajs/payment-stripe": patch
"@medusajs/payment": patch
---

chore(payment-stripe,payment): update stripe to 23.0.0
```

Name the file `.changeset/deps-<group key>-<short-description>.md`, lowercase and hyphenated. Never use `minor` or `major`.
