module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
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
          "./packages/medusa/tsconfig.json",
          "./packages/medusa-payment-stripe/tsconfig.spec.json",
          "./packages/medusa-payment-paypal/tsconfig.spec.json",
          "./packages/admin-ui/tsconfig.json",
          "./packages/admin-ui/tsconfig.spec.json",
          "./packages/admin-next/dashboard/tsconfig.json",
          "./packages/event-bus-local/tsconfig.spec.json",
          "./packages/event-bus-redis/tsconfig.spec.json",
          "./packages/medusa-plugin-meilisearch/tsconfig.spec.json",
          "./packages/medusa-plugin-algolia/tsconfig.spec.json",
          "./packages/inventory/tsconfig.spec.json",
          "./packages/stock-location/tsconfig.spec.json",
          "./packages/cache-redis/tsconfig.spec.json",
          "./packages/cache-inmemory/tsconfig.spec.json",
          "./packages/create-medusa-app/tsconfig.json",
          "./packages/product/tsconfig.json",
          "./packages/orchestration/tsconfig.json",
          "./packages/workflows-sdk/tsconfig.spec.json",
          "./packages/core-flows/tsconfig.spec.json",
          "./packages/types/tsconfig.json",
          "./packages/workflow-engine-redis/tsconfig.spec.json",
          "./packages/workflow-engine-inmemory/tsconfig.spec.json",
          "./packages/fulfillment/tsconfig.spec.json",
          "./packages/fulfillment-manual/tsconfig.spec.json",
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
      files: ["packages/design-system/ui/**/*.{ts,tsx}"],
      extends: [
        "plugin:react/recommended",
        "plugin:storybook/recommended",
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
      files: ["packages/design-system/icons/**/*.{ts,tsx}"],
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
      files: ["packages/admin-ui/ui/**/*.ts", "packages/admin-ui/ui/**/*.tsx"],
      plugins: ["unused-imports"],
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
        project: "./packages/admin-ui/ui/tsconfig.json",
      },
      globals: {
        __BASE__: "readonly",
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
    {
      files: [
        "packages/admin-next/dashboard/**/*.ts",
        "packages/admin-next/dashboard/**/*.tsx",
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
        project: "./packages/admin-next/dashboard/tsconfig.json",
      },
      globals: {
        __BASE__: "readonly",
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
    {
      files: ["packages/admin-ui/lib/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./packages/admin-ui/tsconfig.json",
      },
    },
    {
      files: ["packages/admin/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./packages/admin/tsconfig.json",
      },
    },
    {
      files: [
        "packages/medusa-payment-stripe/src/admin/**/*.ts",
        "packages/medusa-payment-stripe/src/admin/**/*.tsx",
      ],
      plugins: ["unused-imports"],
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
        project: "./packages/medusa-payment-stripe/tsconfig.admin.json",
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
