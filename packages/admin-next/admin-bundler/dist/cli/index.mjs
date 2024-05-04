import {
  build,
  bundle,
  dev
} from "../chunk-UG4OGQKM.mjs";

// src/cli/create-cli.ts
import { Command } from "commander";
async function createCli() {
  const program = new Command();
  program.name("medusa-admin");
  program.command("dev").description("Starts the development server").action(dev);
  program.command("build").description("Builds the admin dashboard").action(build);
  program.command("bundle").description("Bundles the admin dashboard").action(bundle);
  return program;
}

// src/cli/index.ts
createCli().then(async (cli) => cli.parseAsync(process.argv)).catch((err) => {
  console.error(err);
  process.exit(1);
});
