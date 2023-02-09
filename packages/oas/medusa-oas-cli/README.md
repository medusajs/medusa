# medusa-oas-cli

A command-line tool for OAS related tooling.

## Install

`yarn add -D @medusajs/medusa-oas-cli`

Install in the global namespace is not yet supported.
~~`npm install -g @medusajs/medusa-oas-cli`~~

## Configuration / First time setup

N/A

## How to use

`yarn medusa-oas <command>`

### Command - `oas`

Will scan the `@medusajs/medusa` package in order to extract JSDoc OAS into a json file.

Be default, the command will output two files, `admin.oas.json` and `store.oas.json` , in the same directory that
the command was run.

Invalid OAS with throw an error and will prevent the files from being outputted.

#### `--verbose`

Output debug logs to stdout.

`yarn medusa-oas --verbose`

#### `--dryRun`

Will package the OAS but will not output file. Useful for validating OAS.

`yarn medusa-oas --dryRun`

#### `--type=<string>`

Specify which API OAS to create. Accepts `all`, `admin`, `store`. Defaults to `all`.

`yarn medusa-oas --type=admin`

#### `--outDir=<path>`

Specify in which directory should the files be outputted. Accepts relative and absolute path. It the directory doesn't,
it will be created. Defaults to `./`.
