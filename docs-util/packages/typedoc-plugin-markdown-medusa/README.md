# typedoc-plugin-markdown

A plugin for [TypeDoc](https://github.com/TypeStrong/typedoc) that renders TypeScript API documentation as Markdown files. (By default, TypeDoc will render API documentation as a webpage, e.g. HTML files.)

[![npm](https://img.shields.io/npm/v/typedoc-plugin-markdown.svg)](https://www.npmjs.com/package/typedoc-plugin-markdown)
[![Build Status](https://github.com/tgreyuk/typedoc-plugin-markdown/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/tgreyuk/typedoc-plugin-markdown/actions/workflows/ci.yml)

## What does it do?

The plugin replaces the default HTML theme with a built-in Markdown theme and exposes some additional options.

Useful if documentation is required to be included in project README files, Wikis and static site generators.

## Installation

```bash
npm install --save-dev typedoc typedoc-plugin-markdown
```

## Usage

Usage is the same as documented at [TypeDoc](https://typedoc.org/guides/installation/#command-line-interface).

```bash
typedoc --plugin typedoc-plugin-markdown --out docs src/index.ts
```

## Options

This plugin provides additional options beyond the normal options that are [provided by TypeDoc](https://typedoc.org/guides/options/), which are listed below. Note that any vanilla TypeDoc options that customize the HTML theme will be ignored.

- `--entryDocument<string>`<br>
  The file name of the entry document. Defaults to `README.md`.
- `--hideBreadcrumbs<boolean>`<br>
  Do not render breadcrumbs in template header. Defaults to `false`.
- `--hideInPageTOC<boolean>`<br>
  Do not render in-page table of contents items. Defaults to `false`.
- `--publicPath<string>`<br>
  Specify the base path for all urls. If undefined urls will be relative. Defaults to `.`.
- `--namedAnchors<boolean>`<br>
  Use HTML named anchors tags for implementations that do not assign header ids. Defaults to `false`.
- `--preserveAnchorCasing<boolean>`<br>
  Preserve anchor id casing for implementations where original case is desirable. Defaults to `false`.

## License

[MIT](https://github.com/tgreyuk/typedoc-plugin-markdown/blob/master/LICENSE)
