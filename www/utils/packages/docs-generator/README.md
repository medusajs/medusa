# docs-generator

A CLI tool that generates different types of docblocks from source code:

- Adds TSDocs to any TypeScript file.
- Generates files with OpenApi Spec comments in `generated/oas-output`.
- Generates JSON documentation files for models built with Medusa's DML in `generated/dml-output`.

## Prerequisites

1. Run the `yarn` command to install dependencies.
2. Run the `yarn build` command to build source files.

---

## Usage

### Generate for a specific file

Run the following command to run the tool for a specific file:

```bash
yarn dev run /absolute/path/to/file.ts
```

### Generate for git-changed files

Run the following command to run the tool for applicable git file changes:

```bash
yarn dev run:changes
```

### Generate for a specific commit

Run the following command to run the tool for a commit SHA hash:

```bash
yarn dev run:commit <commit-sha>
```

Where `<commit-sha>` is the SHA of the commit. For example, `e28fa7fbdf45c5b1fa19848db731132a0bf1757d`.

### Generate for a release

Run the following command to run the tool on commits since the latest release.

```bash
yarn dev run:release
```

### Clean OAS

Run the following command to clean up the OAS output files and remove any routes that no longer exist:

```bash
yarn dev clean:oas
```

This command will also remove tags and schemas not used.

### Clean DML JSON files

Run the following command to clean up the DML JSON output files and remove any data models that no longer exist:

```bash
yarn dev clean:dml
```

---

## How it Works

### Generating OAS

If a node is an API route, it generates OAS comments rather than TSDoc comments. The OAS comments are generated and placed in new/existing files under the `www/utils/generated/oas-output/operations` directory.

## Models Built with DML

If a node is a `CallExpression` and it's created using `model.define`, then a JSON documentation file with key-value pairs is generated to add description to its properties.

Only files under `packages/modules/**/src/models` are considered here.

### Generating TSDoc Docblocks

If a node isn't an API Route and it complies with the specified conditions, TSDoc docblocks are generated for it. 

Files under the `packages/medusa/src/api` or `packages/modules/**/src/models` directories are considered incompatible, so any files under these directories won't have TSDoc docblocks generated for them.

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
- `oas`: Generate only OAS files.
- `dml`: Generate only JSON files for models built with DML.