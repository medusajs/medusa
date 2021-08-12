#!/usr/bin/env node

const execa = require("execa");

const buildGatsby = async () => {
  await execa("./node_modules/.bin/gatsby", ["build"], {
    cwd: "./reference",
    stdio: "inherit",
  });
};

const buildDocusaurus = async () => {
  await execa("./node_modules/.bin/docusaurus", ["build"], {
    cwd: "./docs",
    stdio: "inherit",
  });
};

const buildSite = async () => {
  await buildGatsby();
  await buildDocusaurus();

  await execa("mkdir", ["build"]);
  await execa("cp", ["./reference/public/*", "./build"]);
  await execa("cp", ["./docs/build/*", "./build"]);
};

buildSite();
