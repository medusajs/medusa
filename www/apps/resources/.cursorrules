# Medusa Tutorial Structure Rules

## Overview

This file defines the structure and formatting requirements for creating Medusa tutorials in the `/app/how-to-tutorials/tutorials/` directory. All tutorials must follow this structure to ensure consistency and quality.

## File Structure

### 1. Frontmatter (Required)

Every tutorial must start with YAML frontmatter containing:

```yaml
---
sidebar_label: "Tutorial Name"  # Display name in sidebar
tags:
    - name: product_name         # Product tags (e.g., cart, order, customer)
      label: "Implement Feature"
    - server                      # Always include if server-side code
    - tutorial                   # Always include
    - nextjs                     # Include if storefront customization
products:
  - product_name                 # Array of product names used
---
```

**Additional frontmatter options:**

- `keywords`: Array of keywords for SEO (optional)
- `ogImage`: Export for Open Graph image (optional)

### 2. Imports

After frontmatter, include necessary imports:

- `Github`, `PlaySolid` from `@medusajs/icons` (if needed)
- `Prerequisites`, `WorkflowDiagram`, `CardList`, `Card` from `docs-ui`
- Other necessary components

### 3. Metadata Export

```typescript
export const metadata = {
  title: `Implement Feature Name in Medusa`,
  // Optional: openGraph and twitter metadata
}
```

### 4. Title Section

```markdown
# {metadata.title}

In this tutorial, you'll learn how to [brief description].
```

### 5. Context Paragraph

Include 1-2 paragraphs explaining:

- What Medusa provides out-of-the-box
- What the tutorial will teach
- Context about the feature being implemented

### 6. Summary Section

```markdown
## Summary

By following this tutorial, you will learn how to:

- Install and set up Medusa.
- [Feature 1]
- [Feature 2]
- [Feature 3]
```

### 7. Visual Elements

- Include diagrams/images when helpful (use Cloudinary URLs)
- Use `WorkflowDiagram` component for workflow visualizations
- Use `CardList` or `Card` components for GitHub links and OpenAPI specs

### 8. Step Structure

#### Step 1: Install a Medusa Application (Always Required)

```markdown
## Step 1: Install a Medusa Application

<Prerequisites items={[
  {
    text: "Node.js v20+",
    link: "https://nodejs.org/en/download"
  },
  {
    text: "Git CLI tool",
    link: "https://git-scm.com/downloads"
  },
  {
    text: "PostgreSQL",
    link: "https://www.postgresql.org/download/"
  }
]} />

Start by installing the Medusa application on your machine with the following command:

\`\`\`bash
npx create-medusa-app@latest
\`\`\`

[Instructions about installation...]

<Note title="Why is the storefront installed separately">

[Explanation]

</Note>

<Note title="Ran into Errors">

Check out the [troubleshooting guides](../../../troubleshooting/create-medusa-app-errors/page.mdx) for help.

</Note>
```

#### Subsequent Steps

Each step should:

- Have a clear, descriptive title: `## Step N: [Title]`
- Start with context explaining what will be done
- Break into subsections (a, b, c) if needed
- Include code examples with proper formatting
- Include Notes and Tips where helpful
- End with "Test it Out" sections when applicable

### 9. Code Block Formatting

#### Basic Code Block

```markdown
\`\`\`ts title="src/path/to/file.ts"
[code]
\`\`\`
```

#### Code Block with Highlights

```markdown
export const highlights = [
  ["line_number", "variable_name", "Description of what this does"],
]

\`\`\`ts title="src/path/to/file.ts" highlights={highlights}
[code]
\`\`\`
```

#### Code Block with Collapsible Lines

```markdown
\`\`\`ts title="src/path/to/file.ts" collapsibleLines="1-10" expandButtonLabel="Show Imports"
[code]
\`\`\`
```

#### Badge Labels

- Use `badgeLabel="Storefront" badgeColor="blue"` for storefront code
- Use `badgeLabel="Medusa Application" badgeColor="green"` for server code

#### Example

```markdown
\`\`\`ts title="src/lib/data/cart.ts" badgeLabel="Storefront" badgeColor="blue"
[code]
\`\`\`
```

### 10. Workflow Diagrams

When documenting workflows, use the `WorkflowDiagram` component:

```markdown
<WorkflowDiagram
  workflow={{
    name: "workflowName",
    steps: [
      {
        type: "step",
        name: "stepName",
        description: "Description of step",
        link: "/references/path/to/step",
        depth: 1
      },
      {
        type: "when",
        condition: "Condition description",
        steps: [...],
        depth: 1
      }
    ]
  }}
/>
```

### 11. Notes and Tips

Use consistently:

- `<Note>` for general notes
- `<Note title="Title">` for titled notes
- `<Note title="Tip">` for tips
- `<Note title="Reminder" forceMultiline>` for reminders

### 12. Links to Documentation

Use the special link syntax:

- `!docs!/path/to/doc` for documentation links
- `!api!/path/to/api` for API reference links
- `!user-guide!/path/to/guide` for user guide links
- `!ui!/path/to/component` for UI component links
- `!cloud!/path/to/doc` for cloud documentation

### 13. Test Sections

Include "Test it Out" sections after major implementations:

```markdown
### Test it Out

To test out [feature], start the Medusa application:

\`\`\`bash npm2yarn badgeLabel="Medusa Application" badgeColor="green"
npm run dev
\`\`\`

[Additional testing instructions...]
```

### 14. Next Steps Section

End every tutorial with:

```markdown
## Next Steps

You've now implemented [feature] in Medusa. [Optional: suggest related features or improvements]

If you're new to Medusa, check out the [main documentation](!docs!/learn), where you'll get a more in-depth understanding of all the concepts you've used in this guide and more.

To learn more about the commerce features that Medusa provides, check out Medusa's [Commerce Modules](../../../commerce-modules/page.mdx).
```

### 15. Optional Sections

#### Troubleshooting

```markdown
### Troubleshooting

If you encounter issues during your development, check out the [troubleshooting guides](../../../troubleshooting/page.mdx).
```

#### Getting Help

```markdown
### Getting Help

If you encounter issues not covered in the troubleshooting guides:

1. Visit the [Medusa GitHub repository](https://github.com/medusajs/medusa) to report issues or ask questions.
2. Join the [Medusa Discord community](https://discord.gg/medusajs) for real-time support from community members.
```

## Code Organization Guidelines

### File Paths

- Always use absolute paths or paths relative to the workspace root
- Use `src/` prefix for source files
- Specify file paths clearly in code block titles

### Naming Conventions

- Use descriptive variable and function names
- Follow TypeScript/JavaScript conventions
- Use camelCase for variables and functions
- Use PascalCase for components and classes

### Code Comments

- Add comments explaining complex logic
- Use highlights arrays to explain important lines
- Include context about why code is structured a certain way

## Content Guidelines

### Clarity

- Write in second person ("you'll learn", "you'll create")
- Use active voice
- Be specific and concrete
- Avoid jargon without explanation

### Completeness

- Include all necessary code
- Explain each step thoroughly
- Provide context for decisions
- Include error handling where relevant

### Consistency

- Use consistent terminology throughout
- Follow the same structure for similar steps
- Use the same formatting for code blocks
- Maintain consistent tone

## Common Patterns

### Module Creation Steps

1. Create module directory
2. Create data models
3. Create module service
4. Export module definition
5. Add module to config
6. Generate migrations

### Workflow Creation Steps

1. Create workflow steps
2. Create workflow
3. Create API route (if needed)
4. Add middleware (if needed)
5. Test

### Storefront Customization Steps

1. Add types/interfaces
2. Add data fetching functions
3. Create components
4. Integrate into existing pages
5. Test

## Checklist for Tutorial Creation

- [ ] Frontmatter with all required fields
- [ ] Metadata export
- [ ] Title section
- [ ] Context paragraph
- [ ] Summary section
- [ ] Step 1: Install Medusa Application
- [ ] Subsequent steps with clear titles
- [ ] Code blocks with proper formatting
- [ ] Highlights arrays for important code
- [ ] Notes and Tips where helpful
- [ ] Test sections after major implementations
- [ ] Workflow diagrams for workflows
- [ ] Links to documentation using special syntax
- [ ] Next Steps section
- [ ] Optional: Troubleshooting section
- [ ] Optional: Getting Help section
- [ ] All code examples are complete and runnable
- [ ] File paths are correct
- [ ] Badge labels for storefront vs server code
- [ ] Consistent formatting throughout

## Special Considerations

### Storefront vs Server Code

- Always use badge labels to distinguish storefront and server code
- Storefront code: `badgeLabel="Storefront" badgeColor="blue"`
- Server code: `badgeLabel="Medusa Application" badgeColor="green"`

### Workflow Documentation

- Always include WorkflowDiagram for complex workflows
- Explain each step clearly
- Show the flow of data
- Include compensation functions when relevant

### API Routes

- Show request/response examples
- Include authentication requirements
- Show middleware configuration
- Include validation schemas

### Admin Customizations

- Show UI route or widget creation
- Include configuration exports
- Show how to test in admin dashboard

## Examples of Good Tutorial Structure

### Example Step

```markdown
## Step 2: Create Custom Module

In this step, you'll create a custom module to [purpose].

<Note>

Refer to the [Modules documentation](!docs!/learn/fundamentals/modules) to learn more.

</Note>

### Create Module Directory

Modules are created under the `src/modules` directory. So, create the directory `src/modules/custom-module`.

### Create Data Models

[Explanation of data models...]

\`\`\`ts title="src/modules/custom-module/models/model.ts"
[code]
\`\`\`

[Explanation of code...]

### Test it Out

To test [feature]:

\`\`\`bash npm2yarn badgeLabel="Medusa Application" badgeColor="green"
npm run dev
\`\`\`

[Testing instructions...]
```

## Final Notes

- Always prioritize clarity and completeness
- Include all necessary context
- Test all code examples
- Follow the established patterns
- Maintain consistency with existing tutorials
- Update this file if new patterns emerge
