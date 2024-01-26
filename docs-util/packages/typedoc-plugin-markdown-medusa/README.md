# typedoc-plugin-markdown-medusa

A plugin that forks and customizes the [typedoc-plugin-markdown](https://github.com/tgreyuk/typedoc-plugin-markdown/tree/master/packages/typedoc-plugin-markdown) to create a theme with more formatting options.

## Configurations

Aside from the options detailed in [typedoc-plugin-markdown](https://github.com/tgreyuk/typedoc-plugin-markdown/tree/master/packages/typedoc-plugin-markdown#options), the following options are accepted:

- `allReflectionsHaveOwnDocumentInNamespace`: An array of namespace names whose child members should have their own documents.
- `mdxImports`: A boolean value indicating whether the outputted files should be MDX files with the `.mdx` extension.
- `formatting`: An object whose keys are string patterns used to target specific files. You can also use the string `*` to target all files. The values are objects having the following properties:
  - `sections`: (optional) an object whose keys are of type [`SectionKey`](./src/types.ts#L19) and values are boolean. This property is used to enable/disable certain sections in the outputted generated docs.
  - `reflectionGroups`: (optional) an object whose keys are titles of reflection groups (for example, `Constructors`), and values are boolean. This property is used to enable/disable reflection group from being documented.
  - `reflectionTitle`: (optional) an object used to customize how the title of a generated documentation page is rendered. It accepts the following properties:
    - `kind`: a boolean value indicating whether the documented resource's kind should be shown in the title.
    - `typeParameters`: a boolean value indicating whether the documented resource's type parameters should b shown in the title.
    - `suffix`: a string used to add additional text to the end of the page's title.
  - `reflectionDescription`: (optional) a string used to add description in a documentation page after the page's title.
  - `expandMembers`: (optional) a boolean indicating whether members in a page should be expanded. When enabled, the member titles (for example, `Methods`) are removed and the heading level of nested titles whithin the member is elevated by `1`.
  - `showCommentAsHeader`: (optional) a boolean indicating whether comments, for example, a method's name, are represented as headers.
  - `showCommentsAsDetails`: (optional) a boolean indicating whether comments, for example, a method's name, are represented as details component.
  - `parameterStyle`: (optional) a string indicating how parameters are displayed. Its value can be `table` (default), `list`, or `component`.
  - `showReturnSignature`: (optional) a boolean indicating whether to show the signature for returned values.
  - `frontmatterData`: (optional) an object that will be injected as frontmatter to the pages matching specified pattern.
  - `parameterComponent`: (optional) a string indicating the name of a React component to pass the parameters as an object to. This is only used if the 
  - `parameterComponentExtraProps`: (optional) an object that specifies props to pass to the `parameterComponent`.
  - `parameterStyle` option is set to `component`. This also must be used with the `mdxOutput` option enabled, and an import string for the component passed to the `mdxImports` option. The React component will receive a `parameters` prop, which is an array of type [Parameter](./src/types.ts#L95).
  - `mdxImports`: (optional) an array of strings, each holding an import statement that will be added to the beginning of each page. For example, `["import ParameterTypes from "@site/src/components/ParameterTypes""]`. Must be used along with the `mdxOutput` option enabled.
  - `maxLevel`: (optional) a number indicating the maximum level parameters and return types are expanded. Default is `3`.

## Build Plugin

Before using any command that makes use of this plugin, make sure to run the `build` command:

```bash
yarn build
```
