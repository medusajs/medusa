---
description: 'Learn step-by-step.'
addHowToData: true
---

# Deploy Admin to Vercel

In this document, you’ll learn how to deploy the admin dashboard to Vercel.

## Prerequisites

### Medusa Components

You must have a [Medusa backend](../../development/backend/install.mdx) installed along with an [admin dashboard plugin](../../admin/quickstart.mdx).

### Required Accounts

- [Vercel Account](https://vercel.com/)
- [GitHub Account](https://github.com/): Only required if you’re deploying through the Vercel website.

:::note

If you want to use another Git Provider, it’s possible to follow along with this guide, but you’ll have to perform the equivalent steps in your Git Provider.

:::

### Required Tools

- [Git CLI](../../development/backend/prepare-environment.mdx#git): Only required if you’re deploying through the Vercel website.

---

## Step 1: Create GitHub Repository

:::note

This step is only required if you’re deploying from the Vercel website. However, it’s highly recommended to connect your Vercel project to a Git repository for a better developer experience.

:::

Before you can deploy your admin dashboard, you need to create a GitHub repository and push the code base to it. To do that:

1. On GitHub, click the plus icon at the top right, then click New Repository.
2. You’ll then be redirected to a new page with a form. In the form, enter the Repository Name.
3. Scroll down and click Create repository.

### Push Code to GitHub Repository

The next step is to push the code to the GitHub repository you just created.

After creating the repository, you’ll be redirected to the repository’s page. On that page, you should see a URL that you can copy to connect your repository to a local directory.

Copy the link. Then, open your terminal in the directory that holds your Medusa backend codebase and run the following commands:

```bash
git init
git remote add origin <GITHUB_URL>
```

Where `<GITHUB_URL>` is the URL you just copied.

Then, add, commit, and push the changes into the repository:

```bash
git add .
git commit -m "initial commit"
git push
```

After pushing the changes, you can find the files in your GitHub repository.

---

## Step 2: Configure Build Script

In the `package.json` of the Medusa backend, add or change a build script for the admin:

```json
"scripts": {
  // other scripts
  "build:admin": "medusa-admin build --deployment",
}
```

### Additional Build Options

Aside from `--deployment`, you can use the following options when building your admin for deployment:

- `--backend` or `-b`: a string specifying the URL of the Medusa backend. The default here is the value of the environment variable `MEDUSA_BACKEND_URL`. If this options is added, the value you set for `MEDUSA_BACKEND_URL` in Vercel will no longer have an effect. For example, `medusa-admin build --deployment --backend example.com`
- `--out-dir` or `-o`: a string specifying a custom path to output the build files to. By default, it will be the `build` directory. For example, `medusa-admin --deployment --out-dir public`.
- `--include` or `-i`: a list of strings of paths to files you want to include in the build output. It can be useful if you want to inject files that are relevant to your hosting. For example, `medusa-admin --deployment --include 200.html`
- `--include-dist` or `-d`: a string specifying the path to copy the files specified in `--include` to. By default, the files are coopied to the root of the build directory. You can use this option to change that. For example, `medusa-admin --deployment --include 200.html --include-dist static`.

---

## Step 3: Add Vercel Configurations

In the root directory of the Medusa backend, create a new file `vercel.json` with the following content:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Step 4: Push Changes to GitHub

After making all the previous changes, push them to GitHub before starting the deployment on Vercel:

```bash
git add .
git commit -m "prepare repository for deployment"
git push
```

---

## Step 5: Deploy to Vercel

This section covers how to deploy the admin, either using the Vercel website or using Vercel’s CLI tool.

### Option 1: Using the Vercel Website

This section explains how to deploy the admin using the Vercel website:

1. Open the [Vercel dashboard](https://vercel.com/dashboard) after logging in.
2. Click on the “Add New…” button next to the search bar.
3. Choose Project from the dropdown.
4. In the new page that opens, find the Git repository that holds your medusa backend and click on the Import button. If you haven’t connected your Vercel account to any Git provider, you must do that first.
5. In the Configure Project form:
    1. Set the Framework Preset to Vite.
    2. Open the Build and Output Settings collapsible, and set the Build Command to `yarn build:admin` and the Output Directory to `build`. If you’ve configured the admin to use a different output directory, then change it to that directory.
    3. Open the Environment Variables collapsible, and add an environment variable with the name `MEDUSA_BACKEND_URL` with the value being the URL to your deployed Medusa backend.
    4. You can optionally edit the Project Name.
6. Once you’re done, click on the “Deploy” button.

This will start the deployment of the admin. Once it’s done, you’ll be redirected to the main dashboard of your new project.

:::note

At this point, when you visit the admin, you will face errors related to Cross-Origin Resource Sharing (CORS) while using the admin. Before you start using the admin, follow along the [Configure CORS on the Medusa Backend](#step-6-configure-cors-on-the-medusa-backend) section.

:::

### Option 2: Using Vercel’s CLI Tool

This section explains how to deploy the admin using the Vercel CLI tool. You should have the CLI tool installed first, as explained in [Vercel’s documentation](https://vercel.com/docs/cli).

In the directory of your Medusa backend, run the following command to deploy your admin:

```bash
vercel --build-env MEDUSA_BACKEND_URL=<YOUR_BACKEND_URL>
```

Where `<YOUR_BACKEND_URL>` is the URL of your deployed Medusa backend.

You’ll then be asked to log in if you haven’t already, and to choose the scope to deploy your project to. You can also decide to link the admin to an existing project, or change the project’s name.

When asked, ”In which directory is your code located?”, keep the default `./` and just press Enter.

The project setup will then start. When asked if you want to modify the settings, answer `y`. You’ll then be asked a series of questions:

1. “Which settings would you like to overwrite”: select Build Command and Output Directory using the space bar, then press Enter.
2. “What's your **Build Command**?”: enter `yarn build:admin`.
3. “What's your **Output Directory**?”: enter `build`.

After that, it will take a couple of minutes for the deployment to finish. The link to the admin will be shown in the final output of the command.

:::note

At this point, when you visit the admin, you will face errors related to Cross-Origin Resource Sharing (CORS) while using the admin. Before you start using the admin, follow along the [Configure CORS on the Medusa Backend](#step-6-configure-cors-on-the-medusa-backend) section.

:::

---

## Step 6: Configure CORS on the Medusa Backend

To send requests to the Medusa backend from the admin dashboard, you must set the `ADMIN_CORS` environment variable on your backend to the admin’s URL.

:::note

If you want to set a custom domain to your admin dashboard on Vercel, make sure to do it before this step. You can refer to this guide on [Vercel’s documentation](https://vercel.com/docs/concepts/projects/domains/add-a-domain).

:::

On your Medusa backend, add the following environment variable:

```bash
ADMIN_CORS=<ADMIN_URL>
```

Where `<ADMIN_URL>` is the URL of your admin dashboard that you just deployed.

Then, restart your Medusa backend. Once the backend is running again, you can use your admin dashboard.
