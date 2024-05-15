# react-docs-generator

Tool that generates documentation for React components. It's built with [react-docgen](https://react-docgen.dev/) and [Typedoc](https://typedoc.org/).

## Usage

```bash
yarn start --src ./path/to/src --output ./path/to/output/dir
```

### Options

- `--src <srcPath>`: (required) A path to a file containing React components or a directory to scan its sub-directories and files for components.
- `--output <outputPath>`: (required) Path to the directory to store the output in.
- `--clean`: If used, the output directory is emptied before generating the new output.
- `--tsconfigPath <path>`: Path to a TS Config file which is used by Typedoc. By default, the file at `www/utils/packages/typedoc-config/ui.json` is used.
- `--disable-typedoc`: Whether to disable Typedoc and generate the spec file using `react-docgen` only. Useful for debugging.
- `--verbose-typedoc`: Whether to show the output of Typedoc. By default, it's disabeld.