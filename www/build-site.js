#!/usr/bin/env node

const execa = require("execa");

const installDeps = async () => {
  await execa("yarn", ["install"], {
    cwd: "./reference",
    stdio: "inherit",
  });

  await execa("yarn", ["install"], {
    cwd: "./docs",
    stdio: "inherit",
  });
};

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
  await installDeps();
  await buildGatsby();
  await buildDocusaurus();

  await execa("rm", ["-rf", "build"]);
  await execa("mkdir", ["build"]);
  await execa("cp", ["-a", `reference/public/.`, `build/`]);
  await execa("cp", ["-a", `docs/build/.`, `build/`]);
};

buildSite();
