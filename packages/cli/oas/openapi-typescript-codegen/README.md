# OpenAPI Typescript Codegen - 0.1.0 - experimental

Node.js library that generates Typescript clients based on the OpenAPI specification.

## About this fork

This package is a significantly customized fork of
the amazing npm [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen) package 💜.

### Brief reasoning

We wanted a level of customization that was not achievable through the source package's interface.
We started with a conventional fork but the development workflow was hindering our ability to iterate quickly.
We decided to fold the package within our monorepo to hopefully accelerate development and innovation.

### Noteworthy differences

* Added ability to generate React hooks in the style of `medusa-react`.
* Added access to the raw OAS on parsed element from the parser.
* Added access `operationId` from path.
* Added access `x-codegen` from path.
* Added renaming of service method when `x-codegen.method` is declared.
* Added bundling of query params into a typed object when `x-codegen.queryParams` is declared.
* Added parameterization of import path for the client and models.
* Added generated `index.ts` files in directories to simplify imports.
* Updated npm dependencies' version to match existing versions found in the monorepo.
* Updated coding style to match the convention of the monorepo.
* Removed support for Angular client generation.
* Removed support for OAS v2 parsing.
* Removed documentation.
* Removed tests (temporarily).

## Install

`yarn add --dev @medusajs/openapi-typescript-codegen`

## How to use

See `@medusajs/medusa-oas-cli` for usage.
