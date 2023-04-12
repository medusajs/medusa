---
description: 'Learn step-by-step.'
addHowToData: true
---

# Deploy Your Medusa Backend on Microtica

In this document, you'll learn how to deploy your Medusa backend on your AWS account with Microtica. 

## Overview

[Microtica](https://microtica.com) is a cloud-native delivery platform that enables you to deploy infrastructure and applications to your AWS account, while providing actionable insights to help you optimize resources, performance, & costs. 

Alternatively, you can use this button to deploy the Medusa backend to Microtica directly:

<a href="https://app.microtica.com/templates/new?template=https%3A%2F%2Fraw.githubusercontent.com%2Fmicrotica%2Ftemplates%2Fmaster%2Fmedusa-server%2F.microtica%2Ftemplate.yaml&utm_source=medusa&utm_medium=docs&utm_campaign=medusa" className="img-url">
  <img src="https://microtica.s3.eu-central-1.amazonaws.com/assets/templates/logos/deploy-with-microtica.svg" alt="Deploy with Microtica" className="no-zoom-img" />
</a>

:::note

The Medusa infrastructure will be provisioned on your own AWS account.
You retain full control over your infrastructure and data while getting all the benefits of infrastructure automation.

:::

## Prerequisites

### Medusa Backend

It is assumed that you already have a Medusa backend installed locally. If you don’t, please follow the [quickstart guide](../../development/backend/install.mdx).

Furthermore, your Medusa backend should be configured to work with PostgreSQL and Redis. You can follow the [Configure your Backend documentation](../../development/backend/configurations.md) to learn how to do that.

### Needed Accounts

- A [Microtica](https://app.microtica.com/) account. Microtica provides a free plan that you can use.
- An [AWS](https://aws.amazon.com/) account that you’ll connect to Microtica to provision the infrastructure.
- A [GitHub](https://github.com/) account to create a repository to host your backend's codebase.

### Required Tools

- Git’s CLI tool. You can follow [this documentation to learn how to install it for your operating system](../../development/backend/prepare-environment.mdx#git).

---

## What will be provisioned on AWS

Since Microtica deploys on your cloud account, here are the resources that the platform is going to provision in the environment.

- VPC, subnets and networking
- Container infrastructure based on Fargate 
- application load balancer
- persistent storage
- S3 bucket
- Postgres database 
- and Redis (in production mode)

---


## Deploy to Microtica

### Step 1: Create/Import a Git repository

Before you can deploy your Medusa backend you need to connect your preferred Git account. Microtica will create a repository on your Git account with a default repo name `medusa-server`. 

![Create Git Repository](https://global-uploads.webflow.com/62b04b3a715c202b5fa1408b/639727f93aa39723e1e5667f_RVoeExwARHAsVe3lq7oBZqYJ9nMP9x3EjX81evL3UgLZ_jXYeHk9mEBFJ760tQZvESp__mGaRKY6Nsd_NqELSzpNv3mWoqmfmJhosNlCLU94s3vhYKIhdo-T8sPvmtXZ2s6qPkkYdlHJ_2IWgDOvUn0uZzEnEl6beU65M5cmui2DZ8mkVi2wCquRBNIX.png)

If you already have a Medusa backend repository that you want to deploy then you need to perform a couple of changes in your source code. Follow [this tutorial to deploy and existing Medusa Backend app](https://docs.microtica.com/medusa-server?utm_source=medusa&utm_medium=docs&utm_campaign=medusa#xUBRz).

### Step 2: Configure the Template

The second step provides customization posibilities by configuring environment variables.

Add an application name and the admin credentials that will be used to create an initial admin user with which you can later sign in to your Medusa Admin. 

Then, choose whether you want a production Medusa Backend environment or a development one. The production template will provision your managed RDS PostgreSQL and Redis instances. On the other hand, the development template will use a local SQLite and a fake Redis instance.

![Configure Template](https://global-uploads.webflow.com/62b04b3a715c202b5fa1408b/639727f9d62c7658915a3788_ERA-ETfPfTiCQ8wDPQZX6IxCZiDhX9GIj-jNTxIUfh6AKdC0BjdVKmuJbaaUlzQeITZWW00Ro1vFZj2R_arYBqD1AbWwlygPwzMOlwYGXby9ZtZ4pfI1A7jZ-oI4fmWHA3VmXtB1QR8NERVxEsT9R1zPQujSTIaWtQUs4gMAM6rVvA6iOfQZR7Qx1NcY.png)

### Step 3: Connect an AWS account 

In the last step before deployment, select the environment in which you want to deploy the template. An existing default environment called `development` will be preselected here, or you can create a new environment.  

Then, connect your AWS account when prompted. This process takes only a few seconds, so afterward only choose the region you want to deploy in. 

![Connect AWS account](https://global-uploads.webflow.com/62b04b3a715c202b5fa1408b/639727f98144a7eb845dabee_GYZFu6wD5huAf6H5sCs4qpz09wQOaI2IMThsEd0CwR4PePc1ryF4mAlb4YkTZdIkX3Mnh_OzEr9bdm2r1_5GkYHHlFgHksP_hDj7DmlnitZmWaotj5th3R4wHK6gJzhIDmjfXeCk30YdK1kaeGH41JRCyteVH9y3YqzIyGz8xQlcDYKCoWVxDey47mPw.png)

### Step 4: Deploy to AWS

Finally, a deployment summary of what will be provisioned on your AWS account is presented. Click on the "Deploy" button to trigger a deployment of the template and start creating the infrastructure for a Medusa backend.

![Deployment Summary](https://global-uploads.webflow.com/62b04b3a715c202b5fa1408b/639727f932d1b32052287126_h96ejVytOhLLEUCeIWbQu-OG4oxJQqj5z9ZJXjH5EboT5gnw6s61hl2mvHcUaGQUyJMQtNdyb4hdFWDvYlFBa8wznkBus7nkXR_0JAIRvN5QDdZP6WCDNSzYeBSJcoV-ifDdUHzJODF_Oxv6mgIsHtpj92PA6VgQsaYM0n_xyzV-lhalH6kdR-tku2hb.png)

It will take around ten minutes for the solution to be deployed on your cloud account.

You can follow the build pipeline in real-time by clicking the "View Logs" button. 

![Building Resources](https://global-uploads.webflow.com/62b04b3a715c202b5fa1408b/639727f9a465c27cf7090e5f_gxwdXAAmUxHsSyJlgScHuu4m7GiFTNnwW-OZoAhDC8v-Ez3KmsK-OCKfF2Qe2JUtxMyih7jCA7n-hAZnx0fdFjv-TWyDuoAUvftSRE9hqmPB1gVhG6lH0IhXqbliou1VnAVDvlCtHobzlUrrDhnCmzob9PfdNGrzlhwsL60QsAXJm1gIPE27J6P_Y2Y3.png)

Once the build process is complete, a new deployment with the infrastructure resources is triggered. You can follow the logs of the deployment process by clicking the "View deployment" button, and then selecting the deployment from the list. 

![Deployment Logs](https://global-uploads.webflow.com/62b04b3a715c202b5fa1408b/639727f93aa3974438e56689_vF-4U1L5B_sQQJdrjaE_bdlN2hdTsOcn5eWVRfgzF1UqNAuWAqN2zh9ttWp6SW2jjCqPUNLpRsL4j01FR5emAMcJqCbfwbaBv3Np49JH6hpggYm3rmY-xYCOg8H0dooKnC4x_sTD-JreveLzUxBMxQI3M0gCm-8B2YJ5eJj7dU8mf8qlSTYmnpnExIvB.png)

---

## Preview the environment

After the deployment is finished, navigate to Resources → [AppName] (Medusa in this example) → Overview. Then, under the Resource Outputs section you should see the AccessUrl. This is the backend's URL that you can use to access API endpoints. You can try getting the list of products using the endpoint `/store/products`.

---

## Add Environment Variables

The environment variables can be updated, added, or configured after deployment as well. You can access them with `process.env.<VARIABLE NAME>`.

You can read more about the built-in environment variables, as well as how to specify custom environment variables in the Medusa backend runtime [in Microtica documentation](https://docs.microtica.com/medusa-server?utm_source=medusa&utm_medium=docs&utm_campaign=medusa#z8li6). 

---

## Updating your Deployed Backend

Any updates to the backend (e.g. updating the Medusa core version) are deployed automatically when changes are committed to the repository. Microtica will handle the entire process of building and deploying your application on your connected AWS account.



