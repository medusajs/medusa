# Contributing

Thank you for considering contributing to Medusa! This document will outline how to submit changes to this repository and which conventions to follow. If you are ever in doubt about anything we encourage you to reach out either by submitting an issue here or reaching out [via Discord](https://discord.gg/xpCwq3Kfn8).

If you're contributing to our documentation, make sure to also check out the [contribution guidelines on our documentation website](https://docs.medusajs.com/contribution-guidelines).

### Important

Our core maintainers prioritize pull requests (PRs) from within our organization. External contributions are regularly triaged, but not at any fixed cadence. It varies depending on how busy the maintainers are. This is applicable to all types of PRs, so we kindly ask for your patience.

As this package contains components for the Medusa UI design system, we do not accept PRs for new components. If you have a suggestion for a new component, please open an issue instead and label it with `feature request`.

If you, as a community contributor, wish to work on more extensive features, please reach out to CODEOWNERS instead of directly submitting a PR with all the changes. This approach saves us both time, especially if the PR is not accepted (which will be the case if it does not align with our roadmap), and helps us effectively review and evaluate your contribution if it is accepted.

## Prerequisites

- **You're familiar with GitHub Issues and Pull Requests**
- **You've read the [docs](https://docs.medusajs.com).**
- **You've setup a test project with `medusa new`**

## Issues before PRs

1. Before you start working on a change please make sure that there is an issue for what you will be working on. You can either find and [existing issue](https://github.com/medusajs/ui/issues) or [open a new issue](https://github.com/medusajs/ui/issues/new) if none exists. Doing this makes sure that others can contribute with thoughts or suggest alternatives, ultimately making sure that we only add changes that make

2. When you are ready to start working on a change you should first [fork the Medusa UI repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and [branch out](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-and-deleting-branches-within-your-repository) from the `develop` branch.
3. Make your changes.
4. [Open a pull request towards the develop branch in the Medusa UI repo](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork). Within a couple of days a Medusa team member will review, comment and eventually approve your PR.

## Workflow

### Branches

All changes should be part of a branch and submitted as a pull request - your branches should be prefixed with one of:

- `fix/` for bug fixes
- `feat/` for features
- `docs/` for documentation changes

### Commits

Strive towards keeping your commits small and isolated - this helps the reviewer understand what is going on and makes it easier to process your requests.

### Pull Requests

Once your changes are ready you must submit your branch as a pull request. Your pull request should be opened against the `develop` branch in the main Medusa UI repo.

In your PR's description you should follow the structure:

- **What** - what changes are in this PR
- **Why** - why are these changes relevant
- **How** - how have the changes been implemented
- **Testing** - how has the changes been tested or how can the reviewer test the feature

We highly encourage that you do a self-review prior to requesting a review. To do a self review click the review button in the top right corner, go through your code and annotate your changes. This makes it easier for the reviewer to process your PR.

#### Merge Style

All pull requests are squashed and merged.

### Release

The Medusa team will regularly create releases from the develop branch.
