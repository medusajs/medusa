#!/usr/bin/env node

const fs = require("fs");
const OAS = require("oas-normalize");
const swaggerInline = require("swagger-inline");

swaggerInline(["./packages/medusa/src"], {
  base: "./docs/spec3-base.json",
}).then((gen) => {
  // fs.writeFileSync("./docs/spec3.json", gen);
  const oas = new OAS(gen);
  oas.validate((err, genObj) => {
    if (err) {
      console.error(err);
      return;
    }
    fs.writeFileSync("./docs/spec3.json", JSON.stringify(genObj));
  }, true);
});

swaggerInline(["./packages/medusa/src"], {
  base: "./docs/spec3-base.json",
  format: "yaml",
}).then((gen) => {
  fs.writeFileSync("./docs/spec3.yaml", gen);
});
