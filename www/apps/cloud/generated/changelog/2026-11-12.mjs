/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-12",
  title: "Confirmed reveal of secret environment variables",
  summary: "Revealing or exporting sensitive environment variables now requires confirmation, and editing a secret no longer requires re-entering its value.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1794478233/Cloud%20Changelog/november-12-2026-daeba7.png",
  content: `- Revealing a sensitive environment variable's value in the environment variables table now asks you to confirm first, and each reveal is logged. Previously, clicking the eye icon showed the value immediately. Refer to [Manage Environment Variables](/environments/environment-variables#view-secret-environment-variable-values) for more details.
- When editing a sensitive environment variable, you can leave the value field empty to keep its current value, so you can change its key or settings without re-entering the secret. Refer to [Manage Environment Variables](/environments/environment-variables#edit-environment-variables-on-cloud) for more details.
- The **Export .env** button now asks you to confirm revealing all sensitive variables at once, then includes their actual values in the exported file. Refer to [Manage Environment Variables](/environments/environment-variables#export-environment-variables-on-cloud) for more details.`,
}
