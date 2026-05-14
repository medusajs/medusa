# Agent Selection Guide

This directory contains specialized agents for codebase exploration and research. Each agent has a specific purpose and set of tools.

## When to Use Each Agent

### codebase-locator
**Use when you need to find WHERE code lives**

- Locating files relevant to a feature or module
- Finding all components related to a functionality
- Discovering test files, config files, or documentation
- Getting a structured overview of what exists where

**Example queries:**
- "Where is the order cancellation functionality?"
- "Find all files related to product variants"
- "Locate the authentication middleware"

**Output:** Grouped file paths by category (implementation, tests, config, docs, types)

---

### codebase-analyzer
**Use when you need to understand HOW code works**

- Tracing data flow through the system
- Understanding how a feature is implemented
- Explaining technical implementation details
- Following execution paths and call chains
- Understanding complex logic or algorithms

**Example queries:**
- "How does the order creation workflow process payments?"
- "Trace how product prices are calculated"
- "Explain the authentication flow from login to token generation"

**Output:** Detailed technical explanations with file:line references

---

### codebase-pattern-finder
**Use when you need examples to model after**

- Finding similar implementations as templates
- Discovering usage examples of a library or pattern
- Understanding how to implement something based on existing code
- Identifying consistent patterns across the codebase

**Example queries:**
- "Show me examples of API routes with validation"
- "Find similar workflow implementations"
- "How are other modules handling soft deletes?"

**Output:** Concrete code examples with context and usage patterns

---

### web-search-researcher
**Use when you need external information**

- Researching libraries, frameworks, or tools
- Finding documentation for third-party packages
- Understanding industry standards or best practices
- Getting information not available in the codebase

**Example queries:**
- "What are the latest Stripe API payment methods?"
- "Find TypeScript best practices for dependency injection"
- "Research OAuth 2.0 PKCE flow implementation"

**Output:** Synthesized research with source citations

---

## Agent Comparison Matrix

| Agent | Focus | Tools | When to Use |
|-------|-------|-------|-------------|
| **codebase-locator** | WHERE (location) | Grep, Glob, LS | Finding files and directories |
| **codebase-analyzer** | HOW (implementation) | Read, Grep, Glob, LS | Understanding technical details |
| **codebase-pattern-finder** | EXAMPLES (patterns) | Grep, Glob, Read, LS | Finding templates to model after |
| **web-search-researcher** | EXTERNAL (research) | WebSearch, WebFetch | Getting information from the web |

## Constraints

All agents follow these principles:
- **Read-only**: No modifications to code
- **Objective**: No recommendations or critiques
- **Focused**: Stay within their specific domain
- **Accurate**: Provide exact file:line references
- **Complete**: Read files fully, not partially

## Tips

1. **Start with locator**: If you don't know where code lives, use codebase-locator first
2. **Then analyze**: Once you know where, use codebase-analyzer to understand how it works
3. **Find patterns**: Use codebase-pattern-finder to see similar implementations
4. **Research externally**: Use web-search-researcher for non-codebase information
5. **Combine agents**: Use multiple agents in parallel for comprehensive exploration
