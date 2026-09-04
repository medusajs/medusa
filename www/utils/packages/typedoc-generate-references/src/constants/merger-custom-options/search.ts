import { FormattingOptionsType } from "types"

const searchOptions: FormattingOptionsType = {
  "^search/.*ISearchModuleService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn about the different methods in the Search Module's service and how to use them.
    
:::note

The Search Module is available starting [Medusa v2.20.0](https://github.com/medusajs/medusa/releases/tag/v2.20.0).

:::`,
    frontmatterData: {
      slug: "/references/search/service",
      tags: ["search", "server", "how to"],
      sidebar_label: "Use Search Module",
    },
    reflectionTitle: {
      fullReplacement: "How to Use Search Module",
    },
    expandMembers: true,
    sortMembers: true,
    startSections: [
      `## Resolve Search Module's Service

In your workflow's step, you can resolve the Search Module's service from the Medusa container:

\`\`\`ts
import { Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  "step-1",
  async ({}, { container }) => {
    const searchModuleService = container.resolve(
      Modules.Search
    )
    
    // TODO use searchModuleService
  } 
)
\`\`\`

You can then use the Search Module's service's methods in the step, which would use the underlying provider's logic. The rest of this guide details these methods.

---
`,
    ],
  },
}

export default searchOptions
