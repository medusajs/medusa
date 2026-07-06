import prettier from "eslint-plugin-prettier/recommended"
import globals from "globals"
import babelParser from "@babel/eslint-parser"
import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  prettier,
  {
    ignores: [
      "**/eslint-config-docs",
      "**/.eslintrc.js",
      "**/dist",
      "**/next.config.js",
      "**/spec",
      "**/node_modules",
      "**/public",
      "**/.eslintrc.js",
      "generated",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@next/next/recommended"
  ),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
      },

      parser: babelParser,
      ecmaVersion: 13,
      sourceType: "module",

      parserOptions: {
        requireConfigFile: false,

        ecmaFeatures: {
          experimentalDecorators: true,
          jsx: true,
          modules: true,
        },

        project: true,
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

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

      "no-console": [
        "error",
        {
          allow: ["error", "warn"],
        },
      ],

      "react/prop-types": [
        2,
        {
          ignore: ["className"],
        },
      ],
    },
  },
  ...compat
    .extends(
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended"
    )
    .map((config) => ({
      ...config,
      files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    })),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],

    plugins: {
      "@typescript-eslint": typescriptEslintEslintPlugin,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 13,
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    settings: {
      next: {
        rootDir: ".",
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/prefer-ts-expect-error": "off",
      "valid-jsdoc": "off",

      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@/keyword-spacing": "error",

      "@/space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],

      "@/space-infix-ops": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
]
