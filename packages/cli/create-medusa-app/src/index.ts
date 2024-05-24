#!/usr/bin/env node
import { program } from "commander"
import create from "./commands/create.js"

program
  .description("Create a new Medusa project")
  .option("--repo-url <url>", "URL of repository to use to setup project.")
  .option("--seed", "Seed the created database with demo data.")
  .option(
    "--no-boilerplate",
    "Install a Medusa project without the boilerplate and demo files."
  )
  .option(
    "--skip-db",
    "Skips creating the database, running migrations, and seeding, and subsequently skips opening the browser.",
    false
  )
  .option(
    "--db-url <url>",
    "Skips database creation and sets the database URL to the provided URL. Throws an error if can't connect to the database. Will still run migrations and open the admin after project creation."
  )
  .option(
    "--no-migrations",
    "Skips running migrations, creating admin user, and seeding. If used, it's expected that you pass the --db-url option with a url of a database that has all necessary migrations. Otherwise, unexpected errors will occur.",
    true
  )
  .option(
    "--no-browser",
    "Disables opening the browser at the end of the project creation and only shows success message.",
    true
  )
  .option(
    "--directory-path <path>",
    "Specify the directory path to install the project in."
  )
  .option(
    "--with-nextjs-starter",
    "Install the Next.js starter along with the Medusa backend",
    false
  )
  .option(
    "--verbose",
    "Show all logs of underlying commands. Useful for debugging.",
    false
  )
  .parse()

void create(program.opts())
