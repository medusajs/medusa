module.exports = {
  "admin-file-transfomer": {
    output: {
      mode: "tags-split",
      target: "./generated/admin/index.ts",
      schemas: "./generated/admin/model/",
      override: {
        mutator: {
          path: "./src/custom-instance.ts",
          name: "getClient",
        },
      },
      prettier: true,
      mock: true,
    },
    input: {
      target: "../../docs/api/admin-spec3.yaml",
      override: {
        transformer: "./admin-input-transformer.js",
      },
    },
  },
  "store-file-transformer": {
    output: {
      mode: "tags-split",
      target: "./generated/store/index.ts",
      schemas: "./generated/store/model",
      override: {
        mutator: {
          path: "./src/custom-instance.ts",
          name: "getClient",
        },
      },
      prettier: true,
      mock: true,
    },
    input: {
      target: "../../docs/api/store-spec3.yaml",
    },
  },
}
