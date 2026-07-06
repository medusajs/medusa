# Prompt Improver Feature - Implementation Plan

## Overview

This plan details how to implement an AI-powered prompt improvement feature for Bloom documentation. The feature helps users write better prompts by transforming vague or poorly-structured prompts into clear, actionable ones using Ollama AI.

## Feature Description

**What it does**:
- Users type a prompt into a text area
- Click "Improve Prompt" button
- AI analyzes and rewrites the prompt following best practices
- Improved prompt displays in a code block, ready to copy-paste into Bloom

**Key Benefits**:
- Helps non-technical users write effective prompts
- Reduces wasted tokens from unclear instructions
- Teaches prompting best practices through examples
- Reusable across multiple documentation pages with different rules

## Architecture

### Component Structure
```
www/
├── packages/
│   └── docs-ui/
│       └── src/
│           └── hooks/
│               └── use-ai/
│                   └── index.tsx        # AI hook (to create)
└── apps/
    └── bloom/
        ├── config/
        │   └── index.ts                 # Config (to update)
        ├── components/
        │   └── PromptImprover.tsx       # Component (to create)
        └── app/
            └── store-design-prompting/
                └── page.mdx             # Integration (to update)
```

### Data Flow
```
User Input → PromptImprover Component → useAI Hook → Ollama (Railway) → Streaming Response → CodeBlock Display
```

### Dependencies

Add to `www/packages/docs-ui/package.json`:
```json
{
  "dependencies": {
    "ai": "^6.0.79",
    "ollama-ai-provider-v2": "^3.3.0"
  }
}
```

## Implementation Steps

### Step 1: Create useAI Hook

**File**: `www/packages/docs-ui/src/hooks/use-ai/index.tsx`

**Full Implementation**:

```typescript
"use client"

import { streamText } from "ai"
import { createOllama } from "ollama-ai-provider-v2"
import { useSiteConfig } from "../../providers/SiteConfig"

type UseAIProps = {
  systemPrompt?: string
}

export const useAI = ({ systemPrompt }: UseAIProps) => {
  const {
    config: { ai },
  } = useSiteConfig()

  const customOllama = createOllama({
    baseURL: ai?.ollamaUrl,
  })

  const sendPrompt = (prompt: string) => {
    if (!ai?.ollamaUrl) {
      throw new Error("AI configuration is missing")
    }

    const { textStream } = streamText({
      model: customOllama("llama3"),
      prompt,
      system: systemPrompt,
    })

    return textStream
  }

  return {
    sendPrompt,
  }
}
```

**Export Hook**: Add to `www/packages/docs-ui/src/hooks/index.tsx`:
```typescript
export { useAI } from "./use-ai"
```

**Key Features**:
- Streams responses from Ollama in real-time
- Configurable system prompt for different use cases
- Uses site config for Ollama URL
- Error handling for missing configuration

### Step 2: Configure AI Settings

**File**: `www/apps/bloom/config/index.ts`

**Add AI Configuration**:

```typescript
import { DocsConfig, Sidebar } from "types"
import { generatedSidebars } from "@/generated/sidebar.mjs"
import { globalConfig } from "docs-ui"
import { basePathUrl } from "../utils/base-path-url"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

export const config: DocsConfig = {
  ...globalConfig,
  titleSuffix: "Bloom Documentation",
  description: "...",
  baseUrl,
  basePath,
  sidebars: generatedSidebars as Sidebar.Sidebar[],
  project: {
    title: "Bloom",
    key: "bloom",
  },
  logo: basePathUrl("/images/logo.png"),
  breadcrumbOptions: {
    startItems: [
      {
        title: "Documentation",
        link: basePathUrl("/"),
      },
    ],
  },
  version: {
    ...globalConfig.version,
    hide: true,
  },
  // Add AI configuration
  ai: {
    ollamaUrl: process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434",
  },
}
```

**Environment Variables**: Add to `.env.local`:
```env
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434  # For local development
# NEXT_PUBLIC_OLLAMA_URL=https://your-ollama.railway.app  # For production
```

### Step 3: Create PromptImprover Component

**File**: `www/apps/bloom/components/PromptImprover.tsx`

**Full Implementation**:

```typescript
"use client"

import { useState } from "react"
import { Button, CodeBlock, TextArea, useAI } from "docs-ui"

export interface PromptImproverProps {
  /**
   * The rules/guidelines for improving prompts.
   * These will be included in the system prompt.
   */
  rules: string[]
  /**
   * Optional placeholder text for the input
   */
  placeholder?: string
}

export function PromptImprover({
  rules,
  placeholder = "Type your prompt here...",
}: PromptImproverProps) {
  const [userPrompt, setUserPrompt] = useState("")
  const [improvedPrompt, setImprovedPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const systemPrompt = buildSystemPrompt(rules)

  const { sendPrompt } = useAI({
    systemPrompt,
  })

  async function improvePrompt() {
    if (!userPrompt.trim()) {
      return
    }

    setLoading(true)
    setError(null)
    setImprovedPrompt("")

    try {
      const textStream = sendPrompt(
        `Improve this Bloom prompt following the guidelines: "${userPrompt}"`
      )
      for await (const chunk of textStream) {
        setImprovedPrompt((prev) => prev + chunk)
      }
    } catch (err) {
      console.error("Failed to improve prompt:", err)
      setError("Failed to improve prompt")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <TextArea
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      <Button onClick={improvePrompt} disabled={loading}>
        {loading ? "Improving..." : "Improve Prompt"}
      </Button>
      {error && <p className="text-medusa-tag-red-text">{error}</p>}
      {improvedPrompt && (
        <CodeBlock
          title="Improved Prompt"
          source={improvedPrompt}
          lang="bash"
          noAskAi
          isTerminal={false}
          noReport
          className="!mb-0"
        />
      )}
    </div>
  )
}

function buildSystemPrompt(rules: string[]): string {
  return `You are a prompt improvement assistant for Bloom, an AI-powered ecommerce store builder.

SCOPE AWARENESS - READ THIS FIRST:

Generic/Vague Prompts (e.g., "create a shoe store", "build a homepage", "make an online store"):
→ EXPAND with features, sections, and details to make it actionable
→ Add product suggestions, layout structure, and ecommerce functionality
→ Example transformation:
  Input: "I want to create a shoe store"
  Output: "Create a shoe store homepage with a hero section featuring a main product image and tagline, a product grid showing 8 featured sneakers with images and prices, categories section for Running, Casual, and Sports shoes, customer testimonials, and a newsletter signup form"

Focused/Specific Prompts (e.g., "change the header button to blue", "add more spacing between products"):
→ ONLY restructure and clarify - do NOT add features
→ Do NOT add design details not mentioned in the original

OUTPUT RULES - READ CAREFULLY:

1. Output ONLY the improved prompt itself - nothing else
2. Do NOT include ANY explanations, notes, or commentary
3. Do NOT write "(Note: ...)" or "I've..." or "This prompt..."
4. Do NOT explain what you did or why
5. The output must be copy-paste ready for Bloom's chat

FORBIDDEN PHRASES - Never use these:
- "Here's an improved version"
- "I've improved the prompt"
- "Note:"
- "This prompt"
- Any parenthetical explanations like (Note: ...)

FORMAT:
- Use line breaks between sections for readability
- If breaking into multiple prompts, clearly separate them with "---" and label each as "Prompt 1:", "Prompt 2:", etc.
- This helps users know these are separate prompts to paste into Bloom one at a time

Your output = exactly what user pastes into Bloom. Nothing more.

Improve user prompts following these guidelines:

${rules.map((rule, index) => `${index + 1}. ${rule}`).join("\n")}
`
}
```

**Key Design Decisions**:

1. **Reusable with Props**: Accepts `rules` array so different pages can customize improvement guidelines
2. **Streaming Responses**: Uses `for await...of` to stream AI output in real-time
3. **Error Handling**: Displays error message if AI call fails
4. **Loading State**: Disables button and shows "Improving..." during processing
5. **Client Component**: Uses "use client" directive for React state and async operations

### Step 4: Integrate into Documentation Page

**File**: `www/apps/bloom/app/store-design-prompting/page.mdx`

**Add after metadata, before first content section**:

```mdx
import { PromptImprover } from "@/components/PromptImprover"

export const metadata = {
  title: `Write Better Prompts for Store Design`,
}

# {metadata.title}

This guide teaches you how to write better prompts for store design. Good prompts get you better results, save your tokens, and ensure you have a smoother experience working with Bloom.

## Generate Improved Prompts

Enter your prompt to improve it and get suggestions on how to make it better based on the guidelines in this guide.

<PromptImprover
  rules={[
    "If the prompt tries to do multiple things, break it into separate sequential steps",
    "Replace positional descriptions ('button at the top', 'section on the left') with direct element references",
    "Remove vague words ('better', 'nicer', 'modern', 'good') and replace with specific actions or outcomes",
    "Make instructions more descriptive by expanding generic actions into specific implementation details",
    "Don't add generic ecommerce setup phrases like 'add ecommerce platform' or 'set up online store' - Bloom is already an ecommerce builder",
    "Rephrase unclear requests into clear, actionable instructions",
    "Structure the prompt with the main action or goal stated first",
    "Keep each step focused on a single change or section"
  ]}
  placeholder="Make the homepage better"
/>

## Build Step by Step, Not All at Once

[Rest of the guide content...]
```

### Step 5: Deploy Ollama on Railway

**Requirements**:
1. Railway account (https://railway.app)
2. Docker knowledge (basic)
3. Credit card for Railway billing

**Deployment Steps**:

1. **Create Railway Project**:
   ```bash
   railway init
   ```

2. **Deploy Ollama Container**:
   - Use Railway's Docker deployment
   - Image: `ollama/ollama:latest`
   - Expose port: 11434

3. **Pull AI Model**:
   ```bash
   # SSH into container via Railway CLI
   railway run bash

   # Pull model (llama3 recommended for prompt improvement)
   ollama pull llama3

   # Alternative: mistral (lighter, faster)
   ollama pull mistral
   ```

4. **Configure Internal Networking**:
   - Keep Ollama on Railway's private network
   - Only accessible from docs app (not public internet)
   - Use Railway's private DNS: `ollama.railway.internal:11434`

5. **Set Health Checks**:
   - HTTP check on `/api/tags` endpoint
   - Restart on failure

6. **Update Environment Variables**:
   ```env
   # In Bloom app on Railway
   NEXT_PUBLIC_OLLAMA_URL=https://ollama.railway.app  # or private DNS
   ```

**Railway Configuration Example** (`railway.json`):
```json
{
  "build": {
    "docker": {
      "dockerfile": "Dockerfile.ollama"
    }
  },
  "deploy": {
    "healthcheckPath": "/api/tags",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## System Prompt Engineering - Key Learnings

### Problem 1: AI Adds Meta-Commentary

**Issue**: Output included explanations like:
```
Here's an improved version of the prompt:

[improved prompt]

(Note: I've restructured this to be clearer...)
```

**Solution**:
- Added explicit OUTPUT RULES section
- Created FORBIDDEN PHRASES list
- Emphasized "Output ONLY the improved prompt itself - nothing else"
- Added line: "Your output = exactly what user pastes into Bloom. Nothing more."

### Problem 2: Generic Prompts Not Expanded

**Issue**: Input "create a shoe store" → Output "Create a new online store with Bloom" (too basic)

**Root Cause**: Restrictive rules like "do not add design details" prevented expansion

**Solution**:
- Added SCOPE AWARENESS section at the top
- Distinguished between generic prompts (expand) and focused prompts (clarify only)
- Provided concrete example showing desired expansion
- Positioned SCOPE AWARENESS first so AI reads it before restrictive rules

### Problem 3: Rules Causing Suggestions

**Issue**: Rules like "Suggest using Selection Mode" made AI add meta-commentary

**Bad Rule Examples** (cause suggestions):
- "Suggest using Selection Mode for element selection"
- "Recommend uploading screenshots for visual references"
- "Add a note about checking mobile view"

**Good Rule Examples** (transform prompts):
- "Replace positional descriptions with direct element references"
- "Remove vague words and replace with specific actions"
- "Break multi-step prompts into separate sequential steps"

**Key Insight**: Rules should focus on **transforming** prompt structure, not **adding suggestions** to output

### Problem 4: Single-Line Output

**Issue**: Long prompts returned on single line, hard to read

**Solution**:
- Added FORMAT section recommending line breaks
- Instruction to separate sections for readability
- Multi-prompt separation with "---" and "Prompt 1:", "Prompt 2:" labels

## Usage Examples

### Example 1: Generic Prompt Expansion

**Input**:
```
I want to create a shoe store
```

**Expected Output**:
```
Create a shoe store homepage with a hero section featuring a main product image and tagline,
a product grid showing 8 featured sneakers with images and prices, categories section for
Running, Casual, and Sports shoes, customer testimonials, and a newsletter signup form
```

### Example 2: Focused Prompt Clarification

**Input**:
```
Make the button at the top look better
```

**Expected Output**:
```
Change the header button's background color to navy blue and increase padding to 12px
```

### Example 3: Multi-Step Breakdown

**Input**:
```
Create complete store with header, products, footer, and checkout
```

**Expected Output**:
```
Prompt 1:
Create a header with logo, navigation menu (Shop, About, Contact), and cart icon

---

Prompt 2:
Add a product grid showing 12 items with product images, names, and prices

---

Prompt 3:
Create a footer with social media links, copyright text, and contact email

---

Prompt 4:
Add a checkout page with shipping form, payment options, and order summary
```

## Integration into Other Pages

The component can be added to any Bloom documentation page. Here are recommended integrations:

### Demo Data Guide

**File**: `www/apps/bloom/app/demo-data/page.mdx`

```mdx
<PromptImprover
  rules={[
    "If requesting multiple products, specify quantity, category, and price range",
    "Replace 'demo data' with specific data types (products, reviews, categories)",
    "Make product descriptions specific to the store type",
    "Include variant details (sizes, colors) when relevant",
    "Don't add generic ecommerce setup phrases - focus on data generation"
  ]}
  placeholder="Add demo products"
/>
```

### Selection Mode Guide

**File**: `www/apps/bloom/app/selection-mode/page.mdx`

```mdx
<PromptImprover
  rules={[
    "Use 'this element' or 'the selected element' instead of describing position",
    "Be specific about the change (color, size, spacing, text)",
    "Keep instructions focused on the selected element only",
    "Don't describe which element - Selection Mode handles that"
  ]}
  placeholder="Change this button"
/>
```

### Responsive View Guide

**File**: `www/apps/bloom/app/responsive-view/page.mdx`

```mdx
<PromptImprover
  rules={[
    "Specify 'on mobile' or 'on desktop' to clarify device target",
    "Focus on responsive-specific issues (spacing, text size, layout)",
    "Don't add features - focus on fixing mobile view issues",
    "Be specific about what's wrong in mobile view"
  ]}
  placeholder="Fix the mobile layout"
/>
```

## Testing Strategy

### Manual Test Cases

1. **Generic Prompt Test**:
   - Input: "create a jewelry store"
   - Verify: Output includes hero, products, categories, testimonials

2. **Focused Prompt Test**:
   - Input: "make button bigger"
   - Verify: Output clarifies which button and specific size

3. **Multi-Step Test**:
   - Input: "build complete ecommerce site"
   - Verify: Output breaks into Prompt 1, Prompt 2, etc. with "---" separators

4. **Edge Cases**:
   - Empty input → Should not submit
   - Very long input (1000+ chars) → Should handle gracefully
   - Special characters → Should preserve in output

### Quality Checks

For each test, verify:
- ✅ No meta-commentary in output
- ✅ No forbidden phrases
- ✅ No explanations or notes
- ✅ Copy-paste ready format
- ✅ Appropriate expansion for generic prompts
- ✅ Appropriate clarification for focused prompts

### Local Testing Setup

1. **Install Ollama locally**:
   ```bash
   # macOS
   brew install ollama

   # Start Ollama
   ollama serve
   ```

2. **Pull model**:
   ```bash
   ollama pull llama3
   ```

3. **Test API**:
   ```bash
   curl http://localhost:11434/api/tags
   ```

4. **Run Bloom docs**:
   ```bash
   cd www/apps/bloom
   yarn dev
   ```

5. **Visit** `http://localhost:3000/store-design-prompting`

## Performance Considerations

**Token Usage per Request**:
- System prompt + rules: ~500 tokens
- User prompt: ~50 tokens (average)
- Response: ~100-300 tokens (average)
- Total: ~650-850 tokens per improvement

**Cost Estimation**:
- Depends on Railway pricing and usage
- Ollama itself is free (open source)
- Estimate cost: $5-20/month for moderate use (1000-5000 improvements)

**Optimization Ideas**:
1. **Cache common prompts**: Store frequently improved prompts to avoid redundant API calls
2. **Use smaller model**: Mistral is lighter/faster than llama3
3. **Debounce input**: Wait for user to stop typing before suggesting improvements
4. **Add rate limiting**: Prevent abuse per user/IP

## Security Considerations

### API Protection Options

**Option 1: Railway Private Networking (Recommended)**
- Keep Ollama on internal network only
- Only accessible from docs app
- No public internet access
- Zero configuration needed

**Option 2: API Key Authentication**
- Add reverse proxy (Nginx/Caddy) with API key validation
- Rotate keys periodically
- Log access for monitoring
- More complex setup

**Option 3: Rate Limiting**
- Limit requests per IP/user (e.g., 10 per minute)
- Prevent abuse and cost overruns
- Can use Cloudflare or custom middleware

**Recommendation**: Use Option 1 (private networking) for simplicity and security

### Environment Variables Security

- Never commit `.env.local` to git
- Use Railway's secret management for production
- Rotate Ollama URL if exposed publicly
- Monitor usage for anomalies

## Troubleshooting

### Issue: "AI configuration is missing"

**Cause**: `NEXT_PUBLIC_OLLAMA_URL` not set

**Solution**:
```bash
# Add to .env.local
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
```

### Issue: Connection refused to Ollama

**Cause**: Ollama server not running

**Solution**:
```bash
# Start Ollama locally
ollama serve

# Or check Railway deployment logs
railway logs
```

### Issue: Model not found

**Cause**: Model not pulled in Ollama

**Solution**:
```bash
# Pull model
ollama pull llama3

# Verify
ollama list
```

### Issue: Slow responses

**Cause**: Model too large or server under load

**Solutions**:
- Use smaller model: `ollama pull mistral`
- Increase Railway resources
- Add caching layer
- Implement request queuing

### Issue: Empty or cut-off responses

**Cause**: Streaming timeout or connection issue

**Solutions**:
- Increase timeout in useAI hook
- Check Railway logs for errors
- Verify network connectivity
- Test with smaller prompts first

## Future Enhancements

### Phase 2 (Nice to Have)
- **Copy Button**: One-click copy improved prompt
- **History**: Save previously improved prompts
- **Side-by-Side**: Show original and improved together
- **Feedback**: Let users rate improvements
- **Undo**: Revert to original prompt

### Phase 3 (Advanced)
- **Templates**: Pre-made prompts for common use cases
- **Analytics**: Track which improvements work best
- **Multi-Language**: Support non-English prompts
- **Voice Input**: Speech-to-text for prompts
- **Direct Integration**: "Use This Prompt" button sends to Bloom chat
- **Learning**: Improve system prompt based on user feedback

## Rollback Plan

If feature needs to be removed:

1. **Remove component usage** from MDX files:
   ```bash
   # Search for PromptImprover usage
   grep -r "PromptImprover" www/apps/bloom/app/

   # Remove import and component from each file
   ```

2. **Delete component file**:
   ```bash
   rm www/apps/bloom/components/PromptImprover.tsx
   ```

3. **Delete hook** (if not used elsewhere):
   ```bash
   rm www/packages/docs-ui/src/hooks/use-ai/index.tsx
   ```

4. **Remove AI config** from `www/apps/bloom/config/index.ts`:
   ```typescript
   // Remove these lines:
   ai: {
     ollamaUrl: process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434",
   },
   ```

5. **Shut down Railway deployment**:
   ```bash
   railway down
   ```

6. **Remove dependencies** from `package.json`:
   ```json
   // Remove from docs-ui:
   "ai": "^6.0.79",
   "ollama-ai-provider-v2": "^3.3.0"
   ```

## Success Metrics

Track these metrics to measure success:

1. **Usage**: Number of prompts improved per day/week
2. **Quality**: User feedback on improved prompts
3. **Token Savings**: Reduction in failed Bloom attempts
4. **Engagement**: Time spent on documentation pages with feature
5. **Cost**: Railway costs vs. value provided
6. **Adoption**: % of users trying the feature

## Resources

### Documentation
- [Ollama API Docs](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Railway Deployment](https://docs.railway.app/)
- [Vercel AI SDK (ai package)](https://sdk.vercel.ai/docs)
- [React Streaming](https://react.dev/reference/react/use#streaming-data-from-server-to-client)

### Tools
- [Ollama](https://ollama.ai) - Local LLM runtime
- [Railway](https://railway.app) - Hosting platform
- [Vercel AI SDK](https://www.npmjs.com/package/ai) - AI streaming utilities

---

**Plan Status**: Ready for implementation
**Estimated Time**: 6-8 hours (including deployment and testing)
**Priority**: Medium (improves UX but not blocking)
**Dependencies**:
- Ollama deployment on Railway
- AI SDK packages (ai, ollama-ai-provider-v2)
- Environment configuration

**Last Updated**: 2026-02-11
