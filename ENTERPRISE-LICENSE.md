# Medusa Enterprise Edition License

Copyright (c) MedusaJS, Inc. All rights reserved.

## Commercial license required

The Enterprise Edition materials identified below (the "Enterprise
Materials") are proprietary software. They are not licensed under the MIT
License that applies to the remainder of this repository.

You may use, reproduce, modify, distribute, or otherwise exploit the
Enterprise Materials only under a separate, valid commercial agreement with
MedusaJS, Inc. that expressly grants those rights. Possession of or access to
the source code does not grant a license. If you do not have such an
agreement, no rights are granted except those that cannot lawfully be
restricted.

The terms of an applicable commercial agreement control if they conflict with
this notice. To obtain a commercial license, contact MedusaJS, Inc. at
https://medusajs.com/contact.

This notice applies prospectively and does not withdraw rights already granted
for earlier versions of any material under the MIT License. Those earlier
versions remain available under their original license terms.

## Unlicensed use and reservation of rights

Any use, reproduction, modification, or distribution of the Enterprise
Materials without a valid commercial agreement is unlicensed and constitutes
an infringement of MedusaJS, Inc.'s copyright. Circumventing, disabling, or
removing any license validation or feature-gating mechanism does not create a
license and is itself a violation of this notice. Enabling any Enterprise
feature flag constitutes a representation that you hold a valid commercial
agreement with MedusaJS, Inc.

MedusaJS, Inc. reserves all rights and remedies available at law and in
equity, including injunctive relief, monetary damages, and recovery of costs
and attorneys' fees where available.

## Enterprise Materials

RBAC (role-based access control) and SSO (single sign-on) are Medusa Enterprise Edition features. The following repository paths, including all files below a listed directory, are Enterprise Materials:

### RBAC module and backend behavior

- `packages/modules/rbac/`
- `packages/core/core-flows/src/rbac/`
- `packages/medusa/src/api/admin/rbac/`
- `packages/core/types/src/rbac/`
- `packages/core/types/src/http/rbac/`
- `packages/core/framework/src/policies/`
- `packages/core/framework/src/http/middlewares/check-permissions.ts`
- `packages/core/framework/src/http/utils/policies/rbac-field-filter.ts`
- `packages/core/utils/src/modules-sdk/define-policies.ts`
- `packages/core/utils/src/modules-sdk/policy-to-types.ts`
- `packages/medusa/src/feature-flags/rbac.ts`
- `packages/medusa/src/feature-flags/rbac-filter-fields.ts`
- `packages/medusa/src/modules/rbac.ts`
- `packages/modules/link-modules/src/definitions/invite-rbac-role.ts`
- `packages/modules/link-modules/src/definitions/user-rbac-role.ts`

### RBAC user and invite workflows and APIs

- `packages/core/core-flows/src/invite/steps/get-invite-roles.ts`
- `packages/core/core-flows/src/invite/steps/validate-roles-exist.ts`
- `packages/core/core-flows/src/user/steps/get-assignable-policies.ts`
- `packages/core/core-flows/src/user/steps/get-assignable-roles.ts`
- `packages/core/core-flows/src/user/steps/validate-user-role-permissions.ts`
- `packages/core/core-flows/src/user/workflows/assign-user-roles.ts`
- `packages/core/core-flows/src/user/workflows/get-assignable-policies.ts`
- `packages/core/core-flows/src/user/workflows/get-assignable-roles.ts`
- `packages/core/core-flows/src/user/workflows/remove-user-roles.ts`
- `packages/medusa/src/api/admin/users/[id]/roles/`

### SDK and Admin dashboard

- `packages/core/js-sdk/src/admin/rbac-policy.ts`
- `packages/core/js-sdk/src/admin/rbac-role.ts`
- `packages/admin/dashboard/src/routes/policies/`
- `packages/admin/dashboard/src/routes/roles/`
- `packages/admin/dashboard/src/hooks/api/rbac-policies.tsx`
- `packages/admin/dashboard/src/hooks/api/rbac-roles.tsx`
- `packages/admin/dashboard/src/hooks/use-require-rbac-feature.tsx`
- `packages/admin/dashboard/src/components/common/required-permissions-section/`
- `packages/admin/dashboard/src/lib/permissions/`
- `packages/admin/dashboard/src/providers/permissions-provider/`

### RBAC-specific tests

- `packages/modules/rbac/integration-tests/`
- `integration-tests/http/__tests__/rbac/`
- `integration-tests/modules/__tests__/rbac/`
- `integration-tests/modules/__tests__/rbac-match-endpoint-entities.spec.ts`

### SSO provider and OIDC authentication

- `packages/modules/providers/auth-oidc/`
- `packages/medusa/src/modules/auth-oidc.ts`
- `packages/core/types/src/auth/providers/oidc.ts`
- `packages/medusa/src/api/auth/[auth_provider]/user/route.ts`
- `packages/admin/dashboard/src/routes/login/components/sso-login.tsx`

Generated, compiled, bundled, or otherwise transformed versions of the files
listed above are also Enterprise Materials, even if emitted to another path.

Files outside this list remain under the MIT License in `LICENSE`, including
generic authentication, generic auth provider registration and discovery,
generic user and invite management, shared HTTP and workflow infrastructure,
and incidental integration points that only register, configure, export, or
display the availability of an Enterprise feature.

UNLESS A COMMERCIAL AGREEMENT WITH MEDUSAJS, INC. EXPRESSLY STATES OTHERWISE:
THE ENTERPRISE MATERIALS ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT
WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, MEDUSAJS, INC.
DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING
ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE,
AND NON-INFRINGEMENT. TO THE SAME EXTENT, MEDUSAJS, INC. WILL NOT BE LIABLE
FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE
DAMAGES, OR FOR ANY LOSS OF DATA, PROFITS, REVENUE, GOODWILL, OR BUSINESS,
ARISING OUT OF OR RELATING TO THE ENTERPRISE MATERIALS OR THEIR USE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
