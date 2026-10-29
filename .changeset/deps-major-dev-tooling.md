---
"@medusajs/telemetry": patch
"@medusajs/link-modules": patch
"@medusajs/draft-order": patch
"@medusajs/loyalty-plugin": patch
"@medusajs/admin-bundler": patch
"@medusajs/admin-sdk": patch
"@medusajs/admin-shared": patch
"@medusajs/admin-vite-plugin": patch
"@medusajs/dashboard": patch
"@medusajs/instantsearch-adapter": patch
"@medusajs/ui-preset": patch
"@medusajs/icons": patch
"@medusajs/utils": patch
"@medusajs/framework": patch
"@medusajs/auth-google": patch
"@medusajs/js-sdk": patch
"@medusajs/http-types-generator": patch
"@medusajs/eslint-plugin": patch
"@medusajs/medusa": patch
"create-medusa-app": patch
"@medusajs/cli": patch
"@medusajs/test-utils": patch
"@medusajs/medusa-oas-cli": patch
---

chore(deps): update development and test tooling (cross-env 10.1.0, esbuild 0.28.2, tsup 9.0.0, expect-type 1.4.0, @faker-js/faker 10.6.0, jsdom 30.1.3, @types/jsonwebtoken 9.0.10, msw 3.0.3, rimraf 6.1.3, Testing Library, turbo 2.11.10, @types/node 22, boxen 9.0.0, chalk 6.0.1, ci-info 4.4.0, commander 15.0.0, configstore 8.0.0, dotenv 18.0.9, execa 10.2.1, get-port 7.2.0, inquirer 14.2.4, @inquirer/checkbox 5.2.7, @inquirer/confirm 6.3.4, @inquirer/input 5.1.8, is-docker 4.0.0, meant 2.0.1, open 11.0.4, openapi3-ts 4.6.2, ora 9.4.1, @readme/openapi-parser 10.0.0, @redocly/cli 2.71.0, stack-trace 1.0.0, swagger-inline 8.1.0, yargs 18.2.0) and remove unused development dependencies; drop hosted-git-info from @medusajs/cli; fix the medusa-oas-cli circular patch recommendation crashing on references nested in inline schemas; `medusa-oas docs --preview` now serves a static Redoc 3 build since Redocly removed `preview-docs`; replace chalk with Node's built-in `util.styleText` in CommonJS packages; replace uuid with Node's built-in `crypto.randomUUID`; replace get-port with a built-in free-port helper in @medusajs/test-utils
