import { FormattingOptionsType } from "types"

const eventOptions: FormattingOptionsType = {
  "^event/.*IEventBusModuleService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn about the different methods in the Event Module's service and how to use them.`,
    frontmatterData: {
      slug: "/references/event-service",
      tags: ["event", "server", "how to"],
      sidebar_label: "Use Event Module",
      keywords: ["event", "provider", "integration"],
    },
    reflectionTitle: {
      fullReplacement: "How to Use Event Module",
    },
    expandMembers: true,
    startSections: [
      `## Resolve Event Module's Service

In your workflow's step, you can resolve the Event Module's service from the Medusa container:

\`\`\`ts
import { Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  "step-1",
  async ({}, { container }) => {
    const eventModuleService = container.resolve(
      Modules.EVENT_BUS
    )
    
    // TODO use eventModuleService
  } 
)
\`\`\`

This will resolve the service of the configured Event Module, which is the [Local Event Module](https://docs.medusajs.com/resources/infrastructure-modules/event/local) by default.

You can then use the Event Module's service's methods in the step. The rest of this guide details these methods.

---
`,
    ],
  },
}

export default eventOptions
