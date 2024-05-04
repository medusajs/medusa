#!/usr/bin/env node
function start() {
  return import("../dist/cli/index.mjs");
}

start();
