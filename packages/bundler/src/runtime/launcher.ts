import { BUNDLE_MARKER, MAIN_FILE_NAME } from "../constants"

/**
 * The bundle's entry point: parses the command and loads the bundle.
 * Commands: `start` (default) and the `db:migrate` commands, with their CLI
 * flags. `db:migrate` runs the other two in child processes, through this
 * launcher (see `__MEDUSA_BUNDLE_LAUNCHER__`).
 */
export const LAUNCHER = `${BUNDLE_MARKER}
"use strict";

var FLAGS = {
  start: { "-p": "port", "--port": "port", "-H": "host", "--host": "host", "--cluster": "cluster", "--workers": "workers", "--servers": "servers" },
  "db:migrate": { "--skip-scripts": "skipScripts", "--skip-links": "skipLinks", "--skip-search": "skipSearch", "--execute-all-links": "executeAllLinks", "--execute-safe-links": "executeSafeLinks", "--execute-all-search": "executeAllSearch", "--execute-safe-search": "executeSafeSearch", "--concurrency": "concurrency", "--all-or-nothing": "allOrNothing" },
  "db:migrate:scripts": {},
  "db:migrate:search": { "--execute-all-search": "executeAllSearch", "--execute-safe-search": "executeSafeSearch" },
};
var VALUES = { port: 1, host: 1, cluster: 1, workers: 1, servers: 1, concurrency: 1 };

var argv = process.argv.slice(2);
var name = argv[0] && !argv[0].startsWith("-") ? argv.shift() : "start";
if (!FLAGS[name]) {
  console.error("Unknown command '" + name + "'. The bundle supports: " + Object.keys(FLAGS).join(", "));
  process.exit(1);
}
var args = {};
for (var i = 0; i < argv.length; i++) {
  var parts = argv[i].split("=");
  var key = FLAGS[name][parts[0]];
  if (!key) {
    console.error("Unknown option '" + parts[0] + "' for " + name);
    process.exit(1);
  }
  if (VALUES[key]) {
    var value = parts.length > 1 ? parts.slice(1).join("=") : argv[i + 1] && !argv[i + 1].startsWith("-") ? argv[++i] : undefined;
    args[key] = key === "concurrency" && value !== undefined ? Number(value) : value;
  } else {
    args[key] = parts.length > 1 ? parts[1] !== "false" : true;
  }
}

globalThis.__MEDUSA_BUNDLE_COMMAND__ = { name: name, args: args };
globalThis.__MEDUSA_BUNDLE_LAUNCHER__ = __filename;
require("./${MAIN_FILE_NAME}");
`
