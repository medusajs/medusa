---
description: 'Learn how to install the Medusa CLI Tool. Medusa CLI Tool can be used to perform actions such as create a new Medusa backend, run migrations, create a new admin user, and more.'
---

# CLI Reference

This document serves as a reference to the Medusa CLI tool including how to install it and what commands are available.

## Overview

The Medusa CLI serves as a tool that allows you to perform important commands while developing with Medusa.

To use Medusa, it is required to install the CLI tool as it is used to create a new Medusa backend.

---

## How to Install CLI Tool

To install the CLI tool, run the following command in your terminal:

```bash npm2yarn
npm install @medusajs/medusa-cli -g
```

:::note

If you run into any errors while installing the CLI tool, check out the [troubleshooting guide](../troubleshooting/cli-installation-errors.mdx).

:::

The CLI tool is then available under the `medusa` command. You can see all commands and options with the following command:

```bash
medusa --help
```

---

## Common Options

The following options can be used with all available commands.

### --help

Learn more about what you can do with the CLI tool or with a specific command.

**Alias:** `-h`

```bash
medusa new --help
```

### --verbose

Turn on verbose output for detailed logs.

**Default:** `false`

```bash
medusa new my-backend --verbose
```

### --no-color

Turn off colors in the output.

**Alias:** `--no-colors`

**Default:** `false`

```bash
medusa new my-backend --no-color
```

### --json

Turn on JSON logger.

**Default:** `false`

```bash
medusa new my-backend --json
```

### --version

If used inside a Medusa project, the version of the Medusa CLI and Medusa project is shown. Otherwise, the version of the Medusa CLI is shown.

**Alias:** `-v`

```bash
medusa --version
```

---

## Available Commands

### new

Create a new Medusa backend.

```bash
medusa new [<backend_name> [<starter_url>]]
```

#### Arguments

| Name | Description | Default |
| --- | --- | --- |
| `backend_name` | The name of the Medusa backend. It will be used as the name of the directory created. | If not provided, you’ll be prompted to enter it. |
| `starter_url` | The URL of the starter to create the backend from. | The default starter is used. |

#### Options

| Name | Description |
| --- | --- |
| `--seed` | If the flag is set the command will attempt to seed the database after setup. |
| `-y`, `--useDefaults` | If the flag is set the command will not interactively collect database credentials. |
| `--skip-db` | If the flag is set the command will not attempt to complete the database setup. |
| `--skip-migrations` | If the flag is set the command will not attempt to complete the database migration. |
| `--skip-env` | If the flag is set the command will not attempt to populate .env. |
| `--db-user` | The database user to use for database setup and migrations. |
| `--db-database` | The database used for database setup and migrations. |
| `--db-pass` | The database password to use for database setup and migrations. |
| `--db-port` | The database port to use for database setup and migrations. |
| `--db-host` | The database host to use for database setup and migrations. |

### develop

Start development backend. This command watches files for any changes to rebuild the files and restart the backend.

```bash
medusa develop
```

#### Options

| Name | Description |
| --- | --- |
| `-H`, `--host` | Set host. Defaults to localhost. |
| `-p`, `--port` | Set port. Defaults to 9000. |

### start

Start development backend. This command does not watch for file changes or restart the backend.

```bash
medusa start
```

#### Options

| Name | Description |
| --- | --- |
| `-H`, `--host` | Set host. Defaults to localhost. |
| `-p`, `--port` | Set port. Defaults to 9000. |

### migrations

Migrate the database to the most recent version.

```bash
medusa migrations <action>
```

#### Arguments

| Name | Description | Default |
| --- | --- | --- |
| `action` | The action to perform. Values can be `run`, `show`, or `revert`. `run` is used to run the migrations; `show` is used to only show what migrations are available to run; and `revert` is to undo the last migration. | This argument is required and does not have a default value. |

### seed

Migrates and populates the database with the provided file.

```bash
medusa seed --seed-file=<file_path>
```

#### Options

| Name | Description |
| --- | --- |
| `-f`, `--seed-file` | Path to the file where the seed is defined. (required) |
| `-m`, `--migrate` | Flag to indicate if migrations should be run prior to seeding the database. Default is true. |

### user

Creates a new admin user.

```bash
medusa user --email <email> [--password <password>]
```

#### Options

| Name | Description |
| --- | --- |
| `-e`, `--email` | The email to create a user with. (required) |
| `-p`, `--password` | The password to use with the user. If not included, the user will not have a password. |
| `-i`, `--id` | The user’s ID. By default it is automatically generated. |

### telemetry

Enable or disable the collection of anonymous data usage. If no option is provided, the command will enable the collection of anonymous data usage.

```bash
medusa telemetry
```

#### Options

| Name | Description |
| --- | --- |
| `--enable` | Enable telemetry (default) |
| `--disable` | Disable telemetry |

---

## See Also

- [Configure Medusa](../development/backend/configurations.md)
- [Set up your development environment](../development/backend/prepare-environment.mdx)
