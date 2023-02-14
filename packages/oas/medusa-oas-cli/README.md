# medusa-oas-cli - 0.1.0 - experimental

A command-line tool for all OpenAPI Specifications (OAS) related tooling.

## Install

`yarn add --dev @medusajs/medusa-oas-cli`

Install in the global namespace is not yet supported.
~~`npm install -g @medusajs/medusa-oas-cli`~~

## Configuration / First time setup

N/A

## How to use

```bash
yarn medusa-oas <command>
```

### Command - `oas`

This command will scan the `@medusajs/medusa` package in order to extract JSDoc OAS into a json file.

By default, the command will output the two files `admin.oas.json` and `store.oas.json` in the same directory that the
command was run.

Invalid OAS with throw an error and will prevent the files from being outputted.

#### `--type <string>`

Specify which API OAS to create. Accepts `all`, `admin`, `store`.
Defaults to `all`.

```bash
yarn medusa-oas oas --type admin
```

#### `--out-dir <path>`

Specify in which directory should the files be outputted. It accepts a relative or absolute path.
If the directory doesn't exist, it will be created. Defaults to `./`.

```bash
yarm medusa-oas oas --out-dir
```

#### `--paths <paths...>`

Allows passing additional directory paths to crawl for JSDoc OAS and include in the generated OAS.
It accepts multiple entries.

```bash
yarn medusa-oas oas --paths ~/medusa-server/src
```

#### `--dry-run`

Will package the OAS but will not output file. Useful for validating OAS.

```bash
yarn medusa-oas oas --dry-run
```

#### `--force`

Ignore OAS errors and attempt to output generated OAS files.

```bash
yarn medusa-oas oas --force
```