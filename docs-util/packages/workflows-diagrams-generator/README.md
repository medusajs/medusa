# Workflows Diagram Generator

An internal tool to generate [Mermaid](https://mermaid.js.org/) diagrams for workflows.

> Note: This tool is a beta tool created to generate diagrams that can be used in the Medusa documentation.

## Usage

After installing the dependencies, run the following command:

```bash
yarn start run ./path/to/workflow -o ./path/to/output/dir
```

Where:

- `./path/to/workflow` is the path to a file containing a Workflow, or a directory containing more than one file.
- `./path/to/output/dir` is the path to the directory that outputted diagrams should be placed in.

### Command Options

#### --t, --type

```bash
yarn start run ./path/to/workflow -o ./path/to/output/dir -t markdown
```

The `type` of diagram to be generated. It can be one of the following:

- `docs` (default): For each workflow, it creates a directory holding the diagram of the workflow and its code in separate files. Diagrams are placed in `.mermaid` files.
- `markdown`: Generates the diagram of each workflow in a `.md` file.
- `mermaid`: Generates the diagram of each workflow in a `.mermaid` file.
- `console`: Outputs the diagrams in the console.
- `svg`: Generates the diagram in SVG format.
- `png`: Generates the diagram in PNG format.
- `pdf`: Generates the diagram in PDF format.

#### --no-theme

```bash
yarn start run ./path/to/workflow -o ./path/to/output/dir --no-theme
```

Removes Medusa's default theming from the outputted diagram. Note that Medusa's theme doesn't support dark mode.

#### --pretty-names

```bash
yarn start run ./path/to/workflow -o ./path/to/output/dir --pretty-names
```

Changes slug and camel-case names of steps to capitalized names.
