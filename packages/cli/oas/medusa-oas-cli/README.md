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

---

### Command - `oas`

This command will scan the `@medusajs/medusa` package in order to extract JSDoc OAS into a json file.

The command will output one of three the files `admin.oas.json`, `store.oas.json` or `combined.oas.json` in the same
directory that the command was run.

Invalid OAS with throw an error and will prevent the files from being outputted.

#### `--type <string>`

Specify which API OAS to create. Accepts `admin`, `store`, `combined`.

The `combined` option will merge both the admin and the store APIs into a single OAS file.

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

#### `--base <path>`

Allows overwriting the content the API's base.yaml OAS that is fed to swagger-inline.
Paths, tags, and components will be merged together. Other OAS properties will be overwritten.

```bash
yarn medusa-oas oas --base ~/medusa-server/oas/custom.oas.base.yaml
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

---

### Command - `client`

Will generate API client files from a given OAS file.

#### `--src-file <path>`

Specify the path to the OAS JSON file.

```bash
yarn medusa-oas client --src-file ./store.oas.json`
```

#### `--name <name>`

Namespace for the generated client. Usually `admin` or `store`.

```bash
yarn medusa-oas client --name admin`
```

#### `--out-dir <path>`

Specify in which directory should the files be outputted. Accepts relative and absolute path.
If the directory doesn't exist, it will be created. Defaults to `./`.

```bash
yarn medusa-oas client --out-dir ./client`
```

#### `--type <type>`

Client component types to generate. Accepts `all`, `types`, `client`, `hooks`.
Defaults to `all`.

```bash
yarn medusa-oas client --type types`
```

#### `--client-packages <name>`

Replace relative import statements by client package name. Mandatory when using `--type hooks`.

```bash
yarn medusa-oas client --client-packages @medusajs/medusa-js`
```

#### `--clean`

Delete destination directory content before generating client.

```bash
yarn medusa-oas client --clean
```

---

### Command - `docs`

Will sanitize OAS for use with Redocly's API documentation viewer.

#### `--src-file <path>`

Specify the path to the OAS JSON file.

```bash
yarm medusa-oas docs --src-file ./store.oas.json
```

#### `--out-dir <path>`

Specify in which directory should the files be outputted. Accepts relative and absolute path.
If the directory doesn't exist, it will be created. Defaults to `./`.

```bash
yarn medusa-oas docs --src-file ./store.oas.json --out-dir ./docs`
```

#### `--config <path>`

Specify the path to a Redocly config file.

```bash
yarn medusa-oas --src-file ./store.oas.json --config ./redocly-config.yaml
```

#### `--dry-run`

Will sanitize the OAS but will not output file. Useful for troubleshooting circular reference issues.

```bash
yarn medusa-oas docs --src-file ./store.oas.json --dry-run
```

#### `--clean`

Delete destination directory content before generating client.

```bash
yarn medusa-oas docs --src-file ./store.oas.json --clean
```

#### `--split`

Creates a multi-file structure output. Uses `redocly split` internally.

```bash
yarn medusa-oas docs --src-file ./store.oas.json --split
```

#### `--preview`

Generate a preview of the API documentation in a browser. Does not output files. Uses `redocly preview-docs` internally.

```bash
yarn medusa-oas docs --src-file ../../../www/apps/api-reference/specs/store.oas.json --preview
```

#### `--html`

Generate a zero-dependency static HTML file. Uses `redocly build-docs` internally.

```bash
yarn medusa-oas docs --src-file ./store.oas.json --html
```
