---
sidebar_position: 1
description: 'This user guide explains how to manage the store details on the Medusa admin.'
---

# Manage Store Details

In this document, you’ll learn how to edit the store’s details.

## Edit Store Details

To edit the store’s details:

1. Go to Settings → Store Details
2. In the Store Details form:
    1. You can change the store’s name.
    2. You can set the template link for swaps, draft orders, and invites. When making a change to the link template, make sure to use the following placeholders within the link:
        1. **Swaps**: Use the `{swap_id}` placeholder to indicate where the ID of the swap should be in the link.
        2. **Draft Order**: Use the `{payment_id}` placeholder to indicate where the ID of the payment should be in the link.
        3. **Invites:** Use the `{invite_token}` placeholder to indicate where the invite token should be in the link.
3. Once done, click on the Save button.
