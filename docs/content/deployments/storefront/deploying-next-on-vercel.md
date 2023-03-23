---
description: 'Learn step-by-step.'
addHowToData: true
---

# Deploy Next.js Storefront on Vercel

In this document, you’ll learn how to deploy the Next.js Storefront on Vercel.

Alternatively, you can directly deploy the Next.js storefront to Vercel with this button.

<a 
  href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmedusajs%2Fnextjs-starter-medusa.git&env=NEXT_PUBLIC_MEDUSA_BACKEND_URL&envDescription=URL%20of%20your%20Medusa%20Backend" class="img-url no-zoom-img">
  <img src="https://vercel.com/button" alt="Deploy with Vercel" class="no-zoom-img"/>
</a>

## Prerequisites

### Medusa Components

It is assumed you already have installed the Next.js storefront locally. If not, please follow along with [this guide](../../starters/nextjs-medusa-starter.mdx) instead.

It’s also assumed you already have the Medusa backend deployed, which the Next.js storefront interacts with. If not, you can check out one of the [deployment documentation related to the Medusa backend](../server/index.mdx).

### Required Accounts

- [Vercel Account](https://vercel.com)
- [GitHub Account](https://github.com/): Only required if you’re deploying through the Vercel website.

:::note

If you want to use another Git Provider, it’s possible to follow along with this guide, but you’ll have to perform the equivalent steps in your Git Provider.

:::

### Required Tools

- [Git CLI](../../development/backend/prepare-environment.mdx): Only required if you’re deploying through the Vercel website.

---

## Step 1: Create GitHub Repository

:::note

This step is only required if you’re deploying from the Vercel website. However, it’s highly recommended to connect your Vercel project to a Git repository for a better developer experience.

:::

Before you can deploy your Next.js storefront, you need to create a GitHub repository and push the code base to it. To do that:

1. On GitHub, click the plus icon at the top right, then click New Repository.
2. You’ll then be redirected to a new page with a form. In the form, enter the Repository Name.
3. Scroll down and click Create repository.

### Push Code to GitHub Repository

The next step is to push the code to the GitHub repository you just created.

After creating the repository, you’ll be redirected to the repository’s page. On that page, you should see a URL that you can copy to connect your repository to a local directory.

Copy the link. Then, open your terminal in the directory that holds your Next.js storefront codebase and run the following commands:

```bash
git init
git remote add origin <GITHUB_URL>
```

Where `<GITHUB_URL>` is the URL you just copied.

Then, add, commit, and push the changes into the repository:

```bash
git add .
git commit -m "initial commit"
git push origin master
```

After pushing the changes, you can find the files in your GitHub repository.

---

## Step 2: Deploy to Vercel

This section covers how to deploy the storefront, either using the Vercel website or using Vercel’s CLI tool.

### Option 1: Using the Vercel Website

This section explains how to deploy the storefront using the Vercel website:

1. Open the [Vercel dashboard](https://vercel.com/dashboard) after logging in.
2. Click on the “Add New…” button next to the search bar.
3. Choose Project from the dropdown.
4. In the new page that opens, find the Git repository that holds your Next.js storefront and click on the Import button. If you haven’t connected your Vercel account to any Git provider, you must do that first.
5. In the Configure Project form:
    1. Open the Environment Variables collapsible, and add an environment variable with the name `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and the value being the URL to your deployed Medusa Backend.
    2. You can optionally edit the Project Name.
6. Once you’re done, click on the “Deploy” button.

This will start the deployment of the storefront. Once it’s done, you’ll be redirected to the main dashboard of your new project.

:::note

At this point, when you visit the storefront, you will face errors related to Cross-Origin Resource Sharing (CORS) while using the storefront. Before you start using the storefront, follow along the [Configure CORS on the Medusa Backend](#step-3-configure-cors-on-the-medusa-backend) section.

:::

### Option 2: Using Vercel’s CLI Tool

This section explains how to deploy the storefront using the Vercel CLI tool. You should have the CLI tool installed first, as explained in [Vercel’s documentation](https://vercel.com/docs/cli).

In the directory holding your storefront, run the following command to deploy your storefront:

```bash
vercel --build-env NEXT_PUBLIC_MEDUSA_BACKEND_URL=<YOUR_BACKEND_URL>
```

Where `<YOUR_BACKEND_URL>` is the URL of your deployed Medusa backend.

You’ll then be asked to log in if you haven’t already, and to choose the scope to deploy your project to. You can also decide to link the storefront to an existing project, or change the project’s name.

When asked `In which directory is your code located?`, keep the default `./` and just press Enter.

The project setup will then start. When asked if you want to modify the settings, answer `N` to keep the default settings.

It will take a couple of minutes for the deployment to finish. The link to the storefront will be shown in the final output of the command.

:::note

At this point, when you visit the storefront, you will face errors related to Cross-Origin Resource Sharing (CORS) while using the storefront. Before you start using the storefront, follow along the [Configure CORS on the Medusa Backend](#step-3-configure-cors-on-the-medusa-backend) section.

:::

---

## Step 3: Configure CORS on the Medusa Backend

To send requests to the Medusa backend from the Next.js storefront, you must set the `STORE_CORS` environment variable on your backend to the Next.js storefront’s URL.

:::tip

If you want to set a custom domain to your Next.js storefront website on Vercel, make sure to do it before this step. You can refer to this guide on [Vercel’s documentation](https://vercel.com/docs/concepts/projects/domains/add-a-domain).

:::

On your Medusa backend, add the following environment variable:

```bash
STORE_CORS=<STOREFRONT_URL>
```

Where `<STOREFRONT_URL>` is the URL of your Next.js storefront that you just deployed.

Then, restart your Medusa backend. Once the backend is running again, you can use your Next.js storefront.
