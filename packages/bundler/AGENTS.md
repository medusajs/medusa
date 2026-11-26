# @medusajs/bundler

Bundles the compiled backend of a Medusa app (`.medusa/server`) into one file, `medusa-bundle.main.js`, with a launcher, `medusa-bundle.js`, so boot evaluates as little as possible. It is specific to Medusa's compiled output (it knows `@medusajs/medusa`'s `dist` layout and the framework's runtime lookups) and is used through `medusa build --bundle`, not directly.

## Using this package

`@medusajs/medusa`'s `build` command is the only caller (`packages/medusa/src/commands/build.ts`):

```ts
const { bundleBackend } = await import("@medusajs/bundler")
const { collectBuildManifest } = await import("./utils/bundle/collect.js")

await bundleBackend({
  directory, // the project
  outDir, // the compiled backend
  logger,
  medusaDist: path.join(__dirname, ".."), // @medusajs/medusa's dist folder
  collect: () => collectBuildManifest(outDir),
})
```

- Public API (`src/index.ts`): `bundleBackend`, `BUNDLE_FILE_NAME` (`medusa-bundle.js`), `BUNDLE_MARKER`, and the types `BundleBackendOptions` and `Collected`. Everything else is internal.
- `medusa start` and `medusa db:migrate*` only hand over to `medusa-bundle.js` when its first line is `BUNDLE_MARKER` (`packages/cli/medusa-cli/cli.js`).
- The collection pass (booting the compiled app without a database to find the manifest, loaded files and file reads) is not here: `@medusajs/medusa` runs it (`commands/utils/bundle/collect.ts`, `collect-runner.ts`) and passes the result as `collect`. `Collected` is the shape it returns.
- No runtime dependency on any `@medusajs/*` package. `@medusajs/framework` is a dev dependency for `import type` only; anything resolved from Medusa (dotenv, `@medusajs/utils`, `@medusajs/cli`) is resolved from `medusaDist`.

## Architecture

`src/` by job:

- `bundle-backend.ts`: `bundleBackend`, the orchestration. Collects, selects the files, snapshots what boot reads from disk, writes the entry, runs esbuild, traces what is still loaded from disk, writes the launcher.
- `selection.ts`: what goes into the bundle (`createRegistrable`, `scanDirectory`, `findUnusedModuleEntries`, `packagesResolvedByName`, `addPackageExportResolutions`), `BUILD_TOOLING` (never bundled or traced) and the stubs for build-only commands (`createBuildOnlyCommandMatcher`).
- `transforms.ts`: `createTransforms`, the esbuild plugins: external handling, lazy re-export files, and keeping each file's identity (`__filename`, `defineFileConfig`).
- `trace.ts`: `copyTracedFiles` (`@vercel/nft`, copied next to the bundle in the same `node_modules` layout) and `vendorPackages` (packages with native addons).
- `packages.ts`: package lookups (`findPackageRoot`, `readPackageName`, `packageNameOf`, `packageDistOf`, `nearestPackageDir`, `findNodeModulesRoot`, `resolveFrom`).
- `paths.ts`: the `app:` and `nm:` keys that make paths relocatable, and their run-time counterpart.
- `manifest.ts`: rewrites the manifest's paths to keys.
- `constants.ts`, `types.ts`, `index.ts`.
- `runtime/`: code generated into the bundle, one template string per file (`entry.ts` builds the entry from the others, `launcher.ts`, `virtual-fs.ts`, `boot-profile.ts`, `missing-module-hint.ts`).

Everything the code derives from `@medusajs/medusa`'s `dist` comes from `medusaDist`: `commands/start.js`, `commands/db/*.js`, the build-only commands (`build`, `develop`, `lint`, `plugin/`, and `@medusajs/cli`'s `dist/commands`), `modules/*.js` entries, and the `commands/utils/bundle/` folder (the collection pass), which is kept out of the bundle and the trace.

## Development

```bash
cd packages/bundler
yarn build
yarn test
```

`launcher.spec.ts` reads `packages/cli/medusa-cli/cli.js` to check the launcher's flag table matches its `BUNDLE_FLAGS`.

## Gotchas

- To check that a change to `selection.ts`, `transforms.ts` or `runtime/` leaves the bundle alone, build the same app before and after and compare `medusa-bundle.main.js`. The tables embedded in it are written in key order so that two builds of the same input are comparable.
- The `runtime/` strings are JavaScript in template literals: escaping (`\\n`) and `${...}` matter. The launcher's flag table must stay in sync with `cli.js` `BUNDLE_FLAGS`.
- `transforms.ts` rewrites `getCallerFilePath` in `@medusajs/utils`; if the compiled output changes, the build fails on purpose rather than shipping wrong paths.
- `findPackageRoot` is cached per directory and includes the filesystem root; `nearestPackageDir` is not cached and never checks the root. `isBuildToolingPath` (trace) matches the `node_modules` path, `BUILD_TOOLING` against a package name elsewhere.
- Add new build-only tooling (anything only `medusa build` or `medusa develop` loads) to `BUILD_TOOLING`, or it is bundled and traced into every app.
- `esbuild` is loaded lazily inside `bundleBackend` so importing this package costs nothing when no bundle is built.
