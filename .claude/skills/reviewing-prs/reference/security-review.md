# Security Review Reference

Load this before Step 10. The inline checklist in `SKILL.md` names the
vulnerability classes; this file gives you the **mental model** for finding
them and Medusa-specific patterns that are easy to miss.

## The core heuristic: trace tainted input to a dangerous sink

Most real vulnerabilities are the same shape: **user-controlled input reaches
a sensitive operation without validation in between.** Don't scan for scary
function names — trace data flow.

1. **Identify the sources** the diff introduces or touches. Anything an
   external caller can influence is tainted: request bodies/params/query,
   headers, uploaded file names and contents, webhook payloads, entity fields
   that were set from any of the above, and values read back from the DB that
   originally came from a user.
2. **Identify the sinks** in the changed code: filesystem paths, **object
   storage keys / bucket paths**, URLs used in server-side fetches, SQL / query
   filters, shell commands, `eval`/`Function`, dynamic `require`/`import`,
   redirect targets, template rendering, response bodies, and logs.
3. **Check what happens between source and sink.** Is the input validated,
   allow-listed, normalized, length-capped, or escaped? If a tainted value
   flows into a sink untouched, that is your finding — regardless of how
   "normal" the surrounding code looks.

If you cannot tell from the diff whether a value is tainted, **read the
callers and the type definition** to see where it originates. A filename or key
that looks internal is often set directly from an upload request.

## Red flag: a diff that WIDENS what user input reaches a sink

The most commonly missed security bug is not new dangerous code — it is a
change that **removes an implicit protection**. Watch for:

- Code that previously used only a *sanitized fragment* of an input and now
  uses **more** of it. Example: parsing a filename and previously using only
  the base name + extension, then changing it to also prepend the parsed
  **directory** — that directory is attacker-controlled and can contain `..`
  or leading `/`.
- Removing a `replace(/[^a-z0-9]/…)`, a `path.basename()`, an allow-list
  check, a length cap, or an `encodeURIComponent`.
- Loosening a validator/regex, widening an accepted type, or making a
  previously-fixed value configurable from the request.
- Concatenating a new user-controlled segment into an existing path, key, URL,
  or identifier string.

When you see the diff route more of an input into a path/key/URL/query, stop
and ask: *"What is the worst string an attacker can put here, and where does it
end up?"* Then confirm the code rejects or neutralizes that string.

## Path / key traversal — filesystem AND object storage

Path traversal is **not limited to `fs.*` calls.** Any construction of a path,
key, or identifier from user input is in scope:

- **Filesystem:** `fs.readFile`, `fs.writeFile`, `createReadStream`,
  `path.join(base, userInput)`, static file serving.
- **Object storage keys** (S3, GCS, R2, etc.): the `Key` / object path passed
  to `PutObject`, `GetObject`, `Upload`, presigned-URL helpers. Cloud SDKs
  treat the key as an opaque string and will happily store `a/../../b`, so
  `..` and leading `/` segments let a caller **escape a configured prefix,
  cross a tenant/namespace boundary, or overwrite another object.**
- **Cache keys, URL paths, redirect targets, archive entry names** (zip-slip).

What to require in the fix:
- Reject or strip `..` segments and leading `/` (and their URL-encoded forms
  `%2e%2e`, `%2f`) **before** the value is used to build the path/key.
- Prefer deriving the safe part explicitly (e.g. `path.basename`, an
  allow-list of characters) over trying to blacklist bad sequences.
- Confirm a configured prefix / base directory actually **contains** the final
  resolved path — prefixing a string does not prevent `..` from climbing out
  of it.

Concrete pattern that MUST be flagged (this is the shape of a real miss):

```ts
// filename comes from the upload request (tainted)
const parsed = path.parse(file.filename)
const dir = parsed.dir ? `${parsed.dir}/` : ""
// prefix is meant to isolate this tenant's files
const key = `${config.prefix}${dir}${parsed.name}-${ulid()}${parsed.ext}`
// filename "../../other-tenant/logo.png" -> key climbs out of `prefix`
```

Finding: *path traversal in the storage key — a crafted `filename` containing
`..` escapes `config.prefix` and can write outside the intended
tenant/namespace. Fix: strip `..`/leading-`/` segments (or reject them) before
building the key.*

## Database injection — beyond raw SQL string concatenation

Raw SQL built from user input (`` `... WHERE id = '${req.params.id}'` ``) is the
obvious case, but Medusa uses MikroORM and the remote-query layer, which have
their own injection surfaces. Flag any of these when the value is tainted:

- **Raw MikroORM / Knex queries:** `em.execute(...)`, `knex.raw(...)`,
  `manager.getConnection().execute(...)`, or `.raw(...)` fragments built by
  string interpolation instead of bound parameters (`?` / named bindings).
- **Query-filter / operator injection:** passing `req.body`, `req.query`, or
  `req.filterableFields` **straight into** a service `.list*()`, repository, or
  `query.graph({ filters })` call without a validator. An attacker can inject
  operators (`$ne`, `$like`, `$or`, `$gt`, …) or filter on unintended columns
  to read rows they should not see, bypass a scope filter, or turn an equality
  check into a broad match. Medusa routes are expected to validate/whitelist
  the request schema (Zod / `validateAndTransformBody`) and pass only known
  fields into the filter object.
- **Dynamic column / order / table names** from user input (identifiers cannot
  be parameterized) — must be checked against an allow-list.
- **`$where` / JS-expression style filters** or anything that lets the caller
  supply an expression string.

Fix expectation: use bound parameters for values, an allow-list for
identifiers, and validate the request into a known shape before it reaches any
filter or query builder. Never interpolate a tainted value into a query string.

## Output encoding — unescaped JSON, HTML, and prototype pollution

This is the most commonly missed class. A value can be safe in the DB yet
dangerous when it is **serialized back out** without proper encoding:

- **Unescaped JSON embedded in HTML / a `<script>` context (XSS).** The classic
  bug is interpolating `JSON.stringify(data)` into an HTML string or inline
  script — e.g. `` `<script>window.__STATE__=${JSON.stringify(data)}</script>` ``
  or building an HTML email/template from user data. `JSON.stringify` does
  **not** escape HTML, so a value containing `</script>` (or `<!--`, `]]>`,
  U+2028/U+2029) breaks out of the script/tag and injects arbitrary markup.
  Fix: escape the dangerous characters (`<`, `>`, `&`, U+2028, U+2029) in the
  serialized string before embedding it, or pass the data via a `data-*`
  attribute / DOM API rather than string-concatenating it into HTML.
- **User input reflected into any HTML/markup response** (server-rendered pages,
  emails, invoices, SVGs, redirects with a reflected param) without escaping →
  XSS/HTML injection.
- **Building JSON by string concatenation** instead of `JSON.stringify` — a
  quote or brace in the value corrupts or injects into the document. Always
  serialize with `JSON.stringify`, never hand-assemble JSON.
- **`JSON.parse` on untrusted input without a guard** — wrap in try/catch (a
  malformed body should be a 400, not an unhandled throw), and when the parsed
  object is **merged/assigned** into another object (`Object.assign`, spread,
  deep-merge, `lodash.merge`), treat `__proto__` / `constructor` / `prototype`
  keys as **prototype-pollution** vectors — reject or use a null-prototype
  target.
- **`Content-Type` mismatch:** returning user-controlled text as `text/html`
  (or omitting the header so a browser sniffs it as HTML) when it should be
  `application/json` / `text/plain`.

## Authorization on data-scoped routes

For any new/changed route or workflow that reads or mutates data belonging to a
user, store, or customer:

- Is there an ownership/scope check, or does it trust an ID from the request?
- Is the auth/permission middleware actually applied to the new route?
- Can a lower-privileged actor reach an admin-only operation?

## Other classes (see SKILL.md Step 10 for the full list)

- **Code execution:** `eval`/`Function`, dynamic `require`/`import` with user
  paths, shell construction from user input.
- **SSRF:** user-controlled URLs in server-side `fetch`/HTTP calls without an
  allow-list.
- **DoS:** missing size/length/pagination limits on user input.
- **Data exposure:** secrets/PII/internal IDs in responses or logs, stack
  traces leaked to clients, hardcoded credentials.
- **Supply chain:** typosquat packages, `pre/postinstall` scripts,
  lockfile/manifest mismatch.

## Severity and phrasing

- Every confirmed OR plausible security issue is **blocking** — it belongs in
  `blocking_points` with `"requires-more"` in `labels_to_add`, never merely
  mentioned in `summary`.
- If you are not certain the input is reachable/tainted, still flag it as a
  question (*"Can `file.filename` contain `..`? If so this escapes the
  prefix…"*) and keep it blocking — the author must confirm or disprove.
- Use `close-malicious` only for deliberate attacks (backdoors, exfiltration),
  never for good-faith bugs like the traversal above — those are
  `needs-changes`.
- Phrase each finding as:
  *"`<file>:<location>`: `<vuln class>` — `<one-sentence attack scenario>`. Fix: `<concrete fix>`."*

## Step 10 Checklist

> **CRITICAL:** Applies to **all PRs**, including team members. Read the actual diff; before flagging, read the full file. Only flag issues in added (`+`) lines.

> **MUST load `reference/security-review.md` before this step.** It explains
> the trust-boundary / taint-tracing method and Medusa-specific patterns
> (object-storage key traversal, DB/query-filter injection, unescaped
> JSON/HTML output, the "widened input" red flag). The checklist below is a
> reminder, not a substitute.

**How to look, not just what to look for:** for the changed code, trace
**tainted input** (request bodies/params/headers, uploaded file names and
contents, webhook payloads, and any entity field set from them) to a
**sensitive sink** (path/key construction, URL fetch, SQL/query filter, shell,
`eval`, response, log). A finding is: tainted value reaches a sink without
validation in between. Read callers/types when you can't tell if a value is
tainted — a "filename" or "key" is frequently set straight from an upload
request.

**Highest-value red flag — a diff that WIDENS what user input reaches a sink.**
The most-missed security bug is not new dangerous code but the *removal of an
implicit protection*: code that used to use only a sanitized fragment of an
input now uses more of it (e.g. it kept only a filename's base name and now
also prepends the parsed **directory**), or a `basename`/allow-list/regex/cap/
`encodeURIComponent` is dropped, or a fixed value becomes request-configurable.
When the diff routes more of an input into a path/key/URL/query, ask *"what is
the worst string an attacker can put here, and where does it end up?"*

Check for:

**Authentication & Authorization:**
- Missing or bypassed authentication middleware on new routes
- Authorization checks missing — any route that accesses or mutates data scoped to a user/store must verify ownership
- Privilege escalation

**Database injection (not just raw SQL):**
- Raw SQL / MikroORM / Knex from user input — string-interpolated `em.execute()`,
  `knex.raw()`, `.raw()` fragments instead of bound parameters
- **Query-filter / operator injection** — `req.body` / `req.query` /
  `req.filterableFields` passed straight into a service `.list*()`, repository,
  or `query.graph({ filters })` without a validator, letting a caller inject
  operators (`$ne`, `$or`, `$like`, …) or filter on unintended columns to read
  or bypass scoped data. Routes must validate/whitelist the request (Zod /
  `validateAndTransformBody`) and pass only known fields into the filter.
- Dynamic column / order / table names from user input without an allow-list

**Other injection & execution:**
- `eval()`, `new Function()`, `vm.runInContext()` with untrusted data
- Dynamic `require()`/`import()` with user-controlled paths
- Shell command construction with user input

**Output encoding — unescaped JSON / HTML (commonly missed):**
- **Unescaped JSON in an HTML/`<script>` context (XSS)** — interpolating
  `JSON.stringify(data)` into an HTML string or inline script. `JSON.stringify`
  does NOT escape HTML, so a value with `</script>` (or `<!--`, U+2028/U+2029)
  breaks out and injects markup. Escape `<`/`>`/`&`/line separators, or use a
  `data-*`/DOM API instead of string concatenation.
- User input reflected into any HTML/markup response (pages, emails, invoices,
  SVGs, redirect params) without escaping → XSS/HTML injection
- Hand-built JSON via string concatenation instead of `JSON.stringify`
- `JSON.parse` on untrusted input without try/catch; parsed objects merged via
  `Object.assign`/spread/deep-merge without guarding `__proto__` →
  prototype pollution
- Returning user-controlled text as `text/html` (or a sniffable missing
  `Content-Type`) when it should be `application/json`/`text/plain`

**Path / key traversal (NOT just `fs.*`):**
- User-controlled input built into a **filesystem path** without sanitization
- User-controlled input built into an **object-storage key / bucket path**
  (S3/GCS/R2 `Key`, `Upload`, presigned URLs) — cloud SDKs treat the key as an
  opaque string, so `..` or a leading `/` in a filename can **escape a
  configured prefix and cross a tenant/namespace boundary or overwrite another
  object.** Prefixing a string does NOT stop `..` from climbing out of it.
- `..` / leading `/` (and encoded forms `%2e%2e`, `%2f`) reaching a cache key,
  URL path, redirect target, or archive entry name (zip-slip)
- Fix expectation: strip/reject `..` and leading `/` (or derive the safe part
  via `path.basename`/an allow-list) **before** building the path/key

**Other input validation:**
- Missing size/length/pagination limits → DoS
- Unvalidated external URLs in server-side fetches → SSRF

**Data Exposure:**
- Sensitive fields (passwords, secrets, internal IDs, PII) in responses or logs
- Error messages leaking internal stack traces, SQL, or file paths
- Hardcoded credentials, API keys, or secrets

**Dependencies & Supply Chain:**
- New packages in `package.json` — verify they're well-known, not typosquats
- Unusual `scripts` entries (e.g., `postinstall`, `preinstall`)
- Lock file changes inconsistent with `package.json`

**Medusa-specific (check on every route, workflow, and service change):**
- **Store routes without an `allowed` list:** a store route that returns
  data must set `allowed` in its `query-config.ts` (built with
  `buildAllowedFields()` / `prefixAllowedFields()`) and pass it to
  `validateAndTransformQuery()`. Without it, any client can read any field
  or relation through `?fields=`.
- **Missing auth or ownership:** new admin routes need `authenticate("user", …)`,
  customer routes `authenticate("customer", …)`, and anything scoped to a
  customer must filter by `req.auth_context.actor_id`, not an ID from the
  request.
- **Unvalidated bodies and queries:** a new route without
  `validateAndTransformBody()` / `validateAndTransformQuery()` and a Zod
  schema in `middlewares.ts`, or one that reads `req.body` instead of
  `req.validatedBody`.
- **Sales-channel scoping:** store routes that list products, prices, or
  inventory must respect the publishable key's sales channels
  (`req.publishable_key_context`).

**Malicious code:** If clearly malicious code is found, emit
`review_template: "close-malicious"` with `labels_to_add: ["requires-team"]`, `labels_to_remove: ["initial-approval"]`, and `blocking_points` entries that name each file/line and the suspected attack pattern. The downstream step will close the PR. Use this only when the change is clearly an attempt to compromise the project (see the schema description for examples) — for ordinary security issues found in good-faith contributions, use `needs-changes` instead.

Report each security issue as a `[Security]` blocking point (see
**Report Format**): name the vulnerability class and the concrete attack in
the first line, quote the vulnerable lines, give the fix.

Security issues are always **blocking** — include `"requires-more"` in
`labels_to_add` even if everything else looks good.

## Common Mistakes

- [ ] Running Step 10 without loading `reference/security-review.md`
- [ ] Treating path traversal as a filesystem-only issue — object-storage keys, cache keys, and URL paths are equally vulnerable to `..` / leading `/`
- [ ] Missing a change that widens what user input reaches a path/key/URL (e.g. a filename's directory now prepended to a storage key) — trace the tainted value to its sink
- [ ] Assuming a configured prefix/base dir contains the final path — it does not stop `..` from climbing out
- [ ] Treating DB injection as raw-SQL-only — unvalidated `req.body`/`req.query` passed into a service `.list*()`/repository/`query.graph({ filters })` allows operator injection and reading unscoped data
- [ ] Missing unescaped JSON/HTML — `JSON.stringify(userData)` interpolated into an HTML/`<script>` context is XSS; user input reflected into any markup response must be escaped
- [ ] Overlooking prototype pollution — a parsed JSON body merged via `Object.assign`/spread/deep-merge without guarding `__proto__`
