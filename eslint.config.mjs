import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import medusa from "@medusajs/eslint-plugin"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import google from "eslint-config-google"
import prettierRecommended from "eslint-plugin-prettier/recommended"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import unusedImports from "eslint-plugin-unused-imports"
import globals from "globals"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Packages linted only for Medusa conventions. The style lint never reached
// them (or data models), so it stays scoped away from them.
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
  "packages/admin/**",
]

const rulesOf = (configs) =>
  Object.assign({}, ...[configs].flat().map((c) => c.rules ?? {}))

function medusaBlocks(presetName, dirs) {
  return medusa.configs[presetName]
    .filter((b) => b.files && b.rules && Object.keys(b.rules).length > 0)
    .map((b) => ({
      files: dirs.flatMap((d) => b.files.map((f) => `${d}/${f}`)),
      ignores: [
        ...MEDUSA_EXCLUDED,
        ...(b.ignores
          ? dirs.flatMap((d) => b.ignores.map((i) => `${d}/${i}`))
          : []),
      ],
      rules: b.rules,
    }))
}

const tsRecommendedRules = rulesOf(tseslint.configs["flat/recommended"])

export default [
  {
    ignores: [
      "**/.*",
      "docs/",
      "docs-util/",
      "www/",
      "**/typedoc.*",
      "**/jest*",

      "packages/*",
      // List of packages to Lint
      "!packages/medusa",
      "!packages/admin-ui",
      "!packages/admin",
      "!packages/admin-next",
      "!packages/medusa-payment-stripe",
      "!packages/medusa-payment-paypal",
      "!packages/medusa-plugin-meilisearch",
      "!packages/medusa-plugin-algolia",
      "!packages/create-medusa-app",
      "!packages/medusa-react",
      "!packages/eslint-plugin",

      // Linted by @medusajs/eslint-plugin (Medusa convention rules). The style
      // rules are scoped away from these via STYLE_EXCLUDED.
      "!packages/plugins",
      "!packages/modules",
      "!packages/core",
      "packages/core/*",
      "!packages/core/core-flows",
      "!packages/core/framework",

      "**/models/*",
      // Re-allow module data models so the Medusa data-model rules can lint
      // them (the style rules still skip them via STYLE_EXCLUDED).
      "!packages/modules/**/models/**",
      "!packages/admin/dashboard/src/**/models/**",
      "**/scripts/*",
      "**/dist/*",
      "**/node_modules/*",
      "**/migrations/*",
      "**/__mocks__/*",
      // Flat config lints these by default; `--ext .js,.ts,.tsx` never did.
      "**/*.{jsx,cjs,mjs}",
    ],
  },

  // Registered so rule references and `eslint-disable` directives resolve. The
  // style rules come from the scoped blocks below; the Medusa rules from the
  // generated blocks.
  {
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
    plugins: {
      prettier: prettierRecommended.plugins.prettier,
      "@medusajs": medusa,
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.es2015,
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2021,
      },
    },
  },

  // --- Base style rules — historical scope only (Medusa-only pkgs excluded) ---
  {
    files: ["**/*.{js,jsx,ts,tsx,cjs,mjs}"],
    ignores: STYLE_EXCLUDED,
    rules: {
      ...js.configs.recommended.rules,
      ...google.rules,
      ...prettierRecommended.rules,
      curly: ["error", "all"],
      "new-cap": "off",
      "require-jsdoc": "off",
      "valid-jsdoc": "off",
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
    files: ["**/*.ts"],
    ignores: STYLE_EXCLUDED,
    rules: {
      ...tsRecommendedRules,
      "valid-jsdoc": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      // Disabled to avoid OOM: these require the TS type-checker, and pointing
      // `parserOptions.project` at the whole monorepo to feed them exhausted
      // the heap. Re-enabling needs a scoped/chunked `project` setup.
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/promise-function-async": "off",
      "keyword-spacing": "error",
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "space-infix-ops": "error",

      // --- Rules to be fixed
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },

  {
    files: [
      "packages/design-system/ui/**/*.ts",
      "packages/design-system/ui/**/*.tsx",
    ],
    plugins: { react },
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parser: tsParser,
      parserOptions: {
        ...react.configs.flat.recommended.languageOptions.parserOptions,
        project: path.join(
          __dirname,
          "packages/design-system/ui/tsconfig.json"
        ),
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...tsRecommendedRules,
      "react/no-children-prop": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: [
      "packages/design-system/icons/**/*.ts",
      "packages/design-system/icons/**/*.tsx",
    ],
    plugins: { react },
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parser: tsParser,
      parserOptions: {
        ...react.configs.flat.recommended.languageOptions.parserOptions,
        project: path.join(
          __dirname,
          "packages/design-system/icons/tsconfig.json"
        ),
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...tsRecommendedRules,
      "react/no-children-prop": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: [
      "packages/admin/dashboard/**/*.ts",
      "packages/admin/dashboard/**/*.tsx",
    ],
    plugins: {
      react,
      "unused-imports": unusedImports,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: "module",
        project: path.join(__dirname, "packages/admin/dashboard/tsconfig.json"),
      },
      globals: {
        ...globals.browser,
        __BASE__: "readonly",
        __AUTH_TYPE__: "readonly",
        __MAX_UPLOAD_FILE_SIZE__: "readonly",
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      "prettier/prettier": "error",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "new-cap": "off",
      "require-jsdoc": "off",
      "valid-jsdoc": "off",
      "react-refresh/only-export-components": [
        "warn",
        // `assign` covers the `Object.assign(Root, { ... })` compound components.
        {
          allowConstantExport: true,
          extraHOCs: ["assign", "genericForwardRef"],
        },
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
          caughtErrors: "none",
        },
      ],
    },
  },

  ...medusaBlocks("recommended", [
    "packages/medusa",
    "packages/plugins/*",
    "packages/core/core-flows",
  ]),
]
