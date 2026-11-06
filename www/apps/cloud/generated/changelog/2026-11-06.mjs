/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-06",
  title: "Vault secrets for environment variables",
  summary:
    "Backend environment variables can be linked to Vault secrets, moved into Vault, and revealed or exported after a confirmation prompt.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1793950574/Cloud%20Changelog/november-6-2026-5c91c7.png",
  content: `- You can now link a new backend environment variable to an existing Vault secret from the lock button in its value field. Linked variables show a lock icon in the environment variables table. Refer to [Link Environment Variables to Vault Secrets](/environments/environment-variables#link-environment-variables-to-vault-secrets) for more details.
- Sensitive backend environment variables have a new **Move to Vault** action that moves the variable's value into a new Vault secret and links the variable to it. Refer to [Move an Existing Variable to Vault](/environments/environment-variables#move-an-existing-variable-to-vault) for more details.
- The edit side window of a variable linked to a Vault secret shows the secret's identifier and version with an **Open in Vault** link instead of the value field, and the **Sensitive** toggle stays enabled. Refer to [Edit a Variable Linked to a Vault Secret](/environments/environment-variables#edit-a-variable-linked-to-a-vault-secret) for more details.
- Revealing a secret variable's value now asks for confirmation first, and values of Vault-linked variables are retrieved from Vault. Refer to [Reveal Sensitive Environment Variables](/environments/environment-variables#reveal-sensitive-environment-variables) for more details.
- The **Export .env** button now includes the values of Vault-linked variables in the exported file after you confirm. Refer to [Export Environment Variables](/environments/environment-variables#export-environment-variables-on-cloud) for more details.`,
}
