/**
 * Static value options for rule attributes whose values are a fixed
 * enumeration rather than rows queried from a module (e.g. a boolean flag or a
 * day of the week). The rule-value-options endpoint returns these directly,
 * which both fixes the 500 it would otherwise throw (no query configuration)
 * and lets the dashboard render a proper value picker.
 *
 * Keyed by the rule attribute `id` (which equals the attribute `value` for
 * these attributes).
 */
export const ruleValueStaticOptions: Record<
  string,
  { label: string; value: string }[]
> = {
  is_logged_in: [
    { label: "Yes (logged in)", value: "true" },
    { label: "No (guest)", value: "false" },
  ],
  current_day_of_week: [
    { label: "Monday", value: "1" },
    { label: "Tuesday", value: "2" },
    { label: "Wednesday", value: "3" },
    { label: "Thursday", value: "4" },
    { label: "Friday", value: "5" },
    { label: "Saturday", value: "6" },
    { label: "Sunday", value: "0" },
  ],
}
