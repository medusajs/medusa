---
description: 'Learn how to set up the Medusa Admin repository for local development and customization. This includes cloning the GitHub repository and adding an upstream repository.'
addHowToData: true
---

# Customize Medusa Admin

In this document, you’ll learn how to customize the Medusa admin by forking it, and how to keep it updated with changes from the main repository.

## Overview

Although Medusa provides an intuitive admin that should cover all your ecommerce needs, you are free to customize the Medusa admin as you see fit.

For customization and development, it’s recommended that you fork the main Medusa admin repository. That way, you can configure your forked repository to pull changes from the main Medusa admin repository for any latest updates.

In this document, you’ll learn how to:

- Fork the Medusa admin repository.
- Configure the Medusa admin repository as an upstream repository.
- Pull changes from the upstream repository to keep your fork synced with the Medusa admin repository.

---

## Prerequisites

### Required Tools

[Git CLI tool](../development/backend/prepare-environment.mdx#git)

### Required Accounts

[GitHub](https://github.com/)

---

## Fork the Medusa Admin Repository

To fork the Medusa admin:

1. Go to the [Medusa admin repository](https://github.com/medusajs/admin).
2. Click on the Fork button at the top right.
3. You can optionally change the name of the repository and description.
4. Once done, click on the Create fork button.
5. After your fork is created, you can clone it using the following command:

```bash
git clone <REPOSITORY_URL>
```

Where `<REPOSITORY_URL>` is the HTTPS URL of your repository. You can obtain it from your forked repository’s GitHub page by clicking on the Code button and copying the URL.

---

## Configure Upstream Repository

To configure the Medusa admin as the upstream repository:

1. Change to the directory of your cloned forked repository. 
2. Run the following command to add the Medusa admin repository as an upstream repository:

```bash
git remote add upstream https://github.com/medusajs/admin
```

1. You can verify that it has been added by running the following command:

```bash
git remote -v
```

You should see an `origin` repository which is your forked repository, and an `upstream` repository which is the Medusa admin repository.

---

## Update your Fork with Latest Changes

To update your fork with the latest changes from the Medusa admin repository:

1. Change to the directory of your cloned forked repository.
2. Run the following command to fetch the latest changes from the Medusa admin repository:

```bash
git fetch upstream
```

1. Make sure you’re on your `main` or `master` branch of the forked repository:

```bash
git checkout main
```

1. Merge the changes from the `main` branch of the Medusa admin repository:

```bash
git merge upstream/main
```

If your forked repository doesn’t have any conflicts with the changes from the Medusa admin repository, the merge will be done successfully. Otherwise, you’ll need to [resolve these conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line).

---

## See Also

- [Admin API reference](/api/admin).
- [Local development with Medusa](../development/fundamentals/local-development.md).
