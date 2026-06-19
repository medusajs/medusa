const path = require("path")
const medusa = require("@medusajs/eslint-plugin")

// ---------------------------------------------------------------------------
// Scope definitions
// ---------------------------------------------------------------------------
// The repo's style lint (eslint:recommended + google + prettier + the
// @typescript-eslint formatting rules) historically ran only on a curated set
// of packages (the `.eslintignore` allowlist) plus root/integration-tests.
//
// We now also run `@medusajs/eslint-plugin` (Medusa convention rules) over all
// of the framework's own packages. Those packages must get the Medusa rules
// WITHOUT suddenly being subjected to the full style/prettier lint.
//
// NOTE: of the Medusa target packages, only `packages/medusa` was ever actually
// reached by the style lint. The `.eslintignore` allowlist negations for
// `packages/modules/*`, `packages/modules/providers/*`, and `packages/core/*`
// were no-ops — `packages/*` excludes the `packages/modules`/`packages/core`
// directories, and gitignore cannot re-include a grandchild whose parent dir is
// excluded. So to keep the style scope exactly as it was, style is excluded from
// every Medusa target except `packages/medusa`, plus data-model files (which the
// historical `**/models/*` ignore already kept out of style).
const STYLE_EXCLUDED = [
  "packages/plugins/**",
  "packages/modules/**",
  "packages/core/core-flows/**",
  "**/models/**",
]

const MEDUSA_EXCLUDED = [
  "**/__tests__/**",
  "**/__mocks__/**",
  "**/__fixtures__/**",
  "**/*.spec.*",
  "**/*.test.*",
  "**/integration-tests/**",
  "**/migrations/**",
  "packages/modules/**",
  "packages/core/framework/**",
  "packages/admin/**"
]

// Turn a flat preset's rule blocks into eslintrc `overrides`, scoping each
// block's `files` globs to the given package directories. The plugin presets
// remain the single source of truth for which rules run; this only decides
// where. (No `project`/type info is involved — these rules are AST-only.)
function medusaOverrides(presetName, dirs) {
  return medusa.configs[presetName]
    .filter((b) => b.files && b.rules && Object.keys(b.rules).length > 0)
    .map((b) => ({
      files: dirs.flatMap((d) => b.files.map((f) => `${d}/${f}`)),
      excludedFiles: [
        ...MEDUSA_EXCLUDED,
        ...(b.ignores
          ? dirs.flatMap((d) => b.ignores.map((i) => `${d}/${i}`))
          : []),
      ],
      rules: b.rules,
    }))
}

module.exports = {
  root: true,
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      experimentalDecorators: true,
    },
  },
  // Registered so rule references and `eslint-disable` directives resolve. The
  // style rules come from the scoped overrides below; the Medusa rules from the
  // generated overrides. `react-hooks`/`@typescript-eslint` are registered (not
  // enabled globally) so their disable-directives in now-linted packages don't
  // error "rule not found".
  plugins: ["prettier", "@medusajs", "@typescript-eslint", "react-hooks"],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  overrides: [
    // --- TypeScript parser (syntactic, no `project`) for ALL .ts/.tsx ---
    // No rule in this repo needs type information anymore (the type-aware
    // @typescript-eslint rules were disabled to avoid OOM), so a single
    // program-free parser block covers every TypeScript file.
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2021,
      },
    },

    // --- Base style rules — historical scope only (Medusa-only pkgs excluded) ---
    {
      files: ["**/*.{js,jsx,ts,tsx,cjs,mjs}"],
      excludedFiles: STYLE_EXCLUDED,
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
    },

    // --- TypeScript style rules — historical scope only ---
    {
      files: ["*.ts"],
      excludedFiles: STYLE_EXCLUDED,
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "valid-jsdoc": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        // Disabled to avoid OOM: these require the TS type-checker, and pointing
        // `parserOptions.project` at the whole monorepo to feed them exhausted
        // the heap. Re-enabling needs a scoped/chunked `project` setup.
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/await-thenable": "off",
        "@typescript-eslint/promise-function-async": "off",
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
        project: path.join(__dirname, "./packages/admin/dashboard/tsconfig.json"),
      },
      globals: {
        __BASE__: "readonly",
        __AUTH_TYPE__: "readonly",
        __MAX_UPLOAD_FILE_SIZE__: "readonly",
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

    // --- Medusa convention rules (generated from the plugin presets) ---
    // `recommended` for the app-like packages. `packages/modules` and
    // `packages/core/framework` are intentionally excluded from the Medusa rules
    // here (see MEDUSA_EXCLUDED_DIRS) — they're linted for conventions
    // separately — so no `modules`-preset override is registered.
    ...medusaOverrides("recommended", [
      "packages/medusa",
      "packages/plugins/*",
      "packages/core/core-flows",
    ]),
  ],
}
