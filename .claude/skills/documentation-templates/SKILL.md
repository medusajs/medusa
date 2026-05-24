---
name: documentation-templates
description: Guidelines for high-quality technical documentation using the Diátaxis framework. Tutorials, How-to, Explanation, Reference.
allowed-tools: Read, Write, Edit
---

# 📚 Technical Documentation (Diátaxis Framework)

> "Documentation should be clear, concise, and fit for purpose."

---

## 🏗️ The Diátaxis Quadrants

When writing documentation, identify the **Quadrant**:

### 1. Tutorials (Learning-oriented)
- **Goal**: Teach the basics through hands-on experience.
- **Tone**: Gentle, step-by-step, no theory.
- **Example**: "Getting started with ai-helpers."

### 2. How-to Guides (Goal-oriented)
- **Goal**: Solve a specific problem for a specific user.
- **Tone**: Direct, action-focused, "Recipe" style.
- **Example**: "How to add a new AI agent."

### 3. Explanation (Understanding-oriented)
- **Goal**: Deep dive into the "Why" and "How it works".
- **Tone**: Narrative, conceptual, historical context.
- **Example**: "Why we use a multi-agent architecture."

### 4. Reference (Information-oriented)
- **Goal**: Provide technical facts (API, Config, CLI).
- **Tone**: Technical, structured, exhaustive.
- **Example**: "AI_CODING.prompt.md full specification."

---

## 🛠️ Documentation Standards

### Writing Rules
- **Active Voice**: "Run the script" instead of "The script should be run."
- **Small Chunks**: Use headers, lists, and tables. No "Wall of Text."
- **Code Examples**: Must be tested and include comments.
- **Structure First**: Outline before writing.

### Review Checklist
- [ ] Is the audience defined?
- [ ] Does it belong to exactly ONE quadrant?
- [ ] Is it searchable (clear headers)?
- [ ] Are all external links verified?

---

## 🚫 Anti-Patterns to Flag
- **"The Kitchen Sink"**: Mixing a tutorial with a deep-dive explanation.
- **"Outdated Truths"**: Mentioning features that were removed/changed.
- **"Mystery Meat"**: Using vague titles like `docs.md` or `info.txt`.

---

## ✅ Documentation Workflow
1. **Identify Need**: What is the user asking?
2. **Select Quadrant**: Tutorial? How-to? Explanation? Reference?
3. **Draft**: Follow the quadrant's tone.
4. **Audit**: Run against the Writing Rules.
