// This sandbox's outbound network to api.easypost.com is documented (see
// Task 1's report) as intermittently flaky over IPv6 -- `api.easypost.com`
// resolves to both an IPv4 and an IPv6 address, the IPv6 address has no
// route at all from this sandbox (ENETUNREACH), and Node's default "happy
// eyeballs" dual-stack connect behavior (`net.setDefaultAutoSelectFamily`,
// on by default since Node 18.13) races both addresses rather than simply
// preferring IPv4 first, which was empirically found (while investigating
// Task 5's "buy twice" behavior) to make every real-API call in this
// environment fail with ETIMEDOUT/ENETUNREACH, even though a raw IPv4-only
// connection succeeds immediately. Forcing IPv4-only resolution and
// disabling the dual-stack race fixes this reliably in this sandbox.
const dns = require("dns")
const net = require("net")

dns.setDefaultResultOrder("ipv4first")
if (typeof net.setDefaultAutoSelectFamily === "function") {
  net.setDefaultAutoSelectFamily(false)
}
