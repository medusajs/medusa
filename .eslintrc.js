const path = require("path");

module.exports = {
  root: true,
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      experimentalDecorators: true,
    },
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "google", "plugin:prettier/recommended"],
  rules: {
    curly: ["error", "all"],
    "new-cap": "off",
    "require-jsdoc": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    camelcase: "off",
    "no-invalid-this": "off",
    "max-len": [
      "error",
      {
        code: 80,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
      },
    ],
    semi: ["error", "never"],
    quotes: [
      "error",
      "double",
      {
        allowTemplateLiterals: true,
      },
    ],
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      },
    ],
    "object-curly-spacing": ["error", "always"],
    "arrow-parens": ["error", "always"],
    "linebreak-style": 0,
    "no-confusing-arrow": [
      "error",
      {
        allowParens: false,
      },
    ],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "space-infix-ops": "error",
    "eol-last": ["error", "always"],
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  overrides: [
    {
      files: ["*.ts"],
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: [
          path.join(__dirname, "./packages/admin/admin-bundler/tsconfig.json"),
          path.join(__dirname, "./packages/admin/admin-sdk/tsconfig.json"),
          path.join(__dirname, "./packages/admin/admin-shared/tsconfig.json"),
          path.join(__dirname, "./packages/admin/admin-vite-plugin/tsconfig.json"),
          path.join(__dirname, "./packages/admin/dashboard/tsconfig.json"),

          path.join(__dirname, "./packages/cli/create-medusa-app/tsconfig.json"),
          path.join(__dirname, "./packages/cli/medusa-cli/tsconfig.json"),
          path.join(__dirname, "./packages/cli/medusa-dev-cli/tsconfig.json"),
          path.join(__dirname, "./packages/cli/oas/medusa-oas-cli/tsconfig.json"),

          path.join(__dirname, "./packages/core/core-flows/tsconfig.json"),
          path.join(__dirname, "./packages/core/framework/tsconfig.json"),
          path.join(__dirname, "./packages/core/js-sdk/tsconfig.json"),
          path.join(__dirname, "./packages/core/modules-sdk/tsconfig.json"),
          path.join(__dirname, "./packages/core/orchestration/tsconfig.json"),
          path.join(__dirname, "./packages/core/types/tsconfig.json"),
          path.join(__dirname, "./packages/core/utils/tsconfig.json"),
          path.join(__dirname, "./packages/core/workflows-sdk/tsconfig.json"),

          path.join(__dirname, "./packages/deps/tsconfig.json"),

          path.join(__dirname, "./packages/design-system/icons/tsconfig.json"),
          path.join(__dirname, "./packages/design-system/toolbox/tsconfig.json"),
          path.join(__dirname, "./packages/design-system/ui/tsconfig.json"),
          path.join(__dirname, "./packages/design-system/ui-preset/tsconfig.json"),

          path.join(__dirname, "./packages/medusa/tsconfig.json"),

          path.join(__dirname, "./packages/medusa-telemetry/tsconfig.json"),
          path.join(__dirname, "./packages/medusa-test-utils/tsconfig.json"),

          path.join(__dirname, "./packages/modules/analytics/tsconfig.json"),
          path.join(__dirname, "./packages/modules/api-key/tsconfig.json"),
          path.join(__dirname, "./packages/modules/auth/tsconfig.json"),
          path.join(__dirname, "./packages/modules/cache-inmemory/tsconfig.json"),
          path.join(__dirname, "./packages/modules/cache-redis/tsconfig.json"),
          path.join(__dirname, "./packages/modules/caching/tsconfig.json"),
          path.join(__dirname, "./packages/modules/cart/tsconfig.json"),
          path.join(__dirname, "./packages/modules/currency/tsconfig.json"),
          path.join(__dirname, "./packages/modules/customer/tsconfig.json"),
          path.join(__dirname, "./packages/modules/event-bus-local/tsconfig.json"),
          path.join(__dirname, "./packages/modules/event-bus-redis/tsconfig.json"),
          path.join(__dirname, "./packages/modules/file/tsconfig.json"),
          path.join(__dirname, "./packages/modules/fulfillment/tsconfig.json"),
          path.join(__dirname, "./packages/modules/index/tsconfig.json"),
          path.join(__dirname, "./packages/modules/inventory/tsconfig.json"),
          path.join(__dirname, "./packages/modules/link-modules/tsconfig.json"),
          path.join(__dirname, "./packages/modules/locking/tsconfig.json"),
          path.join(__dirname, "./packages/modules/notification/tsconfig.json"),
          path.join(__dirname, "./packages/modules/order/tsconfig.json"),
          path.join(__dirname, "./packages/modules/payment/tsconfig.json"),
          path.join(__dirname, "./packages/modules/pricing/tsconfig.json"),
          path.join(__dirname, "./packages/modules/product/tsconfig.json"),
          path.join(__dirname, "./packages/modules/promotion/tsconfig.json"),
          path.join(__dirname, "./packages/modules/region/tsconfig.json"),
          path.join(__dirname, "./packages/modules/sales-channel/tsconfig.json"),
          path.join(__dirname, "./packages/modules/settings/tsconfig.json"),
          path.join(__dirname, "./packages/modules/stock-location/tsconfig.json"),
          path.join(__dirname, "./packages/modules/store/tsconfig.json"),
          path.join(__dirname, "./packages/modules/tax/tsconfig.json"),
          path.join(__dirname, "./packages/modules/translation/tsconfig.json"),
          path.join(__dirname, "./packages/modules/user/tsconfig.json"),
          path.join(__dirname, "./packages/modules/workflow-engine-inmemory/tsconfig.json"),
          path.join(__dirname, "./packages/modules/workflow-engine-redis/tsconfig.json"),

          path.join(__dirname, "./packages/modules/providers/analytics-local/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/analytics-posthog/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/auth-emailpass/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/auth-github/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/auth-google/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/caching-redis/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/file-local/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/file-s3/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/fulfillment-manual/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/locking-postgres/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/locking-redis/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/notification-local/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/notification-sendgrid/tsconfig.json"),
          path.join(__dirname, "./packages/modules/providers/payment-stripe/tsconfig.json"),

          path.join(__dirname, "./packages/plugins/draft-order/tsconfig.json"),
        ],
      },
      rules: {
        "valid-jsdoc": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/keyword-spacing": "error",
        "@typescript-eslint/space-before-function-paren": [
          "error",
          {
            anonymous: "always",
            named: "never",
            asyncArrow: "always",
          },
        ],
        "@typescript-eslint/space-infix-ops": "error",

        // --- Rules to be fixed
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: [
        "./packages/design-system/ui/**/*.ts",
        "./packages/design-system/ui/**/*.tsx",
      ],
      extends: [
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      plugins: ["@typescript-eslint"],
      rules: {
        "react/no-children-prop": "off",
        "react-hooks/exhaustive-deps": "warn",
        "react/prop-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./packages/design-system/ui/tsconfig.json",
      },
    },
    {
      files: [
        "./packages/design-system/icons/**/*.ts",
        "./packages/design-system/icons/**/*.tsx",
      ],
      extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      plugins: ["@typescript-eslint"],
      rules: {
        "react/no-children-prop": "off",
        "react/prop-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./packages/design-system/icons/tsconfig.json",
      },
    },
    {
      files: [
        "./packages/admin/dashboard/**/*.ts",
        "./packages/admin/dashboard/**/*.tsx",
      ],
      plugins: ["unused-imports", "react-refresh"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
        project: "./packages/admin/dashboard/tsconfig.json",
      },
      globals: {
        __BASE__: "readonly",
        __AUTH_TYPE__: "readonly",
      },
      env: {
        browser: true,
      },
      rules: {
        "prettier/prettier": "error",
        "react/prop-types": "off",
        "new-cap": "off",
        "require-jsdoc": "off",
        "valid-jsdoc": "off",
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],
        "no-unused-expressions": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "warn",
          {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
          },
        ],
      },
    },
  ],
}
