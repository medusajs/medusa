# Usage Information

<!-- vale docs.We = NO -->
<!-- vale docs.FirstPerson = NO -->

This document gives an overview of Medusa’s optional collected usage information, how it helps Medusa become a better platform, and how developers can opt-out of this feature.

## Overview

At Medusa, we strive to provide the best experience for developers using our platform. For that reason, Medusa collects anonymous and non-sensitive data that provides a global understanding of how users are using Medusa.

---

## Purpose

As an open source solution, we work closely and constantly interact with our community to ensure that we provide the best experience for everyone using Medusa. 

We are capable of getting a general understanding of how developers use Medusa and what general issues they run into through different means such as our Discord backend, GitHub issues and discussions, and occasional one-on-one sessions.

However, although these methods can be insightful, they’re not enough to get a full and global understanding of how developers are using Medusa, especially in production.

Collecting this data allows us to understand certain details such as:

- What operating system do most Medusa developers use?
- What version of Medusa is widely used?
- What parts of the Medusa Admin are generally undiscovered by our users?
- How much data do users manage through our Medusa Admin? Is it being used for large number of products, orders, and other types of data?
- What Node version is globally used? Should we focus our efforts on providing support for versions that we don’t currently support?

---

## Backend Analytics

This section covers which data in the backend are collected and how to opt out of it.

### Collected Data in the Backend

The following data is being collected on your backend:

- Unique project ID generated with UUID.
- Unique machine ID generated with UUID.
- Operating system information including Node version or operating system platform used.
- The version of the Medusa backend and Medusa CLI are used.

:::info

💡 Data is only collected when the backend is run with the command `medusa start`.

:::

### How to Opt Out

If you prefer to disable data collection, you can do it either by setting the following environment variable to true:

```bash
MEDUSA_DISABLE_TELEMETRY=true
```

Or, you can run the following command in the root of your Medusa backend project to disable it:

```bash
medusa telemetry --disable
```

---

## Admin Analytics

This section covers which data in the admin are collected and how to opt out of it.

### Collected Data in Admin

:::info

Users have the option to [enable or disable the anonymization](#how-to-enable-anonymization) of the collected data.

:::

The following data is being collected on your admin:

- The name of the store.
- The email of the user.
- The total number of products, orders, discounts, and users.
- The number of regions and their names.
- The currencies used in the store.
- Errors that occur while using the admin.

### How to Enable Anonymization

To enable anonymization of your data from the Medusa admin:

1. Go to Settings → Personal Information.
2. In the Usage insights section, click on the “Edit preferences” button.
3. Enable the "Anonymize my usage data” toggle.
4. Click on the “Submit and close” button.

### How to Opt-Out

There are two ways to opt out of analytics collected in the Medusa admin:

1. Disable the feature flag that is enabled by default for the admin analytics feature:

```bash
MEDUSA_FF_ANALYTICS=false
```

2\. Alternatively, on your Medusa admin, you can disable tracking by following these steps:

  1. Go to Settings → Personal Information.
  2. In the Usage insights section, click on the “Edit preferences” button.
  3. Enable the “Opt out of sharing my usage data” toggle.
  4. Click on the “Submit and close” button.

<!-- vale docs.We = YES -->
<!-- vale docs.FirstPerson = YES -->
