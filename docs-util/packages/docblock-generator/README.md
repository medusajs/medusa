# docblock-generator

A CLI tool that can be used to generate TSDoc docblocks for TypeScript/JavaScript files under the `packages` directory of the main monorepo.

## Prerequisites

1. Run the `yarn` command to install dependencies.
2. Copy the `.env.sample` to `.env` and change the `MONOREPO_ROOT_PATH` variable to the absolute path to the monorepo root.

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
