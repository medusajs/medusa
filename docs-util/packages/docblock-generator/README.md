# docblock-generator

A CLI tool that can be used to generate TSDoc docblocks and OAS for TypeScript/JavaScript files under the `packages` directory of the main monorepo.

## Prerequisites

1. Run the `yarn` command to install dependencies.
2. Copy the `.env.sample` to `.env` and change the `MONOREPO_ROOT_PATH` variable to the absolute path to the monorepo root.
3. Run the `yarn build` command to build source files.

---

## Usage

### Generate for a specific file

Run the following command to run the tool for a specific file:

```bash
yarn start run /absolute/path/to/file.ts
```

### Generate for git-changed files

Run the following command to run the tool for applicable git file changes:

```bash
yarn start run:changes
```

### Generate for a specific commit

Run the following command to run the tool for a commit SHA hash:

```bash
yarn start run:commit <commit-sha>
```

Where `<commit-sha>` is the SHA of the commit. For example, `e28fa7fbdf45c5b1fa19848db731132a0bf1757d`.

### Generate for a release

Run the following command to run the tool on commits since the latest release.

```bash
yarn start run:release
```

### Clean OAS

Run the following command to clean up the OAS output files and remove any routes that no longer exist:

```bash
yarn start clean:oas
```

This command will also remove tags and schemas not used.

---

## How it Works

### Generating OAS

If a node is an API route, it generates OAS comments rather than TSDoc comments. The OAS comments are generated and placed in new/existing files under the `docs-util/oas-output/operations` directory.

### Generating TSDoc Docblocks

If a note isn't an API Route and it complies with the specified conditions, TSDoc docblocks are generated for it. 

Files under the `packages/medusa/src/api` or `api-v2` directories are considered incompatible, so any files under these directories won't have TSDoc docblocks generated for them.

---

## Common Options

This section includes options that you can pass to any of the mentioned commands.

### --generate-examples

If this option is passed, the tool will try to generate OAS examples. Currently, it will only try to generate JS Client examples.

cURL examples are always generated regardless of this option.

### --type

You can use this option to specify the type of docs to generate. Possible values are:

- `all`: (default) Generate all doc types.
- `docs`: Generate only TSDoc docblocks.
- `oas`: Generate only OAS docblocks/files.
