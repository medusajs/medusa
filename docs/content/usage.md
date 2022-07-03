# Collected Usage Information

This document gives an overview of Medusa’s optional collected usage information, how it helps Medusa become a better platform, and how developers can opt out of this feature.

## Overview

At Medusa, we strive to provide the best experience for developers using our platform. For that reason, Medusa collects anonymous and non-sensitive data that provides a global understanding of how users are using Medusa on a live server.

## Purpose

As an open source solution, we work closely and constantly interact with our community to ensure that we provide the best experience for everyone using Medusa. 

We are capable of getting a general understanding of how developers use Medusa and what general issues they run into through different means such as our Discord server, GitHub issues and discussions, and occasional one-on-one sessions.

However, although these methods can be insightful, they’re not enough to get a full and global understanding of how developers are using Medusa, especially in production.

Collecting this data allows us to understand certain details such as:

- What operating system do most Medusa developers use?
- What version of Medusa is widely used?
- What Node version is globally used? Should we focus our efforts on providing support for versions that we don’t currently support?

## Collected Data

The following data is being collected on your server:

- Unique project ID generated with UUID.
- Unique machine ID generated with UUID.
- Operating system information including Node version or operating system platform used.
- The version of the Medusa server and Medusa CLI used.

:::info

Data is only collected when the server is run with the command `medusa start`.

:::

## How to Opt-Out

If you prefer to disable data collection, you can do it either by setting the following environment variable to true:

```bash
MEDUSA_DISABLE_TELEMETRY=true
```

Or, you can run the following command in the root of your Medusa server project to disable it:

```bash
medusa telemetry --disable
```
