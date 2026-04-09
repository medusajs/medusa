# Vale and Lint Rules

Rules enforced by Vale (`www/vale/`) and ESLint (`lint:content`) that all documentation must pass.

## First-Person Prohibition

**Rule:** Never use first-person plural.

```
❌ We recommend using workflows for all mutations.
❌ Let's create a workflow.
❌ Our platform supports...
❌ Us, we've, we're

✅ Use workflows for all mutations.
✅ Create a workflow.
✅ The platform supports...
✅ You can configure...
```

Exceptions: `US` (United States) is allowed.

## Passive Voice

Vale warns on passive voice. Rewrite as active:

```
❌ The workflow is created by calling createWorkflow.
❌ Products are fetched from the database.
❌ The configuration has been updated.

✅ Call createWorkflow to create a workflow.
✅ The service fetches products from the database.
✅ Update the configuration.
```

## Problematic Words

Vale flags these — avoid them:

| Avoid | Use instead |
|---|---|
| simply | (remove it) |
| just | (remove it) |
| easy | (remove it) |
| straightforward | (remove it) |
| obviously | (remove it) |
| basically | (remove it) |

## Code Line Length

**Rule:** Code lines must be ≤ 64 characters (enforced by `lint:content`).

This applies to code blocks inside MDX files. Break long lines:

```ts
// ❌ Too long
import { createWorkflow, WorkflowResponse, createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

// ✅ Break imports
import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
```

## TypeScript Preference

Vale warns if you use `` ```tsx `` for TypeScript files. Use `` ```ts `` instead:

```
❌ ```tsx
✅ ```ts
```

Use `` ```tsx `` only for React component files that contain JSX.

## URL Format

Never use bare URLs in prose text — always use the markdown link format:

```
❌ Visit https://docs.medusajs.com for more information.
✅ Visit the [Medusa documentation](https://docs.medusajs.com) for more information.
```

## Sentence Length

Keep sentences concise. Vale suggests sentences under ~30 words. Split complex sentences:

```
❌ The Product Module is a standalone package that provides product management
   features and integrates with the Cart Module to allow adding products to carts,
   which then connects to the Order Module for order management.

✅ The Product Module is a standalone package that provides product management
   features. It integrates with the Cart Module to allow adding products to carts.
```

## Running Validation Mentally

Before writing prose, check:
- [ ] Any "we", "us", "let's", "our" → replace with "you" or imperative
- [ ] Any passive voice constructions → rewrite active
- [ ] Any "simply", "just", "easy", etc. → remove
- [ ] Code lines over 64 characters → break them
- [ ] Bare URLs → wrap in `[label](url)`
- [ ] `tsx` language tag for non-JSX TypeScript → change to `ts`
