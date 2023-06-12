#!/usr/bin/env node
import { program } from "commander"
import create from "./commands/create.js"

program
  .description("Create a new Medusa project")
  .option("--repo-url <url>", "URL of repository to use to setup project.")
  .option("--seed", "Seed the created database with demo data.")
  .parse()

void create(program.opts())
