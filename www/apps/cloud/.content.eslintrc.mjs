import prettier from "eslint-plugin-prettier"
import markdown from "eslint-plugin-markdown"
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
  {
    ignores: ["**/references/**/*"],
  },
  {
    plugins: {
      prettier,
      markdown,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: babelParser,
      ecmaVersion: 13,
      sourceType: "module",

      parserOptions: {
        requireConfigFile: false,

        ecmaFeatures: {
          experimentalDecorators: true,
          modules: true,
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "no-undef": "off",
      "no-unused-expressions": "off",
      "no-unused-vars": "off",
      "no-unused-labels": "off",
      "no-console": "off",
      curly: ["error", "all"],
      "new-cap": "off",
      "require-jsdoc": "off",
      camelcase: "off",
      "no-invalid-this": "off",

      "max-len": [
        "warn",
        {
          code: 64,
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

      "space-infix-ops": "off",
      "eol-last": ["error", "always"],
      "react/prop-types": "off",
      "react/jsx-no-undef": "off",
    },
  },
  {
    files: ["**/*.md", "**/*.mdx"],
    processor: "markdown/markdown",
  },
  {
    files: ["**/*.md/*.js", "**/*.mdx/*.js", "**/*.md/*.jsx", "**/*.mdx/*.jsx"],
  },
  ...compat.extends("plugin:@typescript-eslint/recommended").map((config) => ({
    ...config,
    files: ["**/*.md/*.ts", "**/*.mdx/*.ts", "**/*.md/*.tsx", "**/*.mdx/*.tsx"],
  })),
  {
    files: ["**/*.md/*.ts", "**/*.mdx/*.ts", "**/*.md/*.tsx", "**/*.mdx/*.tsx"],

    plugins: {
      "@typescript-eslint": typescriptEslintEslintPlugin,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-var-requires": "off",
      "prefer-rest-params": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/ban-types": "off",
    },
  },
]
