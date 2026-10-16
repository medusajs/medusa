/**
 * Maps each carrier string a real EasyPost `Rate` object can return (the
 * `rate.carrier` field) to this provider's own display names for the
 * service-level strings that same rate's `service` field uses.
 *
 * Confirmed against this project's real test-mode EasyPost account (Task 2,
 * Step 1) by calling `EasyPostClient.createShipment()` with a representative
 * domestic US shipment and reading the raw `rates[]` it returned -- not
 * guessed. The test-mode account only has USPS and EasyPost's default test
 * FedEx carrier account ("FedExDefault") enabled, and quoted exactly these
 * 11 carrier+service combinations (confirmed stable across repeated calls):
 *
 * - USPS: Priority, GroundAdvantage, Express
 * - FedExDefault: FIRST_OVERNIGHT, PRIORITY_OVERNIGHT, STANDARD_OVERNIGHT,
 *   FEDEX_GROUND, FEDEX_2_DAY_AM, FEDEX_2_DAY, SMART_POST,
 *   FEDEX_EXPRESS_SAVER
 *
 * Notably, EasyPost's real USPS service string is `"GroundAdvantage"`, not
 * `"First"` as an earlier draft of this plan guessed, and the real FedEx
 * carrier string is `"FedExDefault"` (EasyPost's own default test-mode
 * carrier account name), not plain `"FedEx"`. No UPS account exists on this
 * test-mode account, so UPS is intentionally left out of this map until a
 * later confirmation shows real UPS carrier/service strings.
 *
 * A carrier returned by a rate but not present here is an expected,
 * non-fatal case (see `getFulfillmentOptions` in `../services/easypost-fulfillment`)
 * -- it's simply not yet modeled as a selectable fulfillment option.
 */
export const CARRIER_SERVICE_MAP: Record<
  string,
  { code: string; name: string }[]
> = {
  USPS: [
    { code: "GroundAdvantage", name: "USPS Ground Advantage" },
    { code: "Priority", name: "USPS Priority" },
    { code: "Express", name: "USPS Express" },
  ],
  FedExDefault: [
    { code: "FEDEX_GROUND", name: "FedEx Ground" },
    { code: "FEDEX_EXPRESS_SAVER", name: "FedEx Express Saver" },
    { code: "FEDEX_2_DAY", name: "FedEx 2Day" },
    { code: "FEDEX_2_DAY_AM", name: "FedEx 2Day A.M." },
    { code: "STANDARD_OVERNIGHT", name: "FedEx Standard Overnight" },
    { code: "PRIORITY_OVERNIGHT", name: "FedEx Priority Overnight" },
    { code: "FIRST_OVERNIGHT", name: "FedEx First Overnight" },
    { code: "SMART_POST", name: "FedEx SmartPost" },
  ],
}
