export const apiRefIntroSections = {
  "admin": [
    {
      "slug": "authentication",
      "title": "Authentication"
    },
    {
      "slug": "http-compression",
      "title": "HTTP Compression"
    },
    {
      "slug": "manage-metadata",
      "title": "Manage Metadata"
    },
    {
      "slug": "select-fields-and-relations",
      "title": "Select Fields and Relations"
    },
    {
      "slug": "query-parameter-types",
      "title": "Query Parameter Types"
    },
    {
      "slug": "pagination",
      "title": "Pagination"
    },
    {
      "slug": "workflows",
      "title": "Workflows"
    }
  ],
  "store": [
    {
      "slug": "authentication",
      "title": "Authentication"
    },
    {
      "slug": "publishable-api-key",
      "title": "Publishable API Key"
    },
    {
      "slug": "http-compression",
      "title": "HTTP Compression"
    },
    {
      "slug": "manage-metadata",
      "title": "Manage Metadata"
    },
    {
      "slug": "select-fields-and-relations",
      "title": "Select Fields and Relations"
    },
    {
      "slug": "query-parameter-types",
      "title": "Query Parameter Types"
    },
    {
      "slug": "pagination",
      "title": "Pagination"
    },
    {
      "slug": "workflows",
      "title": "Workflows"
    },
    {
      "slug": "localization",
      "title": "Localization"
    }
  ]
}

export const apiRefPaths = {
  "admin": {
    "intro": {
      "authentication": "/admin/authentication",
      "http-compression": "/admin/http-compression",
      "manage-metadata": "/admin/manage-metadata",
      "select-fields-and-relations": "/admin/select-fields-and-relations",
      "query-parameter-types": "/admin/query-parameter-types",
      "pagination": "/admin/pagination",
      "workflows": "/admin/workflows"
    },
    "tags": {
      "api-keys": {
        "name": "Api Keys",
        "path": "/admin/api-keys",
        "schemaPath": "/admin/api-keys/schema",
        "operations": {
          "GetApiKeysId": {
            "slug": "get-api-key",
            "path": "/admin/api-keys/get-api-key",
            "oldHash": "api-keys_getapikeysid",
            "title": "Get API Key",
            "method": "get"
          },
          "GetApiKeys": {
            "slug": "list-api-keys",
            "path": "/admin/api-keys/list-api-keys",
            "oldHash": "api-keys_getapikeys",
            "title": "List API Keys",
            "method": "get"
          },
          "PostApiKeys": {
            "slug": "create-api-key",
            "path": "/admin/api-keys/create-api-key",
            "oldHash": "api-keys_postapikeys",
            "title": "Create Api Key",
            "method": "post"
          },
          "PostApiKeysIdSalesChannels": {
            "slug": "manage-sales-channels",
            "path": "/admin/api-keys/manage-sales-channels",
            "oldHash": "api-keys_postapikeysidsaleschannels",
            "title": "Manage Sales Channels",
            "method": "post"
          },
          "PostApiKeysIdRevoke": {
            "slug": "revoke-api-key",
            "path": "/admin/api-keys/revoke-api-key",
            "oldHash": "api-keys_postapikeysidrevoke",
            "title": "Revoke API Key",
            "method": "post"
          },
          "PostApiKeysId": {
            "slug": "update-an-api-key",
            "path": "/admin/api-keys/update-an-api-key",
            "oldHash": "api-keys_postapikeysid",
            "title": "Update an API Key",
            "method": "post"
          },
          "DeleteApiKeysId": {
            "slug": "delete-an-api-key",
            "path": "/admin/api-keys/delete-an-api-key",
            "oldHash": "api-keys_deleteapikeysid",
            "title": "Delete an Api Key",
            "method": "delete"
          }
        }
      },
      "auth": {
        "name": "Auth",
        "path": "/admin/auth",
        "schemaPath": null,
        "operations": {
          "PostActor_typeAuth_provider": {
            "slug": "authenticate-user",
            "path": "/admin/auth/authenticate-user",
            "oldHash": "auth_postactor_typeauth_provider",
            "title": "Authenticate User",
            "method": "post"
          },
          "PostActor_typeAuth_providerResetPassword": {
            "slug": "generate-reset-password-token",
            "path": "/admin/auth/generate-reset-password-token",
            "oldHash": "auth_postactor_typeauth_providerresetpassword",
            "title": "Generate Reset Password Token",
            "method": "post"
          },
          "PostAdminAuthTokenRefresh": {
            "slug": "refresh-authentication-token",
            "path": "/admin/auth/refresh-authentication-token",
            "oldHash": "auth_postadminauthtokenrefresh",
            "title": "Refresh Authentication Token",
            "method": "post"
          },
          "PostActor_typeAuth_providerUpdate": {
            "slug": "reset-password",
            "path": "/admin/auth/reset-password",
            "oldHash": "auth_postactor_typeauth_providerupdate",
            "title": "Reset Password",
            "method": "post"
          },
          "PostActor_typeAuth_provider_register": {
            "slug": "retrieve-registration-jwt-token",
            "path": "/admin/auth/retrieve-registration-jwt-token",
            "oldHash": "auth_postactor_typeauth_provider_register",
            "title": "Retrieve Registration JWT Token",
            "method": "post"
          },
          "PostSession": {
            "slug": "set-authentication-session",
            "path": "/admin/auth/set-authentication-session",
            "oldHash": "auth_postsession",
            "title": "Set Authentication Session",
            "method": "post"
          },
          "PostActor_typeAuth_providerCallback": {
            "slug": "validate-authentication-callback",
            "path": "/admin/auth/validate-authentication-callback",
            "oldHash": "auth_postactor_typeauth_providercallback",
            "title": "Validate Authentication Callback",
            "method": "post"
          },
          "DeleteSession": {
            "slug": "delete-authentication-session",
            "path": "/admin/auth/delete-authentication-session",
            "oldHash": "auth_deletesession",
            "title": "Delete Authentication Session",
            "method": "delete"
          },
          "DeleteMfaFactorsId": {
            "slug": "disable-mfa-factor",
            "path": "/admin/auth/disable-mfa-factor",
            "oldHash": "auth_deletemfafactorsid",
            "title": "Disable MFA Factor",
            "method": "delete"
          }
        }
      },
      "campaigns": {
        "name": "Campaigns",
        "path": "/admin/campaigns",
        "schemaPath": "/admin/campaigns/schema",
        "operations": {
          "GetCampaignsId": {
            "slug": "get-a-campaign",
            "path": "/admin/campaigns/get-a-campaign",
            "oldHash": "campaigns_getcampaignsid",
            "title": "Get a Campaign",
            "method": "get"
          },
          "GetCampaigns": {
            "slug": "list-campaigns",
            "path": "/admin/campaigns/list-campaigns",
            "oldHash": "campaigns_getcampaigns",
            "title": "List Campaigns",
            "method": "get"
          },
          "PostCampaigns": {
            "slug": "create-campaign",
            "path": "/admin/campaigns/create-campaign",
            "oldHash": "campaigns_postcampaigns",
            "title": "Create Campaign",
            "method": "post"
          },
          "PostCampaignsIdPromotions": {
            "slug": "manage-promotions",
            "path": "/admin/campaigns/manage-promotions",
            "oldHash": "campaigns_postcampaignsidpromotions",
            "title": "Manage Promotions",
            "method": "post"
          },
          "PostCampaignsId": {
            "slug": "update-a-campaign",
            "path": "/admin/campaigns/update-a-campaign",
            "oldHash": "campaigns_postcampaignsid",
            "title": "Update a Campaign",
            "method": "post"
          },
          "DeleteCampaignsId": {
            "slug": "delete-a-campaign",
            "path": "/admin/campaigns/delete-a-campaign",
            "oldHash": "campaigns_deletecampaignsid",
            "title": "Delete a Campaign",
            "method": "delete"
          }
        }
      },
      "claims": {
        "name": "Claims",
        "path": "/admin/claims",
        "schemaPath": "/admin/claims/schema",
        "operations": {
          "GetClaimsId": {
            "slug": "get-a-claim",
            "path": "/admin/claims/get-a-claim",
            "oldHash": "claims_getclaimsid",
            "title": "Get a Claim",
            "method": "get"
          },
          "GetClaims": {
            "slug": "list-claims",
            "path": "/admin/claims/list-claims",
            "oldHash": "claims_getclaims",
            "title": "List Claims",
            "method": "get"
          },
          "PostClaimsIdInboundShippingMethod": {
            "slug": "add-inbound-shipping",
            "path": "/admin/claims/add-inbound-shipping",
            "oldHash": "claims_postclaimsidinboundshippingmethod",
            "title": "Add Inbound Shipping",
            "method": "post"
          },
          "PostClaimsIdClaimItems": {
            "slug": "add-claim-items",
            "path": "/admin/claims/add-claim-items",
            "oldHash": "claims_postclaimsidclaimitems",
            "title": "Add Claim Items",
            "method": "post"
          },
          "PostClaimsIdInboundItems": {
            "slug": "add-inbound-items",
            "path": "/admin/claims/add-inbound-items",
            "oldHash": "claims_postclaimsidinbounditems",
            "title": "Add Inbound Items",
            "method": "post"
          },
          "PostClaimsIdOutboundItems": {
            "slug": "add-outbound-items",
            "path": "/admin/claims/add-outbound-items",
            "oldHash": "claims_postclaimsidoutbounditems",
            "title": "Add Outbound Items",
            "method": "post"
          },
          "PostClaimsIdOutboundShippingMethod": {
            "slug": "add-outbound-shipping",
            "path": "/admin/claims/add-outbound-shipping",
            "oldHash": "claims_postclaimsidoutboundshippingmethod",
            "title": "Add Outbound Shipping",
            "method": "post"
          },
          "PostClaimsIdCancel": {
            "slug": "cancel-a-claim",
            "path": "/admin/claims/cancel-a-claim",
            "oldHash": "claims_postclaimsidcancel",
            "title": "Cancel a Claim",
            "method": "post"
          },
          "PostClaimsIdRequest": {
            "slug": "confirm-claim",
            "path": "/admin/claims/confirm-claim",
            "oldHash": "claims_postclaimsidrequest",
            "title": "Confirm Claim",
            "method": "post"
          },
          "PostClaims": {
            "slug": "create-a-claim",
            "path": "/admin/claims/create-a-claim",
            "oldHash": "claims_postclaims",
            "title": "Create a Claim",
            "method": "post"
          },
          "PostClaimsIdClaimItemsAction_id": {
            "slug": "update-a-claim-item",
            "path": "/admin/claims/update-a-claim-item",
            "oldHash": "claims_postclaimsidclaimitemsaction_id",
            "title": "Update a Claim Item",
            "method": "post"
          },
          "PostClaimsIdInboundItemsAction_id": {
            "slug": "update-inbound-items",
            "path": "/admin/claims/update-inbound-items",
            "oldHash": "claims_postclaimsidinbounditemsaction_id",
            "title": "Update Inbound Items",
            "method": "post"
          },
          "PostClaimsIdInboundShippingMethodAction_id": {
            "slug": "update-inbound-shipping",
            "path": "/admin/claims/update-inbound-shipping",
            "oldHash": "claims_postclaimsidinboundshippingmethodaction_id",
            "title": "Update Inbound Shipping",
            "method": "post"
          },
          "PostClaimsIdOutboundItemsAction_id": {
            "slug": "update-outbound-item",
            "path": "/admin/claims/update-outbound-item",
            "oldHash": "claims_postclaimsidoutbounditemsaction_id",
            "title": "Update Outbound Item",
            "method": "post"
          },
          "PostClaimsIdOutboundShippingMethodAction_id": {
            "slug": "update-outbound-shipping",
            "path": "/admin/claims/update-outbound-shipping",
            "oldHash": "claims_postclaimsidoutboundshippingmethodaction_id",
            "title": "Update Outbound Shipping",
            "method": "post"
          },
          "DeleteClaimsIdRequest": {
            "slug": "cancel-claim-request",
            "path": "/admin/claims/cancel-claim-request",
            "oldHash": "claims_deleteclaimsidrequest",
            "title": "Cancel Claim Request",
            "method": "delete"
          },
          "DeleteClaimsIdClaimItemsAction_id": {
            "slug": "remove-claim-item",
            "path": "/admin/claims/remove-claim-item",
            "oldHash": "claims_deleteclaimsidclaimitemsaction_id",
            "title": "Remove Claim Item",
            "method": "delete"
          },
          "DeleteClaimsIdInboundItemsAction_id": {
            "slug": "remove-inbound-item",
            "path": "/admin/claims/remove-inbound-item",
            "oldHash": "claims_deleteclaimsidinbounditemsaction_id",
            "title": "Remove Inbound Item",
            "method": "delete"
          },
          "DeleteClaimsIdOutboundItemsAction_id": {
            "slug": "remove-outbound-item",
            "path": "/admin/claims/remove-outbound-item",
            "oldHash": "claims_deleteclaimsidoutbounditemsaction_id",
            "title": "Remove Outbound Item",
            "method": "delete"
          },
          "DeleteClaimsIdInboundShippingMethodAction_id": {
            "slug": "remove-inbound-shipping-method",
            "path": "/admin/claims/remove-inbound-shipping-method",
            "oldHash": "claims_deleteclaimsidinboundshippingmethodaction_id",
            "title": "Remove Inbound Shipping Method",
            "method": "delete"
          },
          "DeleteClaimsIdOutboundShippingMethodAction_id": {
            "slug": "remove-outbound-shipping-method",
            "path": "/admin/claims/remove-outbound-shipping-method",
            "oldHash": "claims_deleteclaimsidoutboundshippingmethodaction_id",
            "title": "Remove Outbound Shipping Method",
            "method": "delete"
          }
        }
      },
      "collections": {
        "name": "Collections",
        "path": "/admin/collections",
        "schemaPath": "/admin/collections/schema",
        "operations": {
          "GetCollectionsId": {
            "slug": "get-a-collection",
            "path": "/admin/collections/get-a-collection",
            "oldHash": "collections_getcollectionsid",
            "title": "Get a Collection",
            "method": "get"
          },
          "GetCollections": {
            "slug": "list-collections",
            "path": "/admin/collections/list-collections",
            "oldHash": "collections_getcollections",
            "title": "List Collections",
            "method": "get"
          },
          "PostCollections": {
            "slug": "create-collection",
            "path": "/admin/collections/create-collection",
            "oldHash": "collections_postcollections",
            "title": "Create Collection",
            "method": "post"
          },
          "PostCollectionsIdProducts": {
            "slug": "manage-products",
            "path": "/admin/collections/manage-products",
            "oldHash": "collections_postcollectionsidproducts",
            "title": "Manage Products",
            "method": "post"
          },
          "PostCollectionsId": {
            "slug": "update-a-collection",
            "path": "/admin/collections/update-a-collection",
            "oldHash": "collections_postcollectionsid",
            "title": "Update a Collection",
            "method": "post"
          },
          "DeleteCollectionsId": {
            "slug": "delete-a-collection",
            "path": "/admin/collections/delete-a-collection",
            "oldHash": "collections_deletecollectionsid",
            "title": "Delete a Collection",
            "method": "delete"
          }
        }
      },
      "currencies": {
        "name": "Currencies",
        "path": "/admin/currencies",
        "schemaPath": "/admin/currencies/schema",
        "operations": {
          "GetCurrenciesCode": {
            "slug": "get-a-currency",
            "path": "/admin/currencies/get-a-currency",
            "oldHash": "currencies_getcurrenciescode",
            "title": "Get a Currency",
            "method": "get"
          },
          "GetCurrencies": {
            "slug": "list-currencies",
            "path": "/admin/currencies/list-currencies",
            "oldHash": "currencies_getcurrencies",
            "title": "List Currencies",
            "method": "get"
          }
        }
      },
      "customer-groups": {
        "name": "Customer Groups",
        "path": "/admin/customer-groups",
        "schemaPath": "/admin/customer-groups/schema",
        "operations": {
          "GetCustomerGroupsId": {
            "slug": "get-a-customer-group",
            "path": "/admin/customer-groups/get-a-customer-group",
            "oldHash": "customer-groups_getcustomergroupsid",
            "title": "Get a Customer Group",
            "method": "get"
          },
          "GetCustomerGroups": {
            "slug": "list-customer-groups",
            "path": "/admin/customer-groups/list-customer-groups",
            "oldHash": "customer-groups_getcustomergroups",
            "title": "List Customer Groups",
            "method": "get"
          },
          "PostCustomerGroups": {
            "slug": "create-customer-group",
            "path": "/admin/customer-groups/create-customer-group",
            "oldHash": "customer-groups_postcustomergroups",
            "title": "Create Customer Group",
            "method": "post"
          },
          "PostCustomerGroupsIdCustomers": {
            "slug": "manage-customers",
            "path": "/admin/customer-groups/manage-customers",
            "oldHash": "customer-groups_postcustomergroupsidcustomers",
            "title": "Manage Customers",
            "method": "post"
          },
          "PostCustomerGroupsId": {
            "slug": "update-a-customer-group",
            "path": "/admin/customer-groups/update-a-customer-group",
            "oldHash": "customer-groups_postcustomergroupsid",
            "title": "Update a Customer Group",
            "method": "post"
          },
          "DeleteCustomerGroupsId": {
            "slug": "delete-a-customer-group",
            "path": "/admin/customer-groups/delete-a-customer-group",
            "oldHash": "customer-groups_deletecustomergroupsid",
            "title": "Delete a Customer Group",
            "method": "delete"
          }
        }
      },
      "customers": {
        "name": "Customers",
        "path": "/admin/customers",
        "schemaPath": "/admin/customers/schema",
        "operations": {
          "GetCustomersId": {
            "slug": "get-a-customer",
            "path": "/admin/customers/get-a-customer",
            "oldHash": "customers_getcustomersid",
            "title": "Get a Customer",
            "method": "get"
          },
          "GetCustomersIdAddresses": {
            "slug": "list-addresses",
            "path": "/admin/customers/list-addresses",
            "oldHash": "customers_getcustomersidaddresses",
            "title": "List Addresses",
            "method": "get"
          },
          "GetCustomersIdAddressesAddress_id": {
            "slug": "list-addresses-2",
            "path": "/admin/customers/list-addresses-2",
            "oldHash": "customers_getcustomersidaddressesaddress_id",
            "title": "List Addresses",
            "method": "get"
          },
          "GetCustomers": {
            "slug": "list-customers",
            "path": "/admin/customers/list-customers",
            "oldHash": "customers_getcustomers",
            "title": "List Customers",
            "method": "get"
          },
          "PostCustomersIdAddresses": {
            "slug": "add-address",
            "path": "/admin/customers/add-address",
            "oldHash": "customers_postcustomersidaddresses",
            "title": "Add Address",
            "method": "post"
          },
          "PostCustomers": {
            "slug": "create-customer",
            "path": "/admin/customers/create-customer",
            "oldHash": "customers_postcustomers",
            "title": "Create Customer",
            "method": "post"
          },
          "PostCustomersIdCustomerGroups": {
            "slug": "manage-customer-groups",
            "path": "/admin/customers/manage-customer-groups",
            "oldHash": "customers_postcustomersidcustomergroups",
            "title": "Manage Customer Groups",
            "method": "post"
          },
          "PostCustomersId": {
            "slug": "update-a-customer",
            "path": "/admin/customers/update-a-customer",
            "oldHash": "customers_postcustomersid",
            "title": "Update a Customer",
            "method": "post"
          },
          "PostCustomersIdAddressesAddress_id": {
            "slug": "update-address",
            "path": "/admin/customers/update-address",
            "oldHash": "customers_postcustomersidaddressesaddress_id",
            "title": "Update Address",
            "method": "post"
          },
          "DeleteCustomersId": {
            "slug": "delete-a-customer",
            "path": "/admin/customers/delete-a-customer",
            "oldHash": "customers_deletecustomersid",
            "title": "Delete a Customer",
            "method": "delete"
          },
          "DeleteCustomersIdAddressesAddress_id": {
            "slug": "remove-an-address-from-customer",
            "path": "/admin/customers/remove-an-address-from-customer",
            "oldHash": "customers_deletecustomersidaddressesaddress_id",
            "title": "Remove an Address from Customer",
            "method": "delete"
          }
        }
      },
      "draft-orders": {
        "name": "Draft Orders",
        "path": "/admin/draft-orders",
        "schemaPath": "/admin/draft-orders/schema",
        "operations": {
          "GetDraftOrdersId": {
            "slug": "get-a-draft-order",
            "path": "/admin/draft-orders/get-a-draft-order",
            "oldHash": "draft-orders_getdraftordersid",
            "title": "Get a Draft Order",
            "method": "get"
          },
          "GetDraftOrders": {
            "slug": "list-draft-orders",
            "path": "/admin/draft-orders/list-draft-orders",
            "oldHash": "draft-orders_getdraftorders",
            "title": "List Draft Orders",
            "method": "get"
          },
          "PostDraftOrdersIdEditItems": {
            "slug": "add-item",
            "path": "/admin/draft-orders/add-item",
            "oldHash": "draft-orders_postdraftordersidedititems",
            "title": "Add Item",
            "method": "post"
          },
          "PostDraftOrdersIdEditPromotions": {
            "slug": "add-promotions",
            "path": "/admin/draft-orders/add-promotions",
            "oldHash": "draft-orders_postdraftordersideditpromotions",
            "title": "Add Promotions",
            "method": "post"
          },
          "PostDraftOrdersIdEditShippingMethods": {
            "slug": "add-shipping-method",
            "path": "/admin/draft-orders/add-shipping-method",
            "oldHash": "draft-orders_postdraftordersideditshippingmethods",
            "title": "Add Shipping Method",
            "method": "post"
          },
          "PostDraftOrdersIdEditConfirm": {
            "slug": "confirm-edit",
            "path": "/admin/draft-orders/confirm-edit",
            "oldHash": "draft-orders_postdraftordersideditconfirm",
            "title": "Confirm Edit",
            "method": "post"
          },
          "PostDraftOrdersIdConvertToOrder": {
            "slug": "convert-to-order",
            "path": "/admin/draft-orders/convert-to-order",
            "oldHash": "draft-orders_postdraftordersidconverttoorder",
            "title": "Convert to Order",
            "method": "post"
          },
          "PostDraftOrdersIdEdit": {
            "slug": "create-edit",
            "path": "/admin/draft-orders/create-edit",
            "oldHash": "draft-orders_postdraftordersidedit",
            "title": "Create Edit",
            "method": "post"
          },
          "PostDraftOrders": {
            "slug": "create-draft-order",
            "path": "/admin/draft-orders/create-draft-order",
            "oldHash": "draft-orders_postdraftorders",
            "title": "Create Draft Order",
            "method": "post"
          },
          "PostDraftOrdersIdEditRequest": {
            "slug": "request-edit",
            "path": "/admin/draft-orders/request-edit",
            "oldHash": "draft-orders_postdraftordersideditrequest",
            "title": "Request Edit",
            "method": "post"
          },
          "PostDraftOrdersId": {
            "slug": "update-a-draft-order",
            "path": "/admin/draft-orders/update-a-draft-order",
            "oldHash": "draft-orders_postdraftordersid",
            "title": "Update a Draft Order",
            "method": "post"
          },
          "PostDraftOrdersIdEditItemsItemItem_id": {
            "slug": "update-item",
            "path": "/admin/draft-orders/update-item",
            "oldHash": "draft-orders_postdraftordersidedititemsitemitem_id",
            "title": "Update Item",
            "method": "post"
          },
          "PostDraftOrdersIdEditShippingMethodsMethodMethod_id": {
            "slug": "update-shipping-method",
            "path": "/admin/draft-orders/update-shipping-method",
            "oldHash": "draft-orders_postdraftordersideditshippingmethodsmethodmethod_id",
            "title": "Update Shipping Method",
            "method": "post"
          },
          "PostDraftOrdersIdEditItemsAction_id": {
            "slug": "update-new-item",
            "path": "/admin/draft-orders/update-new-item",
            "oldHash": "draft-orders_postdraftordersidedititemsaction_id",
            "title": "Update New Item",
            "method": "post"
          },
          "PostDraftOrdersIdEditShippingMethodsAction_id": {
            "slug": "update-new-shipping-method",
            "path": "/admin/draft-orders/update-new-shipping-method",
            "oldHash": "draft-orders_postdraftordersideditshippingmethodsaction_id",
            "title": "Update New Shipping Method",
            "method": "post"
          },
          "DeleteDraftOrdersIdEdit": {
            "slug": "cancel-edit",
            "path": "/admin/draft-orders/cancel-edit",
            "oldHash": "draft-orders_deletedraftordersidedit",
            "title": "Cancel Edit",
            "method": "delete"
          },
          "DeleteDraftOrdersId": {
            "slug": "delete-a-draft-order",
            "path": "/admin/draft-orders/delete-a-draft-order",
            "oldHash": "draft-orders_deletedraftordersid",
            "title": "Delete a Draft Order",
            "method": "delete"
          },
          "DeleteDraftOrdersIdEditItemsAction_id": {
            "slug": "remove-item",
            "path": "/admin/draft-orders/remove-item",
            "oldHash": "draft-orders_deletedraftordersidedititemsaction_id",
            "title": "Remove Item",
            "method": "delete"
          },
          "DeleteDraftOrdersIdEditShippingMethodsAction_id": {
            "slug": "remove-new-shipping-method",
            "path": "/admin/draft-orders/remove-new-shipping-method",
            "oldHash": "draft-orders_deletedraftordersideditshippingmethodsaction_id",
            "title": "Remove New Shipping Method",
            "method": "delete"
          },
          "DeleteDraftOrdersIdEditPromotions": {
            "slug": "remove-promotions",
            "path": "/admin/draft-orders/remove-promotions",
            "oldHash": "draft-orders_deletedraftordersideditpromotions",
            "title": "Remove Promotions",
            "method": "delete"
          },
          "DeleteDraftOrdersIdEditShippingMethodsMethodMethod_id": {
            "slug": "remove-shipping-method",
            "path": "/admin/draft-orders/remove-shipping-method",
            "oldHash": "draft-orders_deletedraftordersideditshippingmethodsmethodmethod_id",
            "title": "Remove Shipping Method",
            "method": "delete"
          }
        }
      },
      "exchanges": {
        "name": "Exchanges",
        "path": "/admin/exchanges",
        "schemaPath": "/admin/exchanges/schema",
        "operations": {
          "GetExchangesId": {
            "slug": "get-an-exchange",
            "path": "/admin/exchanges/get-an-exchange",
            "oldHash": "exchanges_getexchangesid",
            "title": "Get an Exchange",
            "method": "get"
          },
          "GetExchanges": {
            "slug": "list-exchanges",
            "path": "/admin/exchanges/list-exchanges",
            "oldHash": "exchanges_getexchanges",
            "title": "List Exchanges",
            "method": "get"
          },
          "PostExchangesIdInboundShippingMethod": {
            "slug": "add-inbound-shipping",
            "path": "/admin/exchanges/add-inbound-shipping",
            "oldHash": "exchanges_postexchangesidinboundshippingmethod",
            "title": "Add Inbound Shipping",
            "method": "post"
          },
          "PostExchangesIdInboundItems": {
            "slug": "add-inbound-items-to-an-exchange",
            "path": "/admin/exchanges/add-inbound-items-to-an-exchange",
            "oldHash": "exchanges_postexchangesidinbounditems",
            "title": "Add Inbound Items to an Exchange",
            "method": "post"
          },
          "PostExchangesIdOutboundItems": {
            "slug": "add-outbound-items-to-exchange",
            "path": "/admin/exchanges/add-outbound-items-to-exchange",
            "oldHash": "exchanges_postexchangesidoutbounditems",
            "title": "Add Outbound Items to Exchange",
            "method": "post"
          },
          "PostExchangesIdOutboundShippingMethod": {
            "slug": "add-outbound-shipping",
            "path": "/admin/exchanges/add-outbound-shipping",
            "oldHash": "exchanges_postexchangesidoutboundshippingmethod",
            "title": "Add Outbound Shipping",
            "method": "post"
          },
          "PostExchangesIdCancel": {
            "slug": "cancel-an-exchange",
            "path": "/admin/exchanges/cancel-an-exchange",
            "oldHash": "exchanges_postexchangesidcancel",
            "title": "Cancel an Exchange",
            "method": "post"
          },
          "PostExchangesIdRequest": {
            "slug": "confirm-an-exchange",
            "path": "/admin/exchanges/confirm-an-exchange",
            "oldHash": "exchanges_postexchangesidrequest",
            "title": "Confirm an Exchange",
            "method": "post"
          },
          "PostExchanges": {
            "slug": "create-exchange",
            "path": "/admin/exchanges/create-exchange",
            "oldHash": "exchanges_postexchanges",
            "title": "Create Exchange",
            "method": "post"
          },
          "PostExchangesIdInboundItemsAction_id": {
            "slug": "update-inbound-item",
            "path": "/admin/exchanges/update-inbound-item",
            "oldHash": "exchanges_postexchangesidinbounditemsaction_id",
            "title": "Update Inbound Item",
            "method": "post"
          },
          "PostExchangesIdInboundShippingMethodAction_id": {
            "slug": "update-inbound-shipping",
            "path": "/admin/exchanges/update-inbound-shipping",
            "oldHash": "exchanges_postexchangesidinboundshippingmethodaction_id",
            "title": "Update Inbound Shipping",
            "method": "post"
          },
          "PostExchangesIdOutboundItemsAction_id": {
            "slug": "update-outbound-item",
            "path": "/admin/exchanges/update-outbound-item",
            "oldHash": "exchanges_postexchangesidoutbounditemsaction_id",
            "title": "Update Outbound Item",
            "method": "post"
          },
          "PostExchangesIdOutboundShippingMethodAction_id": {
            "slug": "update-outbound-shipping",
            "path": "/admin/exchanges/update-outbound-shipping",
            "oldHash": "exchanges_postexchangesidoutboundshippingmethodaction_id",
            "title": "Update Outbound Shipping",
            "method": "post"
          },
          "DeleteExchangesIdRequest": {
            "slug": "cancel-exchange-request",
            "path": "/admin/exchanges/cancel-exchange-request",
            "oldHash": "exchanges_deleteexchangesidrequest",
            "title": "Cancel Exchange Request",
            "method": "delete"
          },
          "DeleteExchangesIdInboundItemsAction_id": {
            "slug": "remove-inbound-item",
            "path": "/admin/exchanges/remove-inbound-item",
            "oldHash": "exchanges_deleteexchangesidinbounditemsaction_id",
            "title": "Remove Inbound Item",
            "method": "delete"
          },
          "DeleteExchangesIdInboundShippingMethodAction_id": {
            "slug": "remove-inbound-shipping-method",
            "path": "/admin/exchanges/remove-inbound-shipping-method",
            "oldHash": "exchanges_deleteexchangesidinboundshippingmethodaction_id",
            "title": "Remove Inbound Shipping Method",
            "method": "delete"
          },
          "DeleteExchangesIdOutboundItemsAction_id": {
            "slug": "remove-outbound-item",
            "path": "/admin/exchanges/remove-outbound-item",
            "oldHash": "exchanges_deleteexchangesidoutbounditemsaction_id",
            "title": "Remove Outbound Item",
            "method": "delete"
          },
          "DeleteExchangesIdOutboundShippingMethodAction_id": {
            "slug": "remove-outbound-shipping-method",
            "path": "/admin/exchanges/remove-outbound-shipping-method",
            "oldHash": "exchanges_deleteexchangesidoutboundshippingmethodaction_id",
            "title": "Remove Outbound Shipping Method",
            "method": "delete"
          }
        }
      },
      "feature-flags": {
        "name": "Feature Flags",
        "path": "/admin/feature-flags",
        "schemaPath": null,
        "operations": {
          "GetFeatureFlags": {
            "slug": "list-feature-flags",
            "path": "/admin/feature-flags/list-feature-flags",
            "oldHash": "feature-flags_getfeatureflags",
            "title": "List Feature Flags",
            "method": "get"
          }
        }
      },
      "fulfillment-providers": {
        "name": "Fulfillment Providers",
        "path": "/admin/fulfillment-providers",
        "schemaPath": "/admin/fulfillment-providers/schema",
        "operations": {
          "GetFulfillmentProvidersIdOptions": {
            "slug": "list-fulfillment-options",
            "path": "/admin/fulfillment-providers/list-fulfillment-options",
            "oldHash": "fulfillment-providers_getfulfillmentprovidersidoptions",
            "title": "List Fulfillment Options",
            "method": "get"
          },
          "GetFulfillmentProviders": {
            "slug": "list-fulfillment-providers",
            "path": "/admin/fulfillment-providers/list-fulfillment-providers",
            "oldHash": "fulfillment-providers_getfulfillmentproviders",
            "title": "List Fulfillment Providers",
            "method": "get"
          }
        }
      },
      "fulfillment-sets": {
        "name": "Fulfillment Sets",
        "path": "/admin/fulfillment-sets",
        "schemaPath": "/admin/fulfillment-sets/schema",
        "operations": {
          "GetFulfillmentSetsIdServiceZonesZone_id": {
            "slug": "get-a-service-zone",
            "path": "/admin/fulfillment-sets/get-a-service-zone",
            "oldHash": "fulfillment-sets_getfulfillmentsetsidservicezoneszone_id",
            "title": "Get a Service Zone",
            "method": "get"
          },
          "PostFulfillmentSetsIdServiceZones": {
            "slug": "add-service-zone",
            "path": "/admin/fulfillment-sets/add-service-zone",
            "oldHash": "fulfillment-sets_postfulfillmentsetsidservicezones",
            "title": "Add Service Zone",
            "method": "post"
          },
          "PostFulfillmentSetsIdServiceZonesZone_id": {
            "slug": "update-service-zone",
            "path": "/admin/fulfillment-sets/update-service-zone",
            "oldHash": "fulfillment-sets_postfulfillmentsetsidservicezoneszone_id",
            "title": "Update Service Zone",
            "method": "post"
          },
          "DeleteFulfillmentSetsId": {
            "slug": "delete-fulfillment-set",
            "path": "/admin/fulfillment-sets/delete-fulfillment-set",
            "oldHash": "fulfillment-sets_deletefulfillmentsetsid",
            "title": "Delete Fulfillment Set",
            "method": "delete"
          },
          "DeleteFulfillmentSetsIdServiceZonesZone_id": {
            "slug": "remove-service-zone",
            "path": "/admin/fulfillment-sets/remove-service-zone",
            "oldHash": "fulfillment-sets_deletefulfillmentsetsidservicezoneszone_id",
            "title": "Remove Service Zone",
            "method": "delete"
          }
        }
      },
      "fulfillments": {
        "name": "Fulfillments",
        "path": "/admin/fulfillments",
        "schemaPath": "/admin/fulfillments/schema",
        "operations": {
          "PostFulfillmentsIdCancel": {
            "slug": "cancel-a-fulfillment",
            "path": "/admin/fulfillments/cancel-a-fulfillment",
            "oldHash": "fulfillments_postfulfillmentsidcancel",
            "title": "Cancel a Fulfillment",
            "method": "post"
          },
          "PostFulfillmentsIdShipment": {
            "slug": "create-shipment",
            "path": "/admin/fulfillments/create-shipment",
            "oldHash": "fulfillments_postfulfillmentsidshipment",
            "title": "Create Shipment",
            "method": "post"
          },
          "PostFulfillments": {
            "slug": "create-fulfillment",
            "path": "/admin/fulfillments/create-fulfillment",
            "oldHash": "fulfillments_postfulfillments",
            "title": "Create Fulfillment",
            "method": "post"
          }
        }
      },
      "gift-cards": {
        "name": "Gift Cards",
        "path": "/admin/gift-cards",
        "schemaPath": "/admin/gift-cards/schema",
        "operations": {
          "GetGiftCardsId": {
            "slug": "get-a-gift-card",
            "path": "/admin/gift-cards/get-a-gift-card",
            "oldHash": "gift-cards_getgiftcardsid",
            "title": "Get a Gift Card",
            "method": "get"
          },
          "GetGiftCardsIdOrders": {
            "slug": "list-orders",
            "path": "/admin/gift-cards/list-orders",
            "oldHash": "gift-cards_getgiftcardsidorders",
            "title": "List Orders",
            "method": "get"
          },
          "GetGiftCards": {
            "slug": "list-gift-cards",
            "path": "/admin/gift-cards/list-gift-cards",
            "oldHash": "gift-cards_getgiftcards",
            "title": "List Gift Cards",
            "method": "get"
          },
          "PostGiftCards": {
            "slug": "create-gift-card",
            "path": "/admin/gift-cards/create-gift-card",
            "oldHash": "gift-cards_postgiftcards",
            "title": "Create Gift Card",
            "method": "post"
          },
          "PostGiftCardsId": {
            "slug": "update-a-gift-card",
            "path": "/admin/gift-cards/update-a-gift-card",
            "oldHash": "gift-cards_postgiftcardsid",
            "title": "Update a Gift Card",
            "method": "post"
          }
        }
      },
      "index": {
        "name": "Index",
        "path": "/admin/index",
        "schemaPath": null,
        "operations": {
          "GetIndexDetails": {
            "slug": "get-index-details",
            "path": "/admin/index/get-index-details",
            "oldHash": "index_getindexdetails",
            "title": "Get Index Details",
            "method": "get"
          },
          "PostIndexSync": {
            "slug": "trigger-index-sync",
            "path": "/admin/index/trigger-index-sync",
            "oldHash": "index_postindexsync",
            "title": "Trigger Index Sync",
            "method": "post"
          }
        }
      },
      "inventory-items": {
        "name": "Inventory Items",
        "path": "/admin/inventory-items",
        "schemaPath": "/admin/inventory-items/schema",
        "operations": {
          "GetInventoryItemsId": {
            "slug": "get-a-inventory-item",
            "path": "/admin/inventory-items/get-a-inventory-item",
            "oldHash": "inventory-items_getinventoryitemsid",
            "title": "Get a Inventory Item",
            "method": "get"
          },
          "GetInventoryItems": {
            "slug": "list-inventory-items",
            "path": "/admin/inventory-items/list-inventory-items",
            "oldHash": "inventory-items_getinventoryitems",
            "title": "List Inventory Items",
            "method": "get"
          },
          "GetInventoryItemsIdLocationLevels": {
            "slug": "list-inventory-levels",
            "path": "/admin/inventory-items/list-inventory-levels",
            "oldHash": "inventory-items_getinventoryitemsidlocationlevels",
            "title": "List Inventory Levels",
            "method": "get"
          },
          "PostInventoryItems": {
            "slug": "create-inventory-item",
            "path": "/admin/inventory-items/create-inventory-item",
            "oldHash": "inventory-items_postinventoryitems",
            "title": "Create Inventory Item",
            "method": "post"
          },
          "PostInventoryItemsIdLocationLevels": {
            "slug": "create-inventory-level",
            "path": "/admin/inventory-items/create-inventory-level",
            "oldHash": "inventory-items_postinventoryitemsidlocationlevels",
            "title": "Create Inventory Level",
            "method": "post"
          },
          "PostInventoryItemsLocationLevelsBatch": {
            "slug": "manage-inventory-levels",
            "path": "/admin/inventory-items/manage-inventory-levels",
            "oldHash": "inventory-items_postinventoryitemslocationlevelsbatch",
            "title": "Manage Inventory Levels",
            "method": "post"
          },
          "PostInventoryItemsIdLocationLevelsBatch": {
            "slug": "manage-inventory-levels-2",
            "path": "/admin/inventory-items/manage-inventory-levels-2",
            "oldHash": "inventory-items_postinventoryitemsidlocationlevelsbatch",
            "title": "Manage Inventory Levels",
            "method": "post"
          },
          "PostInventoryItemsId": {
            "slug": "update-an-inventory-item",
            "path": "/admin/inventory-items/update-an-inventory-item",
            "oldHash": "inventory-items_postinventoryitemsid",
            "title": "Update an Inventory Item",
            "method": "post"
          },
          "PostInventoryItemsIdLocationLevelsLocation_id": {
            "slug": "update-inventory-level",
            "path": "/admin/inventory-items/update-inventory-level",
            "oldHash": "inventory-items_postinventoryitemsidlocationlevelslocation_id",
            "title": "Update Inventory Level",
            "method": "post"
          },
          "DeleteInventoryItemsId": {
            "slug": "delete-inventory-item",
            "path": "/admin/inventory-items/delete-inventory-item",
            "oldHash": "inventory-items_deleteinventoryitemsid",
            "title": "Delete Inventory Item",
            "method": "delete"
          },
          "DeleteInventoryItemsIdLocationLevelsLocation_id": {
            "slug": "remove-inventory-level",
            "path": "/admin/inventory-items/remove-inventory-level",
            "oldHash": "inventory-items_deleteinventoryitemsidlocationlevelslocation_id",
            "title": "Remove Inventory Level",
            "method": "delete"
          }
        }
      },
      "invites": {
        "name": "Invites",
        "path": "/admin/invites",
        "schemaPath": "/admin/invites/schema",
        "operations": {
          "GetInvitesId": {
            "slug": "get-an-invite",
            "path": "/admin/invites/get-an-invite",
            "oldHash": "invites_getinvitesid",
            "title": "Get an Invite",
            "method": "get"
          },
          "GetInvites": {
            "slug": "list-invites",
            "path": "/admin/invites/list-invites",
            "oldHash": "invites_getinvites",
            "title": "List Invites",
            "method": "get"
          },
          "PostInvitesAccept": {
            "slug": "accept-invite",
            "path": "/admin/invites/accept-invite",
            "oldHash": "invites_postinvitesaccept",
            "title": "Accept Invite",
            "method": "post"
          },
          "PostInvites": {
            "slug": "create-invite",
            "path": "/admin/invites/create-invite",
            "oldHash": "invites_postinvites",
            "title": "Create Invite",
            "method": "post"
          },
          "PostInvitesIdResend": {
            "slug": "refresh-invite-token",
            "path": "/admin/invites/refresh-invite-token",
            "oldHash": "invites_postinvitesidresend",
            "title": "Refresh Invite Token",
            "method": "post"
          },
          "DeleteInvitesId": {
            "slug": "delete-invite",
            "path": "/admin/invites/delete-invite",
            "oldHash": "invites_deleteinvitesid",
            "title": "Delete Invite",
            "method": "delete"
          }
        }
      },
      "layouts": {
        "name": "Layouts",
        "path": "/admin/layouts",
        "schemaPath": null,
        "operations": {
          "GetLayoutsConfigurations": {
            "slug": "list-layout-configurations",
            "path": "/admin/layouts/list-layout-configurations",
            "oldHash": "layouts_getlayoutsconfigurations",
            "title": "List Layout Configurations",
            "method": "get"
          },
          "GetLayoutsZoneConfiguration": {
            "slug": "list-layout-configurations-2",
            "path": "/admin/layouts/list-layout-configurations-2",
            "oldHash": "layouts_getlayoutszoneconfiguration",
            "title": "List Layout Configurations",
            "method": "get"
          },
          "PostLayoutsZoneConfiguration": {
            "slug": "add-layout-configuration",
            "path": "/admin/layouts/add-layout-configuration",
            "oldHash": "layouts_postlayoutszoneconfiguration",
            "title": "Add Layout Configuration",
            "method": "post"
          },
          "DeleteLayoutsZoneConfiguration": {
            "slug": "clear-configuration-of-layout",
            "path": "/admin/layouts/clear-configuration-of-layout",
            "oldHash": "layouts_deletelayoutszoneconfiguration",
            "title": "Clear Configuration of Layout",
            "method": "delete"
          }
        }
      },
      "locales": {
        "name": "Locales",
        "path": "/admin/locales",
        "schemaPath": "/admin/locales/schema",
        "operations": {
          "GetLocalesCode": {
            "slug": "get-locale",
            "path": "/admin/locales/get-locale",
            "oldHash": "locales_getlocalescode",
            "title": "Get Locale",
            "method": "get"
          },
          "GetLocales": {
            "slug": "list-locales",
            "path": "/admin/locales/list-locales",
            "oldHash": "locales_getlocales",
            "title": "List Locales",
            "method": "get"
          }
        }
      },
      "multi-factor-authentication": {
        "name": "Multi-Factor Authentication",
        "path": "/admin/multi-factor-authentication",
        "schemaPath": null,
        "operations": {
          "GetMfaFactors": {
            "slug": "list-mfa-factors",
            "path": "/admin/multi-factor-authentication/list-mfa-factors",
            "oldHash": "multi-factor-authentication_getmfafactors",
            "title": "List MFA Factors",
            "method": "get"
          },
          "PostMfaRecoveryCodes": {
            "slug": "generate-mfa-recovery-codes",
            "path": "/admin/multi-factor-authentication/generate-mfa-recovery-codes",
            "oldHash": "multi-factor-authentication_postmfarecoverycodes",
            "title": "Generate MFA Recovery Codes",
            "method": "post"
          },
          "PostMfaFactors": {
            "slug": "start-mfa-factor-enrollment",
            "path": "/admin/multi-factor-authentication/start-mfa-factor-enrollment",
            "oldHash": "multi-factor-authentication_postmfafactors",
            "title": "Start MFA Factor Enrollment",
            "method": "post"
          },
          "PostMfaChallengesIdVerify": {
            "slug": "verify-mfa-challenge",
            "path": "/admin/multi-factor-authentication/verify-mfa-challenge",
            "oldHash": "multi-factor-authentication_postmfachallengesidverify",
            "title": "Verify MFA Challenge",
            "method": "post"
          },
          "PostMfaFactorsIdVerify": {
            "slug": "verify-and-enable-mfa-factor",
            "path": "/admin/multi-factor-authentication/verify-and-enable-mfa-factor",
            "oldHash": "multi-factor-authentication_postmfafactorsidverify",
            "title": "Verify and Enable MFA Factor",
            "method": "post"
          }
        }
      },
      "notifications": {
        "name": "Notifications",
        "path": "/admin/notifications",
        "schemaPath": "/admin/notifications/schema",
        "operations": {
          "GetNotificationsId": {
            "slug": "get-a-notification",
            "path": "/admin/notifications/get-a-notification",
            "oldHash": "notifications_getnotificationsid",
            "title": "Get a Notification",
            "method": "get"
          },
          "GetNotifications": {
            "slug": "list-notifications",
            "path": "/admin/notifications/list-notifications",
            "oldHash": "notifications_getnotifications",
            "title": "List Notifications",
            "method": "get"
          }
        }
      },
      "order-changes": {
        "name": "Order Changes",
        "path": "/admin/order-changes",
        "schemaPath": "/admin/order-changes/schema",
        "operations": {
          "PostOrderChangesId": {
            "slug": "update-order-change",
            "path": "/admin/order-changes/update-order-change",
            "oldHash": "order-changes_postorderchangesid",
            "title": "Update Order Change",
            "method": "post"
          }
        }
      },
      "order-edits": {
        "name": "Order Edits",
        "path": "/admin/order-edits",
        "schemaPath": null,
        "operations": {
          "PostOrderEditsIdItems": {
            "slug": "add-items",
            "path": "/admin/order-edits/add-items",
            "oldHash": "order-edits_postordereditsiditems",
            "title": "Add Items",
            "method": "post"
          },
          "PostOrderEditsIdShippingMethod": {
            "slug": "add-shipping-method",
            "path": "/admin/order-edits/add-shipping-method",
            "oldHash": "order-edits_postordereditsidshippingmethod",
            "title": "Add Shipping Method",
            "method": "post"
          },
          "PostOrderEditsIdConfirm": {
            "slug": "confirm-order-edit",
            "path": "/admin/order-edits/confirm-order-edit",
            "oldHash": "order-edits_postordereditsidconfirm",
            "title": "Confirm Order Edit",
            "method": "post"
          },
          "PostOrderEdits": {
            "slug": "create-order-edit",
            "path": "/admin/order-edits/create-order-edit",
            "oldHash": "order-edits_postorderedits",
            "title": "Create Order Edit",
            "method": "post"
          },
          "PostOrderEditsIdRequest": {
            "slug": "request-order-edit",
            "path": "/admin/order-edits/request-order-edit",
            "oldHash": "order-edits_postordereditsidrequest",
            "title": "Request Order Edit",
            "method": "post"
          },
          "PostOrderEditsIdItemsAction_id": {
            "slug": "update-item",
            "path": "/admin/order-edits/update-item",
            "oldHash": "order-edits_postordereditsiditemsaction_id",
            "title": "Update Item",
            "method": "post"
          },
          "PostOrderEditsIdItemsItemItem_id": {
            "slug": "update-item-quantity",
            "path": "/admin/order-edits/update-item-quantity",
            "oldHash": "order-edits_postordereditsiditemsitemitem_id",
            "title": "Update Item Quantity",
            "method": "post"
          },
          "PostOrderEditsIdShippingMethodAction_id": {
            "slug": "update-shipping-method",
            "path": "/admin/order-edits/update-shipping-method",
            "oldHash": "order-edits_postordereditsidshippingmethodaction_id",
            "title": "Update Shipping Method",
            "method": "post"
          },
          "DeleteOrderEditsId": {
            "slug": "cancel-order-edit",
            "path": "/admin/order-edits/cancel-order-edit",
            "oldHash": "order-edits_deleteordereditsid",
            "title": "Cancel Order Edit",
            "method": "delete"
          },
          "DeleteOrderEditsIdItemsAction_id": {
            "slug": "remove-item",
            "path": "/admin/order-edits/remove-item",
            "oldHash": "order-edits_deleteordereditsiditemsaction_id",
            "title": "Remove Item",
            "method": "delete"
          },
          "DeleteOrderEditsIdShippingMethodAction_id": {
            "slug": "remove-shipping-method",
            "path": "/admin/order-edits/remove-shipping-method",
            "oldHash": "order-edits_deleteordereditsidshippingmethodaction_id",
            "title": "Remove Shipping Method",
            "method": "delete"
          }
        }
      },
      "orders": {
        "name": "Orders",
        "path": "/admin/orders",
        "schemaPath": "/admin/orders/schema",
        "operations": {
          "GetOrdersId": {
            "slug": "get-an-order",
            "path": "/admin/orders/get-an-order",
            "oldHash": "orders_getordersid",
            "title": "Get an Order",
            "method": "get"
          },
          "GetOrdersIdPreview": {
            "slug": "get-preview",
            "path": "/admin/orders/get-preview",
            "oldHash": "orders_getordersidpreview",
            "title": "Get Preview",
            "method": "get"
          },
          "GetOrdersIdChanges": {
            "slug": "list-changes",
            "path": "/admin/orders/list-changes",
            "oldHash": "orders_getordersidchanges",
            "title": "List Changes",
            "method": "get"
          },
          "GetOrdersIdLineItems": {
            "slug": "list-line-items",
            "path": "/admin/orders/list-line-items",
            "oldHash": "orders_getordersidlineitems",
            "title": "List Line Items",
            "method": "get"
          },
          "GetOrders": {
            "slug": "list-orders",
            "path": "/admin/orders/list-orders",
            "oldHash": "orders_getorders",
            "title": "List Orders",
            "method": "get"
          },
          "GetOrdersIdShippingOptions": {
            "slug": "list-shipping-options",
            "path": "/admin/orders/list-shipping-options",
            "oldHash": "orders_getordersidshippingoptions",
            "title": "List Shipping Options",
            "method": "get"
          },
          "PostOrdersIdArchive": {
            "slug": "archive-an-order",
            "path": "/admin/orders/archive-an-order",
            "oldHash": "orders_postordersidarchive",
            "title": "Archive an Order",
            "method": "post"
          },
          "PostOrdersIdPaymentSessionsAuthorize": {
            "slug": "authorize-payment-session",
            "path": "/admin/orders/authorize-payment-session",
            "oldHash": "orders_postordersidpaymentsessionsauthorize",
            "title": "Authorize Payment Session",
            "method": "post"
          },
          "PostOrdersIdFulfillmentsFulfillment_idCancel": {
            "slug": "cancel-fulfillment",
            "path": "/admin/orders/cancel-fulfillment",
            "oldHash": "orders_postordersidfulfillmentsfulfillment_idcancel",
            "title": "Cancel Fulfillment",
            "method": "post"
          },
          "PostOrdersIdCancel": {
            "slug": "cancel-order",
            "path": "/admin/orders/cancel-order",
            "oldHash": "orders_postordersidcancel",
            "title": "Cancel Order",
            "method": "post"
          },
          "PostOrdersIdTransferCancel": {
            "slug": "cancel-transfer",
            "path": "/admin/orders/cancel-transfer",
            "oldHash": "orders_postordersidtransfercancel",
            "title": "Cancel Transfer",
            "method": "post"
          },
          "PostOrdersIdComplete": {
            "slug": "complete-order",
            "path": "/admin/orders/complete-order",
            "oldHash": "orders_postordersidcomplete",
            "title": "Complete Order",
            "method": "post"
          },
          "PostOrdersIdFulfillments": {
            "slug": "create-fulfillment",
            "path": "/admin/orders/create-fulfillment",
            "oldHash": "orders_postordersidfulfillments",
            "title": "Create Fulfillment",
            "method": "post"
          },
          "PostOrdersIdCreditLines": {
            "slug": "create-credit-line",
            "path": "/admin/orders/create-credit-line",
            "oldHash": "orders_postordersidcreditlines",
            "title": "Create Credit Line",
            "method": "post"
          },
          "PostOrdersIdFulfillmentsFulfillment_idShipments": {
            "slug": "create-shipment",
            "path": "/admin/orders/create-shipment",
            "oldHash": "orders_postordersidfulfillmentsfulfillment_idshipments",
            "title": "Create Shipment",
            "method": "post"
          },
          "PostOrdersExport": {
            "slug": "export-orders",
            "path": "/admin/orders/export-orders",
            "oldHash": "orders_postordersexport",
            "title": "Export Orders",
            "method": "post"
          },
          "PostOrdersIdFulfillmentsFulfillment_idMarkAsDelivered": {
            "slug": "mark-delivered",
            "path": "/admin/orders/mark-delivered",
            "oldHash": "orders_postordersidfulfillmentsfulfillment_idmarkasdelivered",
            "title": "Mark Delivered",
            "method": "post"
          },
          "PostOrdersIdTransfer": {
            "slug": "request-transfer",
            "path": "/admin/orders/request-transfer",
            "oldHash": "orders_postordersidtransfer",
            "title": "Request Transfer",
            "method": "post"
          },
          "PostOrdersIdTransferGuest": {
            "slug": "transfer-to-guest",
            "path": "/admin/orders/transfer-to-guest",
            "oldHash": "orders_postordersidtransferguest",
            "title": "Transfer to Guest",
            "method": "post"
          },
          "PostOrdersId": {
            "slug": "update-order",
            "path": "/admin/orders/update-order",
            "oldHash": "orders_postordersid",
            "title": "Update Order",
            "method": "post"
          }
        }
      },
      "payment-collections": {
        "name": "Payment Collections",
        "path": "/admin/payment-collections",
        "schemaPath": "/admin/payment-collections/schema",
        "operations": {
          "PostPaymentCollections": {
            "slug": "create-payment-collection",
            "path": "/admin/payment-collections/create-payment-collection",
            "oldHash": "payment-collections_postpaymentcollections",
            "title": "Create Payment Collection",
            "method": "post"
          },
          "PostPaymentCollectionsIdPaymentSessions": {
            "slug": "initialize-payment-session",
            "path": "/admin/payment-collections/initialize-payment-session",
            "oldHash": "payment-collections_postpaymentcollectionsidpaymentsessions",
            "title": "Initialize Payment Session",
            "method": "post"
          },
          "PostPaymentCollectionsIdMarkAsPaid": {
            "slug": "mark-as-paid",
            "path": "/admin/payment-collections/mark-as-paid",
            "oldHash": "payment-collections_postpaymentcollectionsidmarkaspaid",
            "title": "Mark as Paid",
            "method": "post"
          },
          "DeletePaymentCollectionsId": {
            "slug": "delete-a-payment-collection",
            "path": "/admin/payment-collections/delete-a-payment-collection",
            "oldHash": "payment-collections_deletepaymentcollectionsid",
            "title": "Delete a Payment Collection",
            "method": "delete"
          }
        }
      },
      "payments": {
        "name": "Payments",
        "path": "/admin/payments",
        "schemaPath": "/admin/payments/schema",
        "operations": {
          "GetPaymentsId": {
            "slug": "get-a-payment",
            "path": "/admin/payments/get-a-payment",
            "oldHash": "payments_getpaymentsid",
            "title": "Get a Payment",
            "method": "get"
          },
          "GetPaymentsPaymentProviders": {
            "slug": "list-payment-providers",
            "path": "/admin/payments/list-payment-providers",
            "oldHash": "payments_getpaymentspaymentproviders",
            "title": "List Payment Providers",
            "method": "get"
          },
          "GetPayments": {
            "slug": "list-payments",
            "path": "/admin/payments/list-payments",
            "oldHash": "payments_getpayments",
            "title": "List Payments",
            "method": "get"
          },
          "PostPaymentsIdCapture": {
            "slug": "capture-payment",
            "path": "/admin/payments/capture-payment",
            "oldHash": "payments_postpaymentsidcapture",
            "title": "Capture Payment",
            "method": "post"
          },
          "PostPaymentsIdRefund": {
            "slug": "refund-payment",
            "path": "/admin/payments/refund-payment",
            "oldHash": "payments_postpaymentsidrefund",
            "title": "Refund Payment",
            "method": "post"
          }
        }
      },
      "plugins": {
        "name": "Plugins",
        "path": "/admin/plugins",
        "schemaPath": "/admin/plugins/schema",
        "operations": {
          "GetPlugins": {
            "slug": "list-plugins",
            "path": "/admin/plugins/list-plugins",
            "oldHash": "plugins_getplugins",
            "title": "List Plugins",
            "method": "get"
          }
        }
      },
      "price-lists": {
        "name": "Price Lists",
        "path": "/admin/price-lists",
        "schemaPath": "/admin/price-lists/schema",
        "operations": {
          "GetPriceListsId": {
            "slug": "get-a-price-list",
            "path": "/admin/price-lists/get-a-price-list",
            "oldHash": "price-lists_getpricelistsid",
            "title": "Get a Price List",
            "method": "get"
          },
          "GetPriceLists": {
            "slug": "list-price-lists",
            "path": "/admin/price-lists/list-price-lists",
            "oldHash": "price-lists_getpricelists",
            "title": "List Price Lists",
            "method": "get"
          },
          "GetPriceListsIdPrices": {
            "slug": "list-prices",
            "path": "/admin/price-lists/list-prices",
            "oldHash": "price-lists_getpricelistsidprices",
            "title": "List Prices",
            "method": "get"
          },
          "PostPriceLists": {
            "slug": "create-price-list",
            "path": "/admin/price-lists/create-price-list",
            "oldHash": "price-lists_postpricelists",
            "title": "Create Price List",
            "method": "post"
          },
          "PostPriceListsIdPricesBatch": {
            "slug": "manage-prices",
            "path": "/admin/price-lists/manage-prices",
            "oldHash": "price-lists_postpricelistsidpricesbatch",
            "title": "Manage Prices",
            "method": "post"
          },
          "PostPriceListsIdProducts": {
            "slug": "remove-products-from-price-list",
            "path": "/admin/price-lists/remove-products-from-price-list",
            "oldHash": "price-lists_postpricelistsidproducts",
            "title": "Remove Products from Price List",
            "method": "post"
          },
          "PostPriceListsId": {
            "slug": "update-a-price-list",
            "path": "/admin/price-lists/update-a-price-list",
            "oldHash": "price-lists_postpricelistsid",
            "title": "Update a Price List",
            "method": "post"
          },
          "DeletePriceListsId": {
            "slug": "delete-a-price-list",
            "path": "/admin/price-lists/delete-a-price-list",
            "oldHash": "price-lists_deletepricelistsid",
            "title": "Delete a Price List",
            "method": "delete"
          }
        }
      },
      "price-preferences": {
        "name": "Price Preferences",
        "path": "/admin/price-preferences",
        "schemaPath": "/admin/price-preferences/schema",
        "operations": {
          "GetPricePreferencesId": {
            "slug": "get-a-price-preference",
            "path": "/admin/price-preferences/get-a-price-preference",
            "oldHash": "price-preferences_getpricepreferencesid",
            "title": "Get a Price Preference",
            "method": "get"
          },
          "GetPricePreferences": {
            "slug": "list-price-preferences",
            "path": "/admin/price-preferences/list-price-preferences",
            "oldHash": "price-preferences_getpricepreferences",
            "title": "List Price Preferences",
            "method": "get"
          },
          "PostPricePreferences": {
            "slug": "create-price-preference",
            "path": "/admin/price-preferences/create-price-preference",
            "oldHash": "price-preferences_postpricepreferences",
            "title": "Create Price Preference",
            "method": "post"
          },
          "PostPricePreferencesId": {
            "slug": "update-a-price-preference",
            "path": "/admin/price-preferences/update-a-price-preference",
            "oldHash": "price-preferences_postpricepreferencesid",
            "title": "Update a Price Preference",
            "method": "post"
          },
          "DeletePricePreferencesId": {
            "slug": "delete-a-price-preference",
            "path": "/admin/price-preferences/delete-a-price-preference",
            "oldHash": "price-preferences_deletepricepreferencesid",
            "title": "Delete a Price Preference",
            "method": "delete"
          }
        }
      },
      "product-categories": {
        "name": "Product Categories",
        "path": "/admin/product-categories",
        "schemaPath": "/admin/product-categories/schema",
        "operations": {
          "GetProductCategoriesId": {
            "slug": "get-a-product-category",
            "path": "/admin/product-categories/get-a-product-category",
            "oldHash": "product-categories_getproductcategoriesid",
            "title": "Get a Product Category",
            "method": "get"
          },
          "GetProductCategories": {
            "slug": "list-product-categories",
            "path": "/admin/product-categories/list-product-categories",
            "oldHash": "product-categories_getproductcategories",
            "title": "List Product Categories",
            "method": "get"
          },
          "PostProductCategories": {
            "slug": "create-product-category",
            "path": "/admin/product-categories/create-product-category",
            "oldHash": "product-categories_postproductcategories",
            "title": "Create Product Category",
            "method": "post"
          },
          "PostProductCategoriesIdProducts": {
            "slug": "manage-products",
            "path": "/admin/product-categories/manage-products",
            "oldHash": "product-categories_postproductcategoriesidproducts",
            "title": "Manage Products",
            "method": "post"
          },
          "PostProductCategoriesId": {
            "slug": "update-a-product-category",
            "path": "/admin/product-categories/update-a-product-category",
            "oldHash": "product-categories_postproductcategoriesid",
            "title": "Update a Product Category",
            "method": "post"
          },
          "DeleteProductCategoriesId": {
            "slug": "delete-a-product-category",
            "path": "/admin/product-categories/delete-a-product-category",
            "oldHash": "product-categories_deleteproductcategoriesid",
            "title": "Delete a Product Category",
            "method": "delete"
          }
        }
      },
      "product-options": {
        "name": "Product Options",
        "path": "/admin/product-options",
        "schemaPath": "/admin/product-options/schema",
        "operations": {
          "GetProductOptionsId": {
            "slug": "get-a-product-option",
            "path": "/admin/product-options/get-a-product-option",
            "oldHash": "product-options_getproductoptionsid",
            "title": "Get a Product Option",
            "method": "get"
          },
          "GetProductOptionsIdValuesValue_id": {
            "slug": "get-product-option-value",
            "path": "/admin/product-options/get-product-option-value",
            "oldHash": "product-options_getproductoptionsidvaluesvalue_id",
            "title": "Get Product Option Value",
            "method": "get"
          },
          "GetProductOptionsIdValues": {
            "slug": "list-product-option-values",
            "path": "/admin/product-options/list-product-option-values",
            "oldHash": "product-options_getproductoptionsidvalues",
            "title": "List Product Option Values",
            "method": "get"
          },
          "GetProductOptions": {
            "slug": "list-product-options",
            "path": "/admin/product-options/list-product-options",
            "oldHash": "product-options_getproductoptions",
            "title": "List Product Options",
            "method": "get"
          },
          "PostProductOptions": {
            "slug": "create-product-option",
            "path": "/admin/product-options/create-product-option",
            "oldHash": "product-options_postproductoptions",
            "title": "Create Product Option",
            "method": "post"
          },
          "PostProductOptionsId": {
            "slug": "update-a-product-option",
            "path": "/admin/product-options/update-a-product-option",
            "oldHash": "product-options_postproductoptionsid",
            "title": "Update a Product Option",
            "method": "post"
          },
          "PostProductOptionsIdValuesValue_id": {
            "slug": "update-product-option-value",
            "path": "/admin/product-options/update-product-option-value",
            "oldHash": "product-options_postproductoptionsidvaluesvalue_id",
            "title": "Update Product Option Value",
            "method": "post"
          },
          "DeleteProductOptionsId": {
            "slug": "delete-a-product-option",
            "path": "/admin/product-options/delete-a-product-option",
            "oldHash": "product-options_deleteproductoptionsid",
            "title": "Delete a Product Option",
            "method": "delete"
          },
          "DeleteProductOptionsIdValuesValue_id": {
            "slug": "remove-value-from-product-option",
            "path": "/admin/product-options/remove-value-from-product-option",
            "oldHash": "product-options_deleteproductoptionsidvaluesvalue_id",
            "title": "Remove Value from Product Option",
            "method": "delete"
          }
        }
      },
      "product-tags": {
        "name": "Product Tags",
        "path": "/admin/product-tags",
        "schemaPath": "/admin/product-tags/schema",
        "operations": {
          "GetProductTagsId": {
            "slug": "get-a-product-tag",
            "path": "/admin/product-tags/get-a-product-tag",
            "oldHash": "product-tags_getproducttagsid",
            "title": "Get a Product Tag",
            "method": "get"
          },
          "GetProductTags": {
            "slug": "list-product-tags",
            "path": "/admin/product-tags/list-product-tags",
            "oldHash": "product-tags_getproducttags",
            "title": "List Product Tags",
            "method": "get"
          },
          "PostProductTags": {
            "slug": "create-product-tag",
            "path": "/admin/product-tags/create-product-tag",
            "oldHash": "product-tags_postproducttags",
            "title": "Create Product Tag",
            "method": "post"
          },
          "PostProductTagsId": {
            "slug": "update-a-product-tag",
            "path": "/admin/product-tags/update-a-product-tag",
            "oldHash": "product-tags_postproducttagsid",
            "title": "Update a Product Tag",
            "method": "post"
          },
          "DeleteProductTagsId": {
            "slug": "delete-a-product-tag",
            "path": "/admin/product-tags/delete-a-product-tag",
            "oldHash": "product-tags_deleteproducttagsid",
            "title": "Delete a Product Tag",
            "method": "delete"
          }
        }
      },
      "product-types": {
        "name": "Product Types",
        "path": "/admin/product-types",
        "schemaPath": "/admin/product-types/schema",
        "operations": {
          "GetProductTypesId": {
            "slug": "get-a-product-type",
            "path": "/admin/product-types/get-a-product-type",
            "oldHash": "product-types_getproducttypesid",
            "title": "Get a Product Type",
            "method": "get"
          },
          "GetProductTypes": {
            "slug": "list-product-types",
            "path": "/admin/product-types/list-product-types",
            "oldHash": "product-types_getproducttypes",
            "title": "List Product Types",
            "method": "get"
          },
          "PostProductTypes": {
            "slug": "create-product-type",
            "path": "/admin/product-types/create-product-type",
            "oldHash": "product-types_postproducttypes",
            "title": "Create Product Type",
            "method": "post"
          },
          "PostProductTypesId": {
            "slug": "update-a-product-type",
            "path": "/admin/product-types/update-a-product-type",
            "oldHash": "product-types_postproducttypesid",
            "title": "Update a Product Type",
            "method": "post"
          },
          "DeleteProductTypesId": {
            "slug": "delete-a-product-type",
            "path": "/admin/product-types/delete-a-product-type",
            "oldHash": "product-types_deleteproducttypesid",
            "title": "Delete a Product Type",
            "method": "delete"
          }
        }
      },
      "product-variants": {
        "name": "Product Variants",
        "path": "/admin/product-variants",
        "schemaPath": "/admin/product-variants/schema",
        "operations": {
          "GetProductVariants": {
            "slug": "list-product-variants",
            "path": "/admin/product-variants/list-product-variants",
            "oldHash": "product-variants_getproductvariants",
            "title": "List Product Variants",
            "method": "get"
          }
        }
      },
      "products": {
        "name": "Products",
        "path": "/admin/products",
        "schemaPath": "/admin/products/schema",
        "operations": {
          "GetProductsId": {
            "slug": "get-a-product",
            "path": "/admin/products/get-a-product",
            "oldHash": "products_getproductsid",
            "title": "Get a Product",
            "method": "get"
          },
          "GetProductsIdVariantsVariant_id": {
            "slug": "get-variant",
            "path": "/admin/products/get-variant",
            "oldHash": "products_getproductsidvariantsvariant_id",
            "title": "Get Variant",
            "method": "get"
          },
          "GetProductsIdOptions": {
            "slug": "list-options",
            "path": "/admin/products/list-options",
            "oldHash": "products_getproductsidoptions",
            "title": "List Options",
            "method": "get"
          },
          "GetProducts": {
            "slug": "list-products",
            "path": "/admin/products/list-products",
            "oldHash": "products_getproducts",
            "title": "List Products",
            "method": "get"
          },
          "GetProductsIdVariants": {
            "slug": "list-variants",
            "path": "/admin/products/list-variants",
            "oldHash": "products_getproductsidvariants",
            "title": "List Variants",
            "method": "get"
          },
          "PostProductsIdOptionsBatch": {
            "slug": "add-options-to-product",
            "path": "/admin/products/add-options-to-product",
            "oldHash": "products_postproductsidoptionsbatch",
            "title": "Add Options to Product",
            "method": "post"
          },
          "PostProductsIdVariantsVariant_idInventoryItems": {
            "slug": "associate-variants-inventory",
            "path": "/admin/products/associate-variants-inventory",
            "oldHash": "products_postproductsidvariantsvariant_idinventoryitems",
            "title": "Associate Variant's Inventory",
            "method": "post"
          },
          "PostProductsImportTransaction_idConfirm": {
            "slug": "confirm-product-import",
            "path": "/admin/products/confirm-product-import",
            "oldHash": "products_postproductsimporttransaction_idconfirm",
            "title": "Confirm Product Import",
            "method": "post"
          },
          "PostProductsImportsTransaction_idConfirm": {
            "slug": "confirm-product-import-2",
            "path": "/admin/products/confirm-product-import-2",
            "oldHash": "products_postproductsimportstransaction_idconfirm",
            "title": "Confirm Product Import",
            "method": "post"
          },
          "PostProductsIdVariants": {
            "slug": "create-variant",
            "path": "/admin/products/create-variant",
            "oldHash": "products_postproductsidvariants",
            "title": "Create Variant",
            "method": "post"
          },
          "PostProducts": {
            "slug": "create-product",
            "path": "/admin/products/create-product",
            "oldHash": "products_postproducts",
            "title": "Create Product",
            "method": "post"
          },
          "PostProductsImport": {
            "slug": "create-product-import",
            "path": "/admin/products/create-product-import",
            "oldHash": "products_postproductsimport",
            "title": "Create Product Import",
            "method": "post"
          },
          "PostProductsImports": {
            "slug": "create-product-import-2",
            "path": "/admin/products/create-product-import-2",
            "oldHash": "products_postproductsimports",
            "title": "Create Product Import",
            "method": "post"
          },
          "PostProductsExport": {
            "slug": "export-products",
            "path": "/admin/products/export-products",
            "oldHash": "products_postproductsexport",
            "title": "Export Products",
            "method": "post"
          },
          "PostProductsIdVariantsVariant_idImagesBatch": {
            "slug": "manage-images-of-product-variant",
            "path": "/admin/products/manage-images-of-product-variant",
            "oldHash": "products_postproductsidvariantsvariant_idimagesbatch",
            "title": "Manage Images of Product Variant",
            "method": "post"
          },
          "PostProductsBatch": {
            "slug": "manage-products",
            "path": "/admin/products/manage-products",
            "oldHash": "products_postproductsbatch",
            "title": "Manage Products",
            "method": "post"
          },
          "PostProductsIdVariantsBatch": {
            "slug": "manage-variants-in-a-product",
            "path": "/admin/products/manage-variants-in-a-product",
            "oldHash": "products_postproductsidvariantsbatch",
            "title": "Manage Variants in a Product",
            "method": "post"
          },
          "PostProductsIdVariantsInventoryItemsBatch": {
            "slug": "manage-variants-inventory",
            "path": "/admin/products/manage-variants-inventory",
            "oldHash": "products_postproductsidvariantsinventoryitemsbatch",
            "title": "Manage Variants Inventory",
            "method": "post"
          },
          "PostProductsIdImagesImage_idVariantsBatch": {
            "slug": "manage-variants-of-product-image",
            "path": "/admin/products/manage-variants-of-product-image",
            "oldHash": "products_postproductsidimagesimage_idvariantsbatch",
            "title": "Manage Variants of Product Image",
            "method": "post"
          },
          "PostProductsId": {
            "slug": "update-a-product",
            "path": "/admin/products/update-a-product",
            "oldHash": "products_postproductsid",
            "title": "Update a Product",
            "method": "post"
          },
          "PostProductsIdVariantsVariant_id": {
            "slug": "update-variant",
            "path": "/admin/products/update-variant",
            "oldHash": "products_postproductsidvariantsvariant_id",
            "title": "Update Variant",
            "method": "post"
          },
          "PostProductsIdVariantsVariant_idInventoryItemsInventory_item_id": {
            "slug": "update-product-variants-inventory-details",
            "path": "/admin/products/update-product-variants-inventory-details",
            "oldHash": "products_postproductsidvariantsvariant_idinventoryitemsinventory_item_id",
            "title": "Update Product Variant's Inventory Details",
            "method": "post"
          },
          "DeleteProductsId": {
            "slug": "delete-a-product",
            "path": "/admin/products/delete-a-product",
            "oldHash": "products_deleteproductsid",
            "title": "Delete a Product",
            "method": "delete"
          },
          "DeleteProductsIdVariantsVariant_id": {
            "slug": "delete-variant",
            "path": "/admin/products/delete-variant",
            "oldHash": "products_deleteproductsidvariantsvariant_id",
            "title": "Delete Variant",
            "method": "delete"
          },
          "DeleteProductsIdVariantsVariant_idInventoryItemsInventory_item_id": {
            "slug": "remove-inventory-item",
            "path": "/admin/products/remove-inventory-item",
            "oldHash": "products_deleteproductsidvariantsvariant_idinventoryitemsinventory_item_id",
            "title": "Remove Inventory Item",
            "method": "delete"
          }
        }
      },
      "promotions": {
        "name": "Promotions",
        "path": "/admin/promotions",
        "schemaPath": "/admin/promotions/schema",
        "operations": {
          "GetPromotionsId": {
            "slug": "get-a-promotion",
            "path": "/admin/promotions/get-a-promotion",
            "oldHash": "promotions_getpromotionsid",
            "title": "Get a Promotion",
            "method": "get"
          },
          "GetPromotions": {
            "slug": "list-promotions",
            "path": "/admin/promotions/list-promotions",
            "oldHash": "promotions_getpromotions",
            "title": "List Promotions",
            "method": "get"
          },
          "GetPromotionsRuleAttributeOptionsRule_type": {
            "slug": "list-potential-rule-attributes",
            "path": "/admin/promotions/list-potential-rule-attributes",
            "oldHash": "promotions_getpromotionsruleattributeoptionsrule_type",
            "title": "List Potential Rule Attributes",
            "method": "get"
          },
          "GetPromotionsRuleValueOptionsRule_typeRule_attribute_id": {
            "slug": "list-rule-values",
            "path": "/admin/promotions/list-rule-values",
            "oldHash": "promotions_getpromotionsrulevalueoptionsrule_typerule_attribute_id",
            "title": "List Rule Values",
            "method": "get"
          },
          "GetPromotionsIdRule_type": {
            "slug": "list-rules",
            "path": "/admin/promotions/list-rules",
            "oldHash": "promotions_getpromotionsidrule_type",
            "title": "List Rules",
            "method": "get"
          },
          "PostPromotions": {
            "slug": "create-promotion",
            "path": "/admin/promotions/create-promotion",
            "oldHash": "promotions_postpromotions",
            "title": "Create Promotion",
            "method": "post"
          },
          "PostPromotionsIdRulesBatch": {
            "slug": "manage-rules",
            "path": "/admin/promotions/manage-rules",
            "oldHash": "promotions_postpromotionsidrulesbatch",
            "title": "Manage Rules",
            "method": "post"
          },
          "PostPromotionsIdTargetRulesBatch": {
            "slug": "manage-target-rules",
            "path": "/admin/promotions/manage-target-rules",
            "oldHash": "promotions_postpromotionsidtargetrulesbatch",
            "title": "Manage Target Rules",
            "method": "post"
          },
          "PostPromotionsIdBuyRulesBatch": {
            "slug": "manage-buy-rules",
            "path": "/admin/promotions/manage-buy-rules",
            "oldHash": "promotions_postpromotionsidbuyrulesbatch",
            "title": "Manage Buy Rules",
            "method": "post"
          },
          "PostPromotionsId": {
            "slug": "update-a-promotion",
            "path": "/admin/promotions/update-a-promotion",
            "oldHash": "promotions_postpromotionsid",
            "title": "Update a Promotion",
            "method": "post"
          },
          "DeletePromotionsId": {
            "slug": "delete-a-promotion",
            "path": "/admin/promotions/delete-a-promotion",
            "oldHash": "promotions_deletepromotionsid",
            "title": "Delete a Promotion",
            "method": "delete"
          }
        }
      },
      "property-labels": {
        "name": "Property Labels",
        "path": "/admin/property-labels",
        "schemaPath": "/admin/property-labels/schema",
        "operations": {
          "GetPropertyLabelsId": {
            "slug": "get-a-property-label",
            "path": "/admin/property-labels/get-a-property-label",
            "oldHash": "property-labels_getpropertylabelsid",
            "title": "Get a Property Label",
            "method": "get"
          },
          "GetPropertyLabels": {
            "slug": "list-property-labels",
            "path": "/admin/property-labels/list-property-labels",
            "oldHash": "property-labels_getpropertylabels",
            "title": "List Property Labels",
            "method": "get"
          },
          "PostPropertyLabels": {
            "slug": "create-property-label",
            "path": "/admin/property-labels/create-property-label",
            "oldHash": "property-labels_postpropertylabels",
            "title": "Create Property Label",
            "method": "post"
          },
          "PostPropertyLabelsBatch": {
            "slug": "create-property-label-2",
            "path": "/admin/property-labels/create-property-label-2",
            "oldHash": "property-labels_postpropertylabelsbatch",
            "title": "Create Property Label",
            "method": "post"
          },
          "PostPropertyLabelsId": {
            "slug": "update-a-property-label",
            "path": "/admin/property-labels/update-a-property-label",
            "oldHash": "property-labels_postpropertylabelsid",
            "title": "Update a Property Label",
            "method": "post"
          },
          "DeletePropertyLabelsId": {
            "slug": "delete-a-property-label",
            "path": "/admin/property-labels/delete-a-property-label",
            "oldHash": "property-labels_deletepropertylabelsid",
            "title": "Delete a Property Label",
            "method": "delete"
          }
        }
      },
      "refund-reasons": {
        "name": "Refund Reasons",
        "path": "/admin/refund-reasons",
        "schemaPath": "/admin/refund-reasons/schema",
        "operations": {
          "GetRefundReasonsId": {
            "slug": "get-a-refund-reason",
            "path": "/admin/refund-reasons/get-a-refund-reason",
            "oldHash": "refund-reasons_getrefundreasonsid",
            "title": "Get a Refund Reason",
            "method": "get"
          },
          "GetRefundReasons": {
            "slug": "list-refund-reasons",
            "path": "/admin/refund-reasons/list-refund-reasons",
            "oldHash": "refund-reasons_getrefundreasons",
            "title": "List Refund Reasons",
            "method": "get"
          },
          "PostRefundReasons": {
            "slug": "create-refund-reason",
            "path": "/admin/refund-reasons/create-refund-reason",
            "oldHash": "refund-reasons_postrefundreasons",
            "title": "Create Refund Reason",
            "method": "post"
          },
          "PostRefundReasonsId": {
            "slug": "update-a-refund-reason",
            "path": "/admin/refund-reasons/update-a-refund-reason",
            "oldHash": "refund-reasons_postrefundreasonsid",
            "title": "Update a Refund Reason",
            "method": "post"
          },
          "DeleteRefundReasonsId": {
            "slug": "delete-a-refund-reason",
            "path": "/admin/refund-reasons/delete-a-refund-reason",
            "oldHash": "refund-reasons_deleterefundreasonsid",
            "title": "Delete a Refund Reason",
            "method": "delete"
          }
        }
      },
      "regions": {
        "name": "Regions",
        "path": "/admin/regions",
        "schemaPath": "/admin/regions/schema",
        "operations": {
          "GetRegionsId": {
            "slug": "get-a-region",
            "path": "/admin/regions/get-a-region",
            "oldHash": "regions_getregionsid",
            "title": "Get a Region",
            "method": "get"
          },
          "GetRegions": {
            "slug": "list-regions",
            "path": "/admin/regions/list-regions",
            "oldHash": "regions_getregions",
            "title": "List Regions",
            "method": "get"
          },
          "PostRegions": {
            "slug": "create-region",
            "path": "/admin/regions/create-region",
            "oldHash": "regions_postregions",
            "title": "Create Region",
            "method": "post"
          },
          "PostRegionsId": {
            "slug": "update-a-region",
            "path": "/admin/regions/update-a-region",
            "oldHash": "regions_postregionsid",
            "title": "Update a Region",
            "method": "post"
          },
          "DeleteRegionsId": {
            "slug": "delete-a-region",
            "path": "/admin/regions/delete-a-region",
            "oldHash": "regions_deleteregionsid",
            "title": "Delete a Region",
            "method": "delete"
          }
        }
      },
      "reservations": {
        "name": "Reservations",
        "path": "/admin/reservations",
        "schemaPath": "/admin/reservations/schema",
        "operations": {
          "GetReservationsId": {
            "slug": "get-a-reservation",
            "path": "/admin/reservations/get-a-reservation",
            "oldHash": "reservations_getreservationsid",
            "title": "Get a Reservation",
            "method": "get"
          },
          "GetReservations": {
            "slug": "list-reservations",
            "path": "/admin/reservations/list-reservations",
            "oldHash": "reservations_getreservations",
            "title": "List Reservations",
            "method": "get"
          },
          "PostReservations": {
            "slug": "create-reservation",
            "path": "/admin/reservations/create-reservation",
            "oldHash": "reservations_postreservations",
            "title": "Create Reservation",
            "method": "post"
          },
          "PostReservationsId": {
            "slug": "update-a-reservation",
            "path": "/admin/reservations/update-a-reservation",
            "oldHash": "reservations_postreservationsid",
            "title": "Update a Reservation",
            "method": "post"
          },
          "DeleteReservationsId": {
            "slug": "delete-a-reservation",
            "path": "/admin/reservations/delete-a-reservation",
            "oldHash": "reservations_deletereservationsid",
            "title": "Delete a Reservation",
            "method": "delete"
          }
        }
      },
      "return-reasons": {
        "name": "Return Reasons",
        "path": "/admin/return-reasons",
        "schemaPath": "/admin/return-reasons/schema",
        "operations": {
          "GetReturnReasonsId": {
            "slug": "get-a-return-reason",
            "path": "/admin/return-reasons/get-a-return-reason",
            "oldHash": "return-reasons_getreturnreasonsid",
            "title": "Get a Return Reason",
            "method": "get"
          },
          "GetReturnReasons": {
            "slug": "list-return-reasons",
            "path": "/admin/return-reasons/list-return-reasons",
            "oldHash": "return-reasons_getreturnreasons",
            "title": "List Return Reasons",
            "method": "get"
          },
          "PostReturnReasons": {
            "slug": "create-return-reason",
            "path": "/admin/return-reasons/create-return-reason",
            "oldHash": "return-reasons_postreturnreasons",
            "title": "Create Return Reason",
            "method": "post"
          },
          "PostReturnReasonsId": {
            "slug": "update-a-return-reason",
            "path": "/admin/return-reasons/update-a-return-reason",
            "oldHash": "return-reasons_postreturnreasonsid",
            "title": "Update a Return Reason",
            "method": "post"
          },
          "DeleteReturnReasonsId": {
            "slug": "delete-a-return-reason",
            "path": "/admin/return-reasons/delete-a-return-reason",
            "oldHash": "return-reasons_deletereturnreasonsid",
            "title": "Delete a Return Reason",
            "method": "delete"
          }
        }
      },
      "returns": {
        "name": "Returns",
        "path": "/admin/returns",
        "schemaPath": "/admin/returns/schema",
        "operations": {
          "GetReturnsId": {
            "slug": "get-a-return",
            "path": "/admin/returns/get-a-return",
            "oldHash": "returns_getreturnsid",
            "title": "Get a Return",
            "method": "get"
          },
          "GetReturns": {
            "slug": "list-returns",
            "path": "/admin/returns/list-returns",
            "oldHash": "returns_getreturns",
            "title": "List Returns",
            "method": "get"
          },
          "PostReturnsIdShippingMethod": {
            "slug": "add-shipping-method",
            "path": "/admin/returns/add-shipping-method",
            "oldHash": "returns_postreturnsidshippingmethod",
            "title": "Add Shipping Method",
            "method": "post"
          },
          "PostReturnsIdDismissItems": {
            "slug": "add-damaged-items",
            "path": "/admin/returns/add-damaged-items",
            "oldHash": "returns_postreturnsiddismissitems",
            "title": "Add Damaged Items",
            "method": "post"
          },
          "PostReturnsIdReceiveItems": {
            "slug": "add-received-items",
            "path": "/admin/returns/add-received-items",
            "oldHash": "returns_postreturnsidreceiveitems",
            "title": "Add Received Items",
            "method": "post"
          },
          "PostReturnsIdRequestItems": {
            "slug": "add-items",
            "path": "/admin/returns/add-items",
            "oldHash": "returns_postreturnsidrequestitems",
            "title": "Add Items",
            "method": "post"
          },
          "PostReturnsIdCancel": {
            "slug": "cancel-a-return",
            "path": "/admin/returns/cancel-a-return",
            "oldHash": "returns_postreturnsidcancel",
            "title": "Cancel a return.",
            "method": "post"
          },
          "PostReturnsIdReceiveConfirm": {
            "slug": "confirm-return-receival",
            "path": "/admin/returns/confirm-return-receival",
            "oldHash": "returns_postreturnsidreceiveconfirm",
            "title": "Confirm Return Receival",
            "method": "post"
          },
          "PostReturnsIdRequest": {
            "slug": "confirm-return-request",
            "path": "/admin/returns/confirm-return-request",
            "oldHash": "returns_postreturnsidrequest",
            "title": "Confirm Return Request",
            "method": "post"
          },
          "PostReturns": {
            "slug": "create-return",
            "path": "/admin/returns/create-return",
            "oldHash": "returns_postreturns",
            "title": "Create Return",
            "method": "post"
          },
          "PostReturnsIdReceive": {
            "slug": "start-return-receival",
            "path": "/admin/returns/start-return-receival",
            "oldHash": "returns_postreturnsidreceive",
            "title": "Start Return Receival",
            "method": "post"
          },
          "PostReturnsIdReceiveItemsAction_id": {
            "slug": "update-received-item",
            "path": "/admin/returns/update-received-item",
            "oldHash": "returns_postreturnsidreceiveitemsaction_id",
            "title": "Update Received Item",
            "method": "post"
          },
          "PostReturnsId": {
            "slug": "update-a-return",
            "path": "/admin/returns/update-a-return",
            "oldHash": "returns_postreturnsid",
            "title": "Update a Return",
            "method": "post"
          },
          "PostReturnsIdShippingMethodAction_id": {
            "slug": "update-shipping-method",
            "path": "/admin/returns/update-shipping-method",
            "oldHash": "returns_postreturnsidshippingmethodaction_id",
            "title": "Update Shipping Method",
            "method": "post"
          },
          "PostReturnsIdDismissItemsAction_id": {
            "slug": "update-damaged-item",
            "path": "/admin/returns/update-damaged-item",
            "oldHash": "returns_postreturnsiddismissitemsaction_id",
            "title": "Update Damaged Item",
            "method": "post"
          },
          "PostReturnsIdRequestItemsAction_id": {
            "slug": "update-requested-item",
            "path": "/admin/returns/update-requested-item",
            "oldHash": "returns_postreturnsidrequestitemsaction_id",
            "title": "Update Requested Item",
            "method": "post"
          },
          "DeleteReturnsIdReceive": {
            "slug": "cancel-return-receival",
            "path": "/admin/returns/cancel-return-receival",
            "oldHash": "returns_deletereturnsidreceive",
            "title": "Cancel Return Receival",
            "method": "delete"
          },
          "DeleteReturnsIdRequest": {
            "slug": "cancel-return-request",
            "path": "/admin/returns/cancel-return-request",
            "oldHash": "returns_deletereturnsidrequest",
            "title": "Cancel Return Request",
            "method": "delete"
          },
          "DeleteReturnsIdReceiveItemsAction_id": {
            "slug": "remove-received-item",
            "path": "/admin/returns/remove-received-item",
            "oldHash": "returns_deletereturnsidreceiveitemsaction_id",
            "title": "Remove Received Item",
            "method": "delete"
          },
          "DeleteReturnsIdDismissItemsAction_id": {
            "slug": "remove-damaged-item",
            "path": "/admin/returns/remove-damaged-item",
            "oldHash": "returns_deletereturnsiddismissitemsaction_id",
            "title": "Remove Damaged Item",
            "method": "delete"
          },
          "DeleteReturnsIdRequestItemsAction_id": {
            "slug": "remove-item",
            "path": "/admin/returns/remove-item",
            "oldHash": "returns_deletereturnsidrequestitemsaction_id",
            "title": "Remove Item",
            "method": "delete"
          },
          "DeleteReturnsIdShippingMethodAction_id": {
            "slug": "remove-shipping-method",
            "path": "/admin/returns/remove-shipping-method",
            "oldHash": "returns_deletereturnsidshippingmethodaction_id",
            "title": "Remove Shipping Method",
            "method": "delete"
          }
        }
      },
      "sales-channels": {
        "name": "Sales Channels",
        "path": "/admin/sales-channels",
        "schemaPath": "/admin/sales-channels/schema",
        "operations": {
          "GetSalesChannelsId": {
            "slug": "get-a-sales-channel",
            "path": "/admin/sales-channels/get-a-sales-channel",
            "oldHash": "sales-channels_getsaleschannelsid",
            "title": "Get a Sales Channel",
            "method": "get"
          },
          "GetSalesChannels": {
            "slug": "list-sales-channels",
            "path": "/admin/sales-channels/list-sales-channels",
            "oldHash": "sales-channels_getsaleschannels",
            "title": "List Sales Channels",
            "method": "get"
          },
          "PostSalesChannels": {
            "slug": "create-sales-channel",
            "path": "/admin/sales-channels/create-sales-channel",
            "oldHash": "sales-channels_postsaleschannels",
            "title": "Create Sales Channel",
            "method": "post"
          },
          "PostSalesChannelsIdProducts": {
            "slug": "manage-products",
            "path": "/admin/sales-channels/manage-products",
            "oldHash": "sales-channels_postsaleschannelsidproducts",
            "title": "Manage Products",
            "method": "post"
          },
          "PostSalesChannelsId": {
            "slug": "update-a-sales-channel",
            "path": "/admin/sales-channels/update-a-sales-channel",
            "oldHash": "sales-channels_postsaleschannelsid",
            "title": "Update a Sales Channel",
            "method": "post"
          },
          "DeleteSalesChannelsId": {
            "slug": "delete-a-sales-channel",
            "path": "/admin/sales-channels/delete-a-sales-channel",
            "oldHash": "sales-channels_deletesaleschannelsid",
            "title": "Delete a Sales Channel",
            "method": "delete"
          }
        }
      },
      "shipping-option-types": {
        "name": "Shipping Option Types",
        "path": "/admin/shipping-option-types",
        "schemaPath": "/admin/shipping-option-types/schema",
        "operations": {
          "GetShippingOptionTypesId": {
            "slug": "get-a-shipping-option-type",
            "path": "/admin/shipping-option-types/get-a-shipping-option-type",
            "oldHash": "shipping-option-types_getshippingoptiontypesid",
            "title": "Get a Shipping Option Type",
            "method": "get"
          },
          "GetShippingOptionTypes": {
            "slug": "list-shipping-option-types",
            "path": "/admin/shipping-option-types/list-shipping-option-types",
            "oldHash": "shipping-option-types_getshippingoptiontypes",
            "title": "List Shipping Option Types",
            "method": "get"
          },
          "PostShippingOptionTypes": {
            "slug": "create-shipping-option-type",
            "path": "/admin/shipping-option-types/create-shipping-option-type",
            "oldHash": "shipping-option-types_postshippingoptiontypes",
            "title": "Create Shipping Option Type",
            "method": "post"
          },
          "PostShippingOptionTypesId": {
            "slug": "update-a-shipping-option-type",
            "path": "/admin/shipping-option-types/update-a-shipping-option-type",
            "oldHash": "shipping-option-types_postshippingoptiontypesid",
            "title": "Update a Shipping Option Type",
            "method": "post"
          },
          "DeleteShippingOptionTypesId": {
            "slug": "delete-shipping-option-type",
            "path": "/admin/shipping-option-types/delete-shipping-option-type",
            "oldHash": "shipping-option-types_deleteshippingoptiontypesid",
            "title": "Delete Shipping Option Type",
            "method": "delete"
          }
        }
      },
      "shipping-options": {
        "name": "Shipping Options",
        "path": "/admin/shipping-options",
        "schemaPath": "/admin/shipping-options/schema",
        "operations": {
          "GetShippingOptionsId": {
            "slug": "get-a-shipping-option",
            "path": "/admin/shipping-options/get-a-shipping-option",
            "oldHash": "shipping-options_getshippingoptionsid",
            "title": "Get a Shipping Option",
            "method": "get"
          },
          "GetShippingOptions": {
            "slug": "list-shipping-options",
            "path": "/admin/shipping-options/list-shipping-options",
            "oldHash": "shipping-options_getshippingoptions",
            "title": "List Shipping Options",
            "method": "get"
          },
          "PostShippingOptions": {
            "slug": "create-shipping-option",
            "path": "/admin/shipping-options/create-shipping-option",
            "oldHash": "shipping-options_postshippingoptions",
            "title": "Create Shipping Option",
            "method": "post"
          },
          "PostShippingOptionsIdRulesBatch": {
            "slug": "manage-rules",
            "path": "/admin/shipping-options/manage-rules",
            "oldHash": "shipping-options_postshippingoptionsidrulesbatch",
            "title": "Manage Rules",
            "method": "post"
          },
          "PostShippingOptionsId": {
            "slug": "update-a-shipping-option",
            "path": "/admin/shipping-options/update-a-shipping-option",
            "oldHash": "shipping-options_postshippingoptionsid",
            "title": "Update a Shipping Option",
            "method": "post"
          },
          "DeleteShippingOptionsId": {
            "slug": "delete-a-shipping-option",
            "path": "/admin/shipping-options/delete-a-shipping-option",
            "oldHash": "shipping-options_deleteshippingoptionsid",
            "title": "Delete a Shipping Option",
            "method": "delete"
          }
        }
      },
      "shipping-profiles": {
        "name": "Shipping Profiles",
        "path": "/admin/shipping-profiles",
        "schemaPath": "/admin/shipping-profiles/schema",
        "operations": {
          "GetShippingProfilesId": {
            "slug": "get-a-shipping-profile",
            "path": "/admin/shipping-profiles/get-a-shipping-profile",
            "oldHash": "shipping-profiles_getshippingprofilesid",
            "title": "Get a Shipping Profile",
            "method": "get"
          },
          "GetShippingProfiles": {
            "slug": "list-shipping-profiles",
            "path": "/admin/shipping-profiles/list-shipping-profiles",
            "oldHash": "shipping-profiles_getshippingprofiles",
            "title": "List Shipping Profiles",
            "method": "get"
          },
          "PostShippingProfiles": {
            "slug": "create-shipping-profile",
            "path": "/admin/shipping-profiles/create-shipping-profile",
            "oldHash": "shipping-profiles_postshippingprofiles",
            "title": "Create Shipping Profile",
            "method": "post"
          },
          "PostShippingProfilesId": {
            "slug": "update-a-shipping-profile",
            "path": "/admin/shipping-profiles/update-a-shipping-profile",
            "oldHash": "shipping-profiles_postshippingprofilesid",
            "title": "Update a Shipping Profile",
            "method": "post"
          },
          "DeleteShippingProfilesId": {
            "slug": "delete-a-shipping-profile",
            "path": "/admin/shipping-profiles/delete-a-shipping-profile",
            "oldHash": "shipping-profiles_deleteshippingprofilesid",
            "title": "Delete a Shipping Profile",
            "method": "delete"
          }
        }
      },
      "stock-locations": {
        "name": "Stock Locations",
        "path": "/admin/stock-locations",
        "schemaPath": "/admin/stock-locations/schema",
        "operations": {
          "GetStockLocationsId": {
            "slug": "get-a-stock-location",
            "path": "/admin/stock-locations/get-a-stock-location",
            "oldHash": "stock-locations_getstocklocationsid",
            "title": "Get a Stock Location",
            "method": "get"
          },
          "GetStockLocations": {
            "slug": "list-stock-locations",
            "path": "/admin/stock-locations/list-stock-locations",
            "oldHash": "stock-locations_getstocklocations",
            "title": "List Stock Locations",
            "method": "get"
          },
          "PostStockLocationsIdFulfillmentSets": {
            "slug": "add-fulfillment-set",
            "path": "/admin/stock-locations/add-fulfillment-set",
            "oldHash": "stock-locations_poststocklocationsidfulfillmentsets",
            "title": "Add Fulfillment Set",
            "method": "post"
          },
          "PostStockLocations": {
            "slug": "create-stock-location",
            "path": "/admin/stock-locations/create-stock-location",
            "oldHash": "stock-locations_poststocklocations",
            "title": "Create Stock Location",
            "method": "post"
          },
          "PostStockLocationsIdFulfillmentProviders": {
            "slug": "manage-fulfillment-providers",
            "path": "/admin/stock-locations/manage-fulfillment-providers",
            "oldHash": "stock-locations_poststocklocationsidfulfillmentproviders",
            "title": "Manage Fulfillment Providers",
            "method": "post"
          },
          "PostStockLocationsIdSalesChannels": {
            "slug": "manage-sales-channels",
            "path": "/admin/stock-locations/manage-sales-channels",
            "oldHash": "stock-locations_poststocklocationsidsaleschannels",
            "title": "Manage Sales Channels",
            "method": "post"
          },
          "PostStockLocationsId": {
            "slug": "update-a-stock-location",
            "path": "/admin/stock-locations/update-a-stock-location",
            "oldHash": "stock-locations_poststocklocationsid",
            "title": "Update a Stock Location",
            "method": "post"
          },
          "DeleteStockLocationsId": {
            "slug": "delete-a-stock-location",
            "path": "/admin/stock-locations/delete-a-stock-location",
            "oldHash": "stock-locations_deletestocklocationsid",
            "title": "Delete a Stock Location",
            "method": "delete"
          }
        }
      },
      "store-credit-accounts": {
        "name": "Store Credit Accounts",
        "path": "/admin/store-credit-accounts",
        "schemaPath": "/admin/store-credit-accounts/schema",
        "operations": {
          "GetStoreCreditAccountsId": {
            "slug": "get-a-store-credit-account",
            "path": "/admin/store-credit-accounts/get-a-store-credit-account",
            "oldHash": "store-credit-accounts_getstorecreditaccountsid",
            "title": "Get a Store Credit Account",
            "method": "get"
          },
          "GetStoreCreditAccounts": {
            "slug": "list-store-credit-accounts",
            "path": "/admin/store-credit-accounts/list-store-credit-accounts",
            "oldHash": "store-credit-accounts_getstorecreditaccounts",
            "title": "List Store Credit Accounts",
            "method": "get"
          },
          "GetStoreCreditAccountsIdTransactions": {
            "slug": "list-transactions",
            "path": "/admin/store-credit-accounts/list-transactions",
            "oldHash": "store-credit-accounts_getstorecreditaccountsidtransactions",
            "title": "List Transactions",
            "method": "get"
          },
          "PostStoreCreditAccountsIdCredit": {
            "slug": "add-credit-to-store-credit-account",
            "path": "/admin/store-credit-accounts/add-credit-to-store-credit-account",
            "oldHash": "store-credit-accounts_poststorecreditaccountsidcredit",
            "title": "Add Credit to Store Credit Account",
            "method": "post"
          },
          "PostStoreCreditAccounts": {
            "slug": "create-store-credit-account",
            "path": "/admin/store-credit-accounts/create-store-credit-account",
            "oldHash": "store-credit-accounts_poststorecreditaccounts",
            "title": "Create Store Credit Account",
            "method": "post"
          }
        }
      },
      "stores": {
        "name": "Stores",
        "path": "/admin/stores",
        "schemaPath": "/admin/stores/schema",
        "operations": {
          "GetStoresId": {
            "slug": "get-a-store",
            "path": "/admin/stores/get-a-store",
            "oldHash": "stores_getstoresid",
            "title": "Get a Store",
            "method": "get"
          },
          "GetStores": {
            "slug": "list-stores",
            "path": "/admin/stores/list-stores",
            "oldHash": "stores_getstores",
            "title": "List Stores",
            "method": "get"
          },
          "PostStoresId": {
            "slug": "update-a-store",
            "path": "/admin/stores/update-a-store",
            "oldHash": "stores_poststoresid",
            "title": "Update a Store",
            "method": "post"
          }
        }
      },
      "tax-providers": {
        "name": "Tax Providers",
        "path": "/admin/tax-providers",
        "schemaPath": "/admin/tax-providers/schema",
        "operations": {
          "GetTaxProviders": {
            "slug": "list-tax-providers",
            "path": "/admin/tax-providers/list-tax-providers",
            "oldHash": "tax-providers_gettaxproviders",
            "title": "List Tax Providers",
            "method": "get"
          }
        }
      },
      "tax-rates": {
        "name": "Tax Rates",
        "path": "/admin/tax-rates",
        "schemaPath": "/admin/tax-rates/schema",
        "operations": {
          "GetTaxRatesId": {
            "slug": "get-a-tax-rate",
            "path": "/admin/tax-rates/get-a-tax-rate",
            "oldHash": "tax-rates_gettaxratesid",
            "title": "Get a Tax Rate",
            "method": "get"
          },
          "GetTaxRates": {
            "slug": "list-tax-rates",
            "path": "/admin/tax-rates/list-tax-rates",
            "oldHash": "tax-rates_gettaxrates",
            "title": "List Tax Rates",
            "method": "get"
          },
          "PostTaxRates": {
            "slug": "create-tax-rate",
            "path": "/admin/tax-rates/create-tax-rate",
            "oldHash": "tax-rates_posttaxrates",
            "title": "Create Tax Rate",
            "method": "post"
          },
          "PostTaxRatesIdRules": {
            "slug": "create-tax-rule",
            "path": "/admin/tax-rates/create-tax-rule",
            "oldHash": "tax-rates_posttaxratesidrules",
            "title": "Create Tax Rule",
            "method": "post"
          },
          "PostTaxRatesId": {
            "slug": "update-a-tax-rate",
            "path": "/admin/tax-rates/update-a-tax-rate",
            "oldHash": "tax-rates_posttaxratesid",
            "title": "Update a Tax Rate",
            "method": "post"
          },
          "DeleteTaxRatesId": {
            "slug": "delete-a-tax-rate",
            "path": "/admin/tax-rates/delete-a-tax-rate",
            "oldHash": "tax-rates_deletetaxratesid",
            "title": "Delete a Tax Rate",
            "method": "delete"
          },
          "DeleteTaxRatesIdRulesRule_id": {
            "slug": "remove-rule",
            "path": "/admin/tax-rates/remove-rule",
            "oldHash": "tax-rates_deletetaxratesidrulesrule_id",
            "title": "Remove Rule",
            "method": "delete"
          }
        }
      },
      "tax-regions": {
        "name": "Tax Regions",
        "path": "/admin/tax-regions",
        "schemaPath": "/admin/tax-regions/schema",
        "operations": {
          "GetTaxRegionsId": {
            "slug": "get-a-tax-region",
            "path": "/admin/tax-regions/get-a-tax-region",
            "oldHash": "tax-regions_gettaxregionsid",
            "title": "Get a Tax Region",
            "method": "get"
          },
          "GetTaxRegions": {
            "slug": "list-tax-regions",
            "path": "/admin/tax-regions/list-tax-regions",
            "oldHash": "tax-regions_gettaxregions",
            "title": "List Tax Regions",
            "method": "get"
          },
          "PostTaxRegions": {
            "slug": "create-tax-region",
            "path": "/admin/tax-regions/create-tax-region",
            "oldHash": "tax-regions_posttaxregions",
            "title": "Create Tax Region",
            "method": "post"
          },
          "PostTaxRegionsId": {
            "slug": "update-a-tax-region",
            "path": "/admin/tax-regions/update-a-tax-region",
            "oldHash": "tax-regions_posttaxregionsid",
            "title": "Update a Tax Region",
            "method": "post"
          },
          "DeleteTaxRegionsId": {
            "slug": "delete-a-tax-region",
            "path": "/admin/tax-regions/delete-a-tax-region",
            "oldHash": "tax-regions_deletetaxregionsid",
            "title": "Delete a Tax Region",
            "method": "delete"
          }
        }
      },
      "translations": {
        "name": "Translations",
        "path": "/admin/translations",
        "schemaPath": "/admin/translations/schema",
        "operations": {
          "GetTranslationsEntities": {
            "slug": "list-translatable-entities",
            "path": "/admin/translations/list-translatable-entities",
            "oldHash": "translations_gettranslationsentities",
            "title": "List Translatable Entities",
            "method": "get"
          },
          "GetTranslationsSettings": {
            "slug": "list-settings",
            "path": "/admin/translations/list-settings",
            "oldHash": "translations_gettranslationssettings",
            "title": "List Settings",
            "method": "get"
          },
          "GetTranslations": {
            "slug": "list-translations",
            "path": "/admin/translations/list-translations",
            "oldHash": "translations_gettranslations",
            "title": "List Translations",
            "method": "get"
          },
          "GetTranslationsStatistics": {
            "slug": "get-statistics",
            "path": "/admin/translations/get-statistics",
            "oldHash": "translations_gettranslationsstatistics",
            "title": "Get Statistics",
            "method": "get"
          },
          "PostTranslationsSettingsBatch": {
            "slug": "manage-translation-settings",
            "path": "/admin/translations/manage-translation-settings",
            "oldHash": "translations_posttranslationssettingsbatch",
            "title": "Manage Translation Settings",
            "method": "post"
          },
          "PostTranslationsBatch": {
            "slug": "manage-translations",
            "path": "/admin/translations/manage-translations",
            "oldHash": "translations_posttranslationsbatch",
            "title": "Manage Translations",
            "method": "post"
          }
        }
      },
      "uploads": {
        "name": "Uploads",
        "path": "/admin/uploads",
        "schemaPath": null,
        "operations": {
          "GetUploadsId": {
            "slug": "get-a-file",
            "path": "/admin/uploads/get-a-file",
            "oldHash": "uploads_getuploadsid",
            "title": "Get a File",
            "method": "get"
          },
          "PostUploadsPresignedUrls": {
            "slug": "get-presigned-upload-url",
            "path": "/admin/uploads/get-presigned-upload-url",
            "oldHash": "uploads_postuploadspresignedurls",
            "title": "Get Presigned Upload URL",
            "method": "post"
          },
          "PostUploads": {
            "slug": "upload-files",
            "path": "/admin/uploads/upload-files",
            "oldHash": "uploads_postuploads",
            "title": "Upload Files",
            "method": "post"
          },
          "DeleteUploadsId": {
            "slug": "delete-a-file",
            "path": "/admin/uploads/delete-a-file",
            "oldHash": "uploads_deleteuploadsid",
            "title": "Delete a File",
            "method": "delete"
          }
        }
      },
      "users": {
        "name": "Users",
        "path": "/admin/users",
        "schemaPath": "/admin/users/schema",
        "operations": {
          "GetUsersId": {
            "slug": "get-a-user",
            "path": "/admin/users/get-a-user",
            "oldHash": "users_getusersid",
            "title": "Get a User",
            "method": "get"
          },
          "GetUsersMe": {
            "slug": "get-logged-in-user",
            "path": "/admin/users/get-logged-in-user",
            "oldHash": "users_getusersme",
            "title": "Get Logged-In User",
            "method": "get"
          },
          "GetUsers": {
            "slug": "list-users",
            "path": "/admin/users/list-users",
            "oldHash": "users_getusers",
            "title": "List Users",
            "method": "get"
          },
          "PostUsersId": {
            "slug": "update-a-user",
            "path": "/admin/users/update-a-user",
            "oldHash": "users_postusersid",
            "title": "Update a User",
            "method": "post"
          },
          "DeleteUsersId": {
            "slug": "delete-a-user",
            "path": "/admin/users/delete-a-user",
            "oldHash": "users_deleteusersid",
            "title": "Delete a User",
            "method": "delete"
          }
        }
      },
      "views": {
        "name": "Views",
        "path": "/admin/views",
        "schemaPath": "/admin/views/schema",
        "operations": {
          "GetViewsEntityConfigurationsActive": {
            "slug": "get-active-view-configuration",
            "path": "/admin/views/get-active-view-configuration",
            "oldHash": "views_getviewsentityconfigurationsactive",
            "title": "Get Active View Configuration",
            "method": "get"
          },
          "GetViewsEntityConfigurationsId": {
            "slug": "get-view-configuration",
            "path": "/admin/views/get-view-configuration",
            "oldHash": "views_getviewsentityconfigurationsid",
            "title": "Get View Configuration",
            "method": "get"
          },
          "GetViewsEntityColumns": {
            "slug": "list-columns",
            "path": "/admin/views/list-columns",
            "oldHash": "views_getviewsentitycolumns",
            "title": "List Columns",
            "method": "get"
          },
          "GetViewsEntityConfigurations": {
            "slug": "list-view-configurations",
            "path": "/admin/views/list-view-configurations",
            "oldHash": "views_getviewsentityconfigurations",
            "title": "List View Configurations",
            "method": "get"
          },
          "GetViewsEntities": {
            "slug": "list-views",
            "path": "/admin/views/list-views",
            "oldHash": "views_getviewsentities",
            "title": "List Views",
            "method": "get"
          },
          "PostViewsEntityConfigurations": {
            "slug": "create-view-configuration",
            "path": "/admin/views/create-view-configuration",
            "oldHash": "views_postviewsentityconfigurations",
            "title": "Create View Configuration",
            "method": "post"
          },
          "PostViewsEntityConfigurationsActive": {
            "slug": "make-view-configuration-active",
            "path": "/admin/views/make-view-configuration-active",
            "oldHash": "views_postviewsentityconfigurationsactive",
            "title": "Make View Configuration Active",
            "method": "post"
          },
          "PostViewsEntityConfigurationsId": {
            "slug": "update-view-configuration",
            "path": "/admin/views/update-view-configuration",
            "oldHash": "views_postviewsentityconfigurationsid",
            "title": "Update View Configuration",
            "method": "post"
          },
          "DeleteViewsEntityConfigurationsId": {
            "slug": "remove-view-configurations",
            "path": "/admin/views/remove-view-configurations",
            "oldHash": "views_deleteviewsentityconfigurationsid",
            "title": "Remove View Configurations",
            "method": "delete"
          }
        }
      },
      "workflows-executions": {
        "name": "Workflows Executions",
        "path": "/admin/workflows-executions",
        "schemaPath": null,
        "operations": {
          "GetWorkflowsExecutionsId": {
            "slug": "get-a-workflows-execution",
            "path": "/admin/workflows-executions/get-a-workflows-execution",
            "oldHash": "workflows-executions_getworkflowsexecutionsid",
            "title": "Get a Workflows Execution",
            "method": "get"
          },
          "GetWorkflowsExecutionsWorkflow_idTransaction_id": {
            "slug": "get-exection",
            "path": "/admin/workflows-executions/get-exection",
            "oldHash": "workflows-executions_getworkflowsexecutionsworkflow_idtransaction_id",
            "title": "Get Exection",
            "method": "get"
          },
          "GetWorkflowsExecutions": {
            "slug": "list-workflows-executions",
            "path": "/admin/workflows-executions/list-workflows-executions",
            "oldHash": "workflows-executions_getworkflowsexecutions",
            "title": "List Workflows Executions",
            "method": "get"
          },
          "GetWorkflowsExecutionsWorkflow_idSubscribe": {
            "slug": "subscribe-to-workflow",
            "path": "/admin/workflows-executions/subscribe-to-workflow",
            "oldHash": "workflows-executions_getworkflowsexecutionsworkflow_idsubscribe",
            "title": "Subscribe to Workflow",
            "method": "get"
          },
          "GetWorkflowsExecutionsWorkflow_idTransaction_idSubscribe": {
            "slug": "subscribe-to-workflow-execution-events",
            "path": "/admin/workflows-executions/subscribe-to-workflow-execution-events",
            "oldHash": "workflows-executions_getworkflowsexecutionsworkflow_idtransaction_idsubscribe",
            "title": "Subscribe to Workflow Execution Events",
            "method": "get"
          },
          "PostWorkflowsExecutionsWorkflow_idRun": {
            "slug": "execute-a-workflow",
            "path": "/admin/workflows-executions/execute-a-workflow",
            "oldHash": "workflows-executions_postworkflowsexecutionsworkflow_idrun",
            "title": "Execute a Workflow",
            "method": "post"
          },
          "PostWorkflowsExecutionsWorkflow_idStepsFailure": {
            "slug": "fail-a-step",
            "path": "/admin/workflows-executions/fail-a-step",
            "oldHash": "workflows-executions_postworkflowsexecutionsworkflow_idstepsfailure",
            "title": "Fail a Step",
            "method": "post"
          },
          "PostWorkflowsExecutionsWorkflow_idStepsSuccess": {
            "slug": "succed-a-step",
            "path": "/admin/workflows-executions/succed-a-step",
            "oldHash": "workflows-executions_postworkflowsexecutionsworkflow_idstepssuccess",
            "title": "Succed a Step",
            "method": "post"
          }
        }
      }
    }
  },
  "store": {
    "intro": {
      "authentication": "/store/authentication",
      "publishable-api-key": "/store/publishable-api-key",
      "http-compression": "/store/http-compression",
      "manage-metadata": "/store/manage-metadata",
      "select-fields-and-relations": "/store/select-fields-and-relations",
      "query-parameter-types": "/store/query-parameter-types",
      "pagination": "/store/pagination",
      "workflows": "/store/workflows",
      "localization": "/store/localization"
    },
    "tags": {
      "auth": {
        "name": "Auth",
        "path": "/store/auth",
        "schemaPath": null,
        "operations": {
          "PostActor_typeAuth_provider": {
            "slug": "authenticate-customer",
            "path": "/store/auth/authenticate-customer",
            "oldHash": "auth_postactor_typeauth_provider",
            "title": "Authenticate Customer",
            "method": "post"
          },
          "PostVerificationConfirm": {
            "slug": "confirm-verification",
            "path": "/store/auth/confirm-verification",
            "oldHash": "auth_postverificationconfirm",
            "title": "Confirm Verification",
            "method": "post"
          },
          "PostActor_typeAuth_providerResetPassword": {
            "slug": "generate-reset-password-token",
            "path": "/store/auth/generate-reset-password-token",
            "oldHash": "auth_postactor_typeauth_providerresetpassword",
            "title": "Generate Reset Password Token",
            "method": "post"
          },
          "PostAdminAuthTokenRefresh": {
            "slug": "refresh-authentication-token",
            "path": "/store/auth/refresh-authentication-token",
            "oldHash": "auth_postadminauthtokenrefresh",
            "title": "Refresh Authentication Token",
            "method": "post"
          },
          "PostVerificationRequest": {
            "slug": "request-verification",
            "path": "/store/auth/request-verification",
            "oldHash": "auth_postverificationrequest",
            "title": "Request Verification",
            "method": "post"
          },
          "PostActor_typeAuth_providerUpdate": {
            "slug": "reset-password",
            "path": "/store/auth/reset-password",
            "oldHash": "auth_postactor_typeauth_providerupdate",
            "title": "Reset Password",
            "method": "post"
          },
          "PostActor_typeAuth_provider_register": {
            "slug": "retrieve-registration-jwt-token",
            "path": "/store/auth/retrieve-registration-jwt-token",
            "oldHash": "auth_postactor_typeauth_provider_register",
            "title": "Retrieve Registration JWT Token",
            "method": "post"
          },
          "PostSession": {
            "slug": "set-authentication-session",
            "path": "/store/auth/set-authentication-session",
            "oldHash": "auth_postsession",
            "title": "Set Authentication Session",
            "method": "post"
          },
          "PostActor_typeAuth_providerCallback": {
            "slug": "validate-authentication-callback",
            "path": "/store/auth/validate-authentication-callback",
            "oldHash": "auth_postactor_typeauth_providercallback",
            "title": "Validate Authentication Callback",
            "method": "post"
          },
          "PostActor_typeAuth_providerVerificationConfirm": {
            "slug": "verify-the-customers-email",
            "path": "/store/auth/verify-the-customers-email",
            "oldHash": "auth_postactor_typeauth_providerverificationconfirm",
            "title": "Verify the Customer's Email",
            "method": "post"
          },
          "DeleteSession": {
            "slug": "delete-authentication-session",
            "path": "/store/auth/delete-authentication-session",
            "oldHash": "auth_deletesession",
            "title": "Delete Authentication Session",
            "method": "delete"
          }
        }
      },
      "carts": {
        "name": "Carts",
        "path": "/store/carts",
        "schemaPath": "/store/carts/schema",
        "operations": {
          "GetCartsId": {
            "slug": "get-a-cart",
            "path": "/store/carts/get-a-cart",
            "oldHash": "carts_getcartsid",
            "title": "Get a Cart",
            "method": "get"
          },
          "PostCartsIdGiftCards": {
            "slug": "add-gift-card",
            "path": "/store/carts/add-gift-card",
            "oldHash": "carts_postcartsidgiftcards",
            "title": "Add Gift Card",
            "method": "post"
          },
          "PostCartsIdLineItems": {
            "slug": "add-line-item",
            "path": "/store/carts/add-line-item",
            "oldHash": "carts_postcartsidlineitems",
            "title": "Add Line Item",
            "method": "post"
          },
          "PostCartsIdPromotions": {
            "slug": "add-promotions",
            "path": "/store/carts/add-promotions",
            "oldHash": "carts_postcartsidpromotions",
            "title": "Add Promotions",
            "method": "post"
          },
          "PostCartsIdShippingMethods": {
            "slug": "add-shipping-method",
            "path": "/store/carts/add-shipping-method",
            "oldHash": "carts_postcartsidshippingmethods",
            "title": "Add Shipping Method",
            "method": "post"
          },
          "PostCartsIdStoreCredits": {
            "slug": "add-store-credit",
            "path": "/store/carts/add-store-credit",
            "oldHash": "carts_postcartsidstorecredits",
            "title": "Add Store Credit",
            "method": "post"
          },
          "PostCartsIdTaxes": {
            "slug": "calculate-taxes",
            "path": "/store/carts/calculate-taxes",
            "oldHash": "carts_postcartsidtaxes",
            "title": "Calculate Taxes",
            "method": "post"
          },
          "PostCartsIdCustomer": {
            "slug": "change-customer",
            "path": "/store/carts/change-customer",
            "oldHash": "carts_postcartsidcustomer",
            "title": "Change Customer",
            "method": "post"
          },
          "PostCartsIdComplete": {
            "slug": "complete-cart",
            "path": "/store/carts/complete-cart",
            "oldHash": "carts_postcartsidcomplete",
            "title": "Complete Cart",
            "method": "post"
          },
          "PostCarts": {
            "slug": "create-cart",
            "path": "/store/carts/create-cart",
            "oldHash": "carts_postcarts",
            "title": "Create Cart",
            "method": "post"
          },
          "PostCartsId": {
            "slug": "update-a-cart",
            "path": "/store/carts/update-a-cart",
            "oldHash": "carts_postcartsid",
            "title": "Update a Cart",
            "method": "post"
          },
          "PostCartsIdLineItemsLine_id": {
            "slug": "update-line-item",
            "path": "/store/carts/update-line-item",
            "oldHash": "carts_postcartsidlineitemsline_id",
            "title": "Update Line Item",
            "method": "post"
          },
          "DeleteCartsIdGiftCards": {
            "slug": "remove-gift-card",
            "path": "/store/carts/remove-gift-card",
            "oldHash": "carts_deletecartsidgiftcards",
            "title": "Remove Gift Card",
            "method": "delete"
          },
          "DeleteCartsIdLineItemsLine_id": {
            "slug": "remove-line-item",
            "path": "/store/carts/remove-line-item",
            "oldHash": "carts_deletecartsidlineitemsline_id",
            "title": "Remove Line Item",
            "method": "delete"
          },
          "DeleteCartsIdPromotions": {
            "slug": "remove-promotions-from-cart",
            "path": "/store/carts/remove-promotions-from-cart",
            "oldHash": "carts_deletecartsidpromotions",
            "title": "Remove Promotions from Cart",
            "method": "delete"
          }
        }
      },
      "collections": {
        "name": "Collections",
        "path": "/store/collections",
        "schemaPath": "/store/collections/schema",
        "operations": {
          "GetCollectionsId": {
            "slug": "get-a-collection",
            "path": "/store/collections/get-a-collection",
            "oldHash": "collections_getcollectionsid",
            "title": "Get a Collection",
            "method": "get"
          },
          "GetCollections": {
            "slug": "list-collections",
            "path": "/store/collections/list-collections",
            "oldHash": "collections_getcollections",
            "title": "List Collections",
            "method": "get"
          }
        }
      },
      "currencies": {
        "name": "Currencies",
        "path": "/store/currencies",
        "schemaPath": "/store/currencies/schema",
        "operations": {
          "GetCurrenciesCode": {
            "slug": "get-a-currency",
            "path": "/store/currencies/get-a-currency",
            "oldHash": "currencies_getcurrenciescode",
            "title": "Get a Currency",
            "method": "get"
          },
          "GetCurrencies": {
            "slug": "list-currencies",
            "path": "/store/currencies/list-currencies",
            "oldHash": "currencies_getcurrencies",
            "title": "List Currencies",
            "method": "get"
          }
        }
      },
      "customers": {
        "name": "Customers",
        "path": "/store/customers",
        "schemaPath": "/store/customers/schema",
        "operations": {
          "GetCustomersMeAddressesAddress_id": {
            "slug": "get-address",
            "path": "/store/customers/get-address",
            "oldHash": "customers_getcustomersmeaddressesaddress_id",
            "title": "Get Address",
            "method": "get"
          },
          "GetCustomersMe": {
            "slug": "get-customer",
            "path": "/store/customers/get-customer",
            "oldHash": "customers_getcustomersme",
            "title": "Get Customer",
            "method": "get"
          },
          "GetCustomersMeAddresses": {
            "slug": "list-customers-addresses",
            "path": "/store/customers/list-customers-addresses",
            "oldHash": "customers_getcustomersmeaddresses",
            "title": "List Customer's Addresses",
            "method": "get"
          },
          "PostCustomersMeAddresses": {
            "slug": "create-address",
            "path": "/store/customers/create-address",
            "oldHash": "customers_postcustomersmeaddresses",
            "title": "Create Address",
            "method": "post"
          },
          "PostCustomers": {
            "slug": "register-customer",
            "path": "/store/customers/register-customer",
            "oldHash": "customers_postcustomers",
            "title": "Register Customer",
            "method": "post"
          },
          "PostCustomersMe": {
            "slug": "update-customer",
            "path": "/store/customers/update-customer",
            "oldHash": "customers_postcustomersme",
            "title": "Update Customer",
            "method": "post"
          },
          "PostCustomersMeAddressesAddress_id": {
            "slug": "update-address",
            "path": "/store/customers/update-address",
            "oldHash": "customers_postcustomersmeaddressesaddress_id",
            "title": "Update Address",
            "method": "post"
          },
          "DeleteCustomersMeAddressesAddress_id": {
            "slug": "remove-address",
            "path": "/store/customers/remove-address",
            "oldHash": "customers_deletecustomersmeaddressesaddress_id",
            "title": "Remove Address",
            "method": "delete"
          }
        }
      },
      "gift-cards": {
        "name": "Gift Cards",
        "path": "/store/gift-cards",
        "schemaPath": "/store/gift-cards/schema",
        "operations": {
          "GetGiftCardsIdorcode": {
            "slug": "get-gift-card",
            "path": "/store/gift-cards/get-gift-card",
            "oldHash": "gift-cards_getgiftcardsidorcode",
            "title": "Get Gift Card",
            "method": "get"
          }
        }
      },
      "locales": {
        "name": "Locales",
        "path": "/store/locales",
        "schemaPath": "/store/locales/schema",
        "operations": {
          "GetLocales": {
            "slug": "list-locales",
            "path": "/store/locales/list-locales",
            "oldHash": "locales_getlocales",
            "title": "List Locales",
            "method": "get"
          }
        }
      },
      "multi-factor-authentication-(mfa)-factors": {
        "name": "Multi-Factor Authentication (MFA) Factors",
        "path": "/store/multi-factor-authentication-(mfa)-factors",
        "schemaPath": null,
        "operations": {
          "GetMfaFactors": {
            "slug": "list-mfa-factors",
            "path": "/store/multi-factor-authentication-(mfa)-factors/list-mfa-factors",
            "oldHash": "multi-factor-authentication-(mfa)-factors_getmfafactors",
            "title": "List MFA Factors",
            "method": "get"
          },
          "PostMfaRecoveryCodes": {
            "slug": "generate-mfa-recovery-codes",
            "path": "/store/multi-factor-authentication-(mfa)-factors/generate-mfa-recovery-codes",
            "oldHash": "multi-factor-authentication-(mfa)-factors_postmfarecoverycodes",
            "title": "Generate MFA Recovery Codes",
            "method": "post"
          },
          "PostMfaFactors": {
            "slug": "start-mfa-factor-enrollment",
            "path": "/store/multi-factor-authentication-(mfa)-factors/start-mfa-factor-enrollment",
            "oldHash": "multi-factor-authentication-(mfa)-factors_postmfafactors",
            "title": "Start MFA Factor Enrollment",
            "method": "post"
          },
          "PostMfaChallengesIdVerify": {
            "slug": "verify-mfa-challenge",
            "path": "/store/multi-factor-authentication-(mfa)-factors/verify-mfa-challenge",
            "oldHash": "multi-factor-authentication-(mfa)-factors_postmfachallengesidverify",
            "title": "Verify MFA Challenge",
            "method": "post"
          },
          "PostMfaFactorsIdVerify": {
            "slug": "verify-and-enable-mfa-factor",
            "path": "/store/multi-factor-authentication-(mfa)-factors/verify-and-enable-mfa-factor",
            "oldHash": "multi-factor-authentication-(mfa)-factors_postmfafactorsidverify",
            "title": "Verify and Enable MFA Factor",
            "method": "post"
          },
          "DeleteMfaFactorsId": {
            "slug": "disable-mfa-factor",
            "path": "/store/multi-factor-authentication-(mfa)-factors/disable-mfa-factor",
            "oldHash": "multi-factor-authentication-(mfa)-factors_deletemfafactorsid",
            "title": "Disable MFA Factor",
            "method": "delete"
          }
        }
      },
      "orders": {
        "name": "Orders",
        "path": "/store/orders",
        "schemaPath": "/store/orders/schema",
        "operations": {
          "GetOrdersId": {
            "slug": "get-an-order",
            "path": "/store/orders/get-an-order",
            "oldHash": "orders_getordersid",
            "title": "Get an Order",
            "method": "get"
          },
          "GetOrders": {
            "slug": "list-orders",
            "path": "/store/orders/list-orders",
            "oldHash": "orders_getorders",
            "title": "List Orders",
            "method": "get"
          },
          "PostOrdersIdTransferAccept": {
            "slug": "accept-transfer",
            "path": "/store/orders/accept-transfer",
            "oldHash": "orders_postordersidtransferaccept",
            "title": "Accept Transfer",
            "method": "post"
          },
          "PostOrdersIdTransferCancel": {
            "slug": "cancel-transfer",
            "path": "/store/orders/cancel-transfer",
            "oldHash": "orders_postordersidtransfercancel",
            "title": "Cancel Transfer",
            "method": "post"
          },
          "PostOrdersIdTransferDecline": {
            "slug": "decline-transfer",
            "path": "/store/orders/decline-transfer",
            "oldHash": "orders_postordersidtransferdecline",
            "title": "Decline Transfer",
            "method": "post"
          },
          "PostOrdersIdTransferRequest": {
            "slug": "request-order-transfer",
            "path": "/store/orders/request-order-transfer",
            "oldHash": "orders_postordersidtransferrequest",
            "title": "Request Order Transfer",
            "method": "post"
          }
        }
      },
      "payment-collections": {
        "name": "Payment Collections",
        "path": "/store/payment-collections",
        "schemaPath": "/store/payment-collections/schema",
        "operations": {
          "PostPaymentCollections": {
            "slug": "create-payment-collection",
            "path": "/store/payment-collections/create-payment-collection",
            "oldHash": "payment-collections_postpaymentcollections",
            "title": "Create Payment Collection",
            "method": "post"
          },
          "PostPaymentCollectionsIdPaymentSessions": {
            "slug": "initialize-payment-session",
            "path": "/store/payment-collections/initialize-payment-session",
            "oldHash": "payment-collections_postpaymentcollectionsidpaymentsessions",
            "title": "Initialize Payment Session",
            "method": "post"
          }
        }
      },
      "payment-providers": {
        "name": "Payment Providers",
        "path": "/store/payment-providers",
        "schemaPath": "/store/payment-providers/schema",
        "operations": {
          "GetPaymentProviders": {
            "slug": "list-payment-providers",
            "path": "/store/payment-providers/list-payment-providers",
            "oldHash": "payment-providers_getpaymentproviders",
            "title": "List Payment Providers",
            "method": "get"
          }
        }
      },
      "product-categories": {
        "name": "Product Categories",
        "path": "/store/product-categories",
        "schemaPath": "/store/product-categories/schema",
        "operations": {
          "GetProductCategoriesId": {
            "slug": "get-a-product-category",
            "path": "/store/product-categories/get-a-product-category",
            "oldHash": "product-categories_getproductcategoriesid",
            "title": "Get a Product Category",
            "method": "get"
          },
          "GetProductCategories": {
            "slug": "list-product-categories",
            "path": "/store/product-categories/list-product-categories",
            "oldHash": "product-categories_getproductcategories",
            "title": "List Product Categories",
            "method": "get"
          }
        }
      },
      "product-options": {
        "name": "Product Options",
        "path": "/store/product-options",
        "schemaPath": "/store/product-options/schema",
        "operations": {
          "GetProductOptionsId": {
            "slug": "get-a-product-option",
            "path": "/store/product-options/get-a-product-option",
            "oldHash": "product-options_getproductoptionsid",
            "title": "Get a Product Option",
            "method": "get"
          },
          "GetProductOptions": {
            "slug": "list-product-options",
            "path": "/store/product-options/list-product-options",
            "oldHash": "product-options_getproductoptions",
            "title": "List Product Options",
            "method": "get"
          }
        }
      },
      "product-tags": {
        "name": "Product Tags",
        "path": "/store/product-tags",
        "schemaPath": "/store/product-tags/schema",
        "operations": {
          "GetProductTagsId": {
            "slug": "get-a-product-tag",
            "path": "/store/product-tags/get-a-product-tag",
            "oldHash": "product-tags_getproducttagsid",
            "title": "Get a Product Tag",
            "method": "get"
          },
          "GetProductTags": {
            "slug": "list-product-tags",
            "path": "/store/product-tags/list-product-tags",
            "oldHash": "product-tags_getproducttags",
            "title": "List Product Tags",
            "method": "get"
          }
        }
      },
      "product-types": {
        "name": "Product Types",
        "path": "/store/product-types",
        "schemaPath": "/store/product-types/schema",
        "operations": {
          "GetProductTypesId": {
            "slug": "get-a-product-type",
            "path": "/store/product-types/get-a-product-type",
            "oldHash": "product-types_getproducttypesid",
            "title": "Get a Product Type",
            "method": "get"
          },
          "GetProductTypes": {
            "slug": "list-product-types",
            "path": "/store/product-types/list-product-types",
            "oldHash": "product-types_getproducttypes",
            "title": "List Product Types",
            "method": "get"
          }
        }
      },
      "product-variants": {
        "name": "Product Variants",
        "path": "/store/product-variants",
        "schemaPath": "/store/product-variants/schema",
        "operations": {
          "GetProductVariants": {
            "slug": "list-product-variants",
            "path": "/store/product-variants/list-product-variants",
            "oldHash": "product-variants_getproductvariants",
            "title": "List Product Variants",
            "method": "get"
          }
        }
      },
      "products": {
        "name": "Products",
        "path": "/store/products",
        "schemaPath": "/store/products/schema",
        "operations": {
          "GetProductsId": {
            "slug": "get-a-product",
            "path": "/store/products/get-a-product",
            "oldHash": "products_getproductsid",
            "title": "Get a Product",
            "method": "get"
          },
          "GetProducts": {
            "slug": "list-products",
            "path": "/store/products/list-products",
            "oldHash": "products_getproducts",
            "title": "List Products",
            "method": "get"
          }
        }
      },
      "regions": {
        "name": "Regions",
        "path": "/store/regions",
        "schemaPath": "/store/regions/schema",
        "operations": {
          "GetRegionsId": {
            "slug": "get-a-region",
            "path": "/store/regions/get-a-region",
            "oldHash": "regions_getregionsid",
            "title": "Get a Region",
            "method": "get"
          },
          "GetRegions": {
            "slug": "list-regions",
            "path": "/store/regions/list-regions",
            "oldHash": "regions_getregions",
            "title": "List Regions",
            "method": "get"
          }
        }
      },
      "return-reasons": {
        "name": "Return Reasons",
        "path": "/store/return-reasons",
        "schemaPath": "/store/return-reasons/schema",
        "operations": {
          "GetReturnReasonsId": {
            "slug": "get-a-return-reason",
            "path": "/store/return-reasons/get-a-return-reason",
            "oldHash": "return-reasons_getreturnreasonsid",
            "title": "Get a Return Reason",
            "method": "get"
          },
          "GetReturnReasons": {
            "slug": "list-return-reasons",
            "path": "/store/return-reasons/list-return-reasons",
            "oldHash": "return-reasons_getreturnreasons",
            "title": "List Return Reasons",
            "method": "get"
          }
        }
      },
      "returns": {
        "name": "Returns",
        "path": "/store/returns",
        "schemaPath": "/store/returns/schema",
        "operations": {
          "PostReturns": {
            "slug": "create-return",
            "path": "/store/returns/create-return",
            "oldHash": "returns_postreturns",
            "title": "Create Return",
            "method": "post"
          }
        }
      },
      "shipping-options": {
        "name": "Shipping Options",
        "path": "/store/shipping-options",
        "schemaPath": "/store/shipping-options/schema",
        "operations": {
          "GetShippingOptions": {
            "slug": "list-shipping-options-for-cart",
            "path": "/store/shipping-options/list-shipping-options-for-cart",
            "oldHash": "shipping-options_getshippingoptions",
            "title": "List Shipping Options for Cart",
            "method": "get"
          },
          "PostShippingOptionsIdCalculate": {
            "slug": "calculate-shipping-option-price",
            "path": "/store/shipping-options/calculate-shipping-option-price",
            "oldHash": "shipping-options_postshippingoptionsidcalculate",
            "title": "Calculate Shipping Option Price",
            "method": "post"
          }
        }
      },
      "store-credit-accounts": {
        "name": "Store Credit Accounts",
        "path": "/store/store-credit-accounts",
        "schemaPath": "/store/store-credit-accounts/schema",
        "operations": {
          "GetStoreCreditAccountsId": {
            "slug": "get-store-credit-account",
            "path": "/store/store-credit-accounts/get-store-credit-account",
            "oldHash": "store-credit-accounts_getstorecreditaccountsid",
            "title": "Get Store Credit Account",
            "method": "get"
          },
          "GetStoreCreditAccounts": {
            "slug": "list-store-credit-accounts",
            "path": "/store/store-credit-accounts/list-store-credit-accounts",
            "oldHash": "store-credit-accounts_getstorecreditaccounts",
            "title": "List Store Credit Accounts",
            "method": "get"
          },
          "PostStoreCreditAccountsClaim": {
            "slug": "claim-store-credit-account",
            "path": "/store/store-credit-accounts/claim-store-credit-account",
            "oldHash": "store-credit-accounts_poststorecreditaccountsclaim",
            "title": "Claim Store Credit Account",
            "method": "post"
          }
        }
      }
    }
  }
}

export const apiRefRedirects = {
  "admin": {
    "authentication": "/admin/authentication",
    "http-compression": "/admin/http-compression",
    "manage-metadata": "/admin/manage-metadata",
    "select-fields-and-relations": "/admin/select-fields-and-relations",
    "query-parameter-types": "/admin/query-parameter-types",
    "pagination": "/admin/pagination",
    "workflows": "/admin/workflows",
    "api-keys_getapikeysid": "/admin/api-keys/get-api-key",
    "api-keys_getapikeys": "/admin/api-keys/list-api-keys",
    "api-keys_postapikeys": "/admin/api-keys/create-api-key",
    "api-keys_postapikeysidsaleschannels": "/admin/api-keys/manage-sales-channels",
    "api-keys_postapikeysidrevoke": "/admin/api-keys/revoke-api-key",
    "api-keys_postapikeysid": "/admin/api-keys/update-an-api-key",
    "api-keys_deleteapikeysid": "/admin/api-keys/delete-an-api-key",
    "api-keys_apikey_schema": "/admin/api-keys/schema",
    "api-keys": "/admin/api-keys",
    "auth_postactor_typeauth_provider": "/admin/auth/authenticate-user",
    "auth_postactor_typeauth_providerresetpassword": "/admin/auth/generate-reset-password-token",
    "auth_postadminauthtokenrefresh": "/admin/auth/refresh-authentication-token",
    "auth_postactor_typeauth_providerupdate": "/admin/auth/reset-password",
    "auth_postactor_typeauth_provider_register": "/admin/auth/retrieve-registration-jwt-token",
    "auth_postsession": "/admin/auth/set-authentication-session",
    "auth_postactor_typeauth_providercallback": "/admin/auth/validate-authentication-callback",
    "auth_deletesession": "/admin/auth/delete-authentication-session",
    "auth_deletemfafactorsid": "/admin/auth/disable-mfa-factor",
    "auth": "/admin/auth",
    "campaigns_getcampaignsid": "/admin/campaigns/get-a-campaign",
    "campaigns_getcampaigns": "/admin/campaigns/list-campaigns",
    "campaigns_postcampaigns": "/admin/campaigns/create-campaign",
    "campaigns_postcampaignsidpromotions": "/admin/campaigns/manage-promotions",
    "campaigns_postcampaignsid": "/admin/campaigns/update-a-campaign",
    "campaigns_deletecampaignsid": "/admin/campaigns/delete-a-campaign",
    "campaigns_campaign_schema": "/admin/campaigns/schema",
    "campaigns": "/admin/campaigns",
    "claims_getclaimsid": "/admin/claims/get-a-claim",
    "claims_getclaims": "/admin/claims/list-claims",
    "claims_postclaimsidinboundshippingmethod": "/admin/claims/add-inbound-shipping",
    "claims_postclaimsidclaimitems": "/admin/claims/add-claim-items",
    "claims_postclaimsidinbounditems": "/admin/claims/add-inbound-items",
    "claims_postclaimsidoutbounditems": "/admin/claims/add-outbound-items",
    "claims_postclaimsidoutboundshippingmethod": "/admin/claims/add-outbound-shipping",
    "claims_postclaimsidcancel": "/admin/claims/cancel-a-claim",
    "claims_postclaimsidrequest": "/admin/claims/confirm-claim",
    "claims_postclaims": "/admin/claims/create-a-claim",
    "claims_postclaimsidclaimitemsaction_id": "/admin/claims/update-a-claim-item",
    "claims_postclaimsidinbounditemsaction_id": "/admin/claims/update-inbound-items",
    "claims_postclaimsidinboundshippingmethodaction_id": "/admin/claims/update-inbound-shipping",
    "claims_postclaimsidoutbounditemsaction_id": "/admin/claims/update-outbound-item",
    "claims_postclaimsidoutboundshippingmethodaction_id": "/admin/claims/update-outbound-shipping",
    "claims_deleteclaimsidrequest": "/admin/claims/cancel-claim-request",
    "claims_deleteclaimsidclaimitemsaction_id": "/admin/claims/remove-claim-item",
    "claims_deleteclaimsidinbounditemsaction_id": "/admin/claims/remove-inbound-item",
    "claims_deleteclaimsidoutbounditemsaction_id": "/admin/claims/remove-outbound-item",
    "claims_deleteclaimsidinboundshippingmethodaction_id": "/admin/claims/remove-inbound-shipping-method",
    "claims_deleteclaimsidoutboundshippingmethodaction_id": "/admin/claims/remove-outbound-shipping-method",
    "claims_claim_schema": "/admin/claims/schema",
    "claims": "/admin/claims",
    "collections_getcollectionsid": "/admin/collections/get-a-collection",
    "collections_getcollections": "/admin/collections/list-collections",
    "collections_postcollections": "/admin/collections/create-collection",
    "collections_postcollectionsidproducts": "/admin/collections/manage-products",
    "collections_postcollectionsid": "/admin/collections/update-a-collection",
    "collections_deletecollectionsid": "/admin/collections/delete-a-collection",
    "collections_collection_schema": "/admin/collections/schema",
    "collections": "/admin/collections",
    "currencies_getcurrenciescode": "/admin/currencies/get-a-currency",
    "currencies_getcurrencies": "/admin/currencies/list-currencies",
    "currencies_currency_schema": "/admin/currencies/schema",
    "currencies": "/admin/currencies",
    "customer-groups_getcustomergroupsid": "/admin/customer-groups/get-a-customer-group",
    "customer-groups_getcustomergroups": "/admin/customer-groups/list-customer-groups",
    "customer-groups_postcustomergroups": "/admin/customer-groups/create-customer-group",
    "customer-groups_postcustomergroupsidcustomers": "/admin/customer-groups/manage-customers",
    "customer-groups_postcustomergroupsid": "/admin/customer-groups/update-a-customer-group",
    "customer-groups_deletecustomergroupsid": "/admin/customer-groups/delete-a-customer-group",
    "customer-groups_customergroup_schema": "/admin/customer-groups/schema",
    "customer-groups": "/admin/customer-groups",
    "customers_getcustomersid": "/admin/customers/get-a-customer",
    "customers_getcustomersidaddresses": "/admin/customers/list-addresses",
    "customers_getcustomersidaddressesaddress_id": "/admin/customers/list-addresses-2",
    "customers_getcustomers": "/admin/customers/list-customers",
    "customers_postcustomersidaddresses": "/admin/customers/add-address",
    "customers_postcustomers": "/admin/customers/create-customer",
    "customers_postcustomersidcustomergroups": "/admin/customers/manage-customer-groups",
    "customers_postcustomersid": "/admin/customers/update-a-customer",
    "customers_postcustomersidaddressesaddress_id": "/admin/customers/update-address",
    "customers_deletecustomersid": "/admin/customers/delete-a-customer",
    "customers_deletecustomersidaddressesaddress_id": "/admin/customers/remove-an-address-from-customer",
    "customers_customer_schema": "/admin/customers/schema",
    "customers": "/admin/customers",
    "draft-orders_getdraftordersid": "/admin/draft-orders/get-a-draft-order",
    "draft-orders_getdraftorders": "/admin/draft-orders/list-draft-orders",
    "draft-orders_postdraftordersidedititems": "/admin/draft-orders/add-item",
    "draft-orders_postdraftordersideditpromotions": "/admin/draft-orders/add-promotions",
    "draft-orders_postdraftordersideditshippingmethods": "/admin/draft-orders/add-shipping-method",
    "draft-orders_postdraftordersideditconfirm": "/admin/draft-orders/confirm-edit",
    "draft-orders_postdraftordersidconverttoorder": "/admin/draft-orders/convert-to-order",
    "draft-orders_postdraftordersidedit": "/admin/draft-orders/create-edit",
    "draft-orders_postdraftorders": "/admin/draft-orders/create-draft-order",
    "draft-orders_postdraftordersideditrequest": "/admin/draft-orders/request-edit",
    "draft-orders_postdraftordersid": "/admin/draft-orders/update-a-draft-order",
    "draft-orders_postdraftordersidedititemsitemitem_id": "/admin/draft-orders/update-item",
    "draft-orders_postdraftordersideditshippingmethodsmethodmethod_id": "/admin/draft-orders/update-shipping-method",
    "draft-orders_postdraftordersidedititemsaction_id": "/admin/draft-orders/update-new-item",
    "draft-orders_postdraftordersideditshippingmethodsaction_id": "/admin/draft-orders/update-new-shipping-method",
    "draft-orders_deletedraftordersidedit": "/admin/draft-orders/cancel-edit",
    "draft-orders_deletedraftordersid": "/admin/draft-orders/delete-a-draft-order",
    "draft-orders_deletedraftordersidedititemsaction_id": "/admin/draft-orders/remove-item",
    "draft-orders_deletedraftordersideditshippingmethodsaction_id": "/admin/draft-orders/remove-new-shipping-method",
    "draft-orders_deletedraftordersideditpromotions": "/admin/draft-orders/remove-promotions",
    "draft-orders_deletedraftordersideditshippingmethodsmethodmethod_id": "/admin/draft-orders/remove-shipping-method",
    "draft-orders_draftorder_schema": "/admin/draft-orders/schema",
    "draft-orders": "/admin/draft-orders",
    "exchanges_getexchangesid": "/admin/exchanges/get-an-exchange",
    "exchanges_getexchanges": "/admin/exchanges/list-exchanges",
    "exchanges_postexchangesidinboundshippingmethod": "/admin/exchanges/add-inbound-shipping",
    "exchanges_postexchangesidinbounditems": "/admin/exchanges/add-inbound-items-to-an-exchange",
    "exchanges_postexchangesidoutbounditems": "/admin/exchanges/add-outbound-items-to-exchange",
    "exchanges_postexchangesidoutboundshippingmethod": "/admin/exchanges/add-outbound-shipping",
    "exchanges_postexchangesidcancel": "/admin/exchanges/cancel-an-exchange",
    "exchanges_postexchangesidrequest": "/admin/exchanges/confirm-an-exchange",
    "exchanges_postexchanges": "/admin/exchanges/create-exchange",
    "exchanges_postexchangesidinbounditemsaction_id": "/admin/exchanges/update-inbound-item",
    "exchanges_postexchangesidinboundshippingmethodaction_id": "/admin/exchanges/update-inbound-shipping",
    "exchanges_postexchangesidoutbounditemsaction_id": "/admin/exchanges/update-outbound-item",
    "exchanges_postexchangesidoutboundshippingmethodaction_id": "/admin/exchanges/update-outbound-shipping",
    "exchanges_deleteexchangesidrequest": "/admin/exchanges/cancel-exchange-request",
    "exchanges_deleteexchangesidinbounditemsaction_id": "/admin/exchanges/remove-inbound-item",
    "exchanges_deleteexchangesidinboundshippingmethodaction_id": "/admin/exchanges/remove-inbound-shipping-method",
    "exchanges_deleteexchangesidoutbounditemsaction_id": "/admin/exchanges/remove-outbound-item",
    "exchanges_deleteexchangesidoutboundshippingmethodaction_id": "/admin/exchanges/remove-outbound-shipping-method",
    "exchanges_exchange_schema": "/admin/exchanges/schema",
    "exchanges": "/admin/exchanges",
    "feature-flags_getfeatureflags": "/admin/feature-flags/list-feature-flags",
    "feature-flags": "/admin/feature-flags",
    "fulfillment-providers_getfulfillmentprovidersidoptions": "/admin/fulfillment-providers/list-fulfillment-options",
    "fulfillment-providers_getfulfillmentproviders": "/admin/fulfillment-providers/list-fulfillment-providers",
    "fulfillment-providers_fulfillmentprovider_schema": "/admin/fulfillment-providers/schema",
    "fulfillment-providers": "/admin/fulfillment-providers",
    "fulfillment-sets_getfulfillmentsetsidservicezoneszone_id": "/admin/fulfillment-sets/get-a-service-zone",
    "fulfillment-sets_postfulfillmentsetsidservicezones": "/admin/fulfillment-sets/add-service-zone",
    "fulfillment-sets_postfulfillmentsetsidservicezoneszone_id": "/admin/fulfillment-sets/update-service-zone",
    "fulfillment-sets_deletefulfillmentsetsid": "/admin/fulfillment-sets/delete-fulfillment-set",
    "fulfillment-sets_deletefulfillmentsetsidservicezoneszone_id": "/admin/fulfillment-sets/remove-service-zone",
    "fulfillment-sets_fulfillmentset_schema": "/admin/fulfillment-sets/schema",
    "fulfillment-sets": "/admin/fulfillment-sets",
    "fulfillments_postfulfillmentsidcancel": "/admin/fulfillments/cancel-a-fulfillment",
    "fulfillments_postfulfillmentsidshipment": "/admin/fulfillments/create-shipment",
    "fulfillments_postfulfillments": "/admin/fulfillments/create-fulfillment",
    "fulfillments_fulfillment_schema": "/admin/fulfillments/schema",
    "fulfillments": "/admin/fulfillments",
    "gift-cards_getgiftcardsid": "/admin/gift-cards/get-a-gift-card",
    "gift-cards_getgiftcardsidorders": "/admin/gift-cards/list-orders",
    "gift-cards_getgiftcards": "/admin/gift-cards/list-gift-cards",
    "gift-cards_postgiftcards": "/admin/gift-cards/create-gift-card",
    "gift-cards_postgiftcardsid": "/admin/gift-cards/update-a-gift-card",
    "gift-cards_giftcard_schema": "/admin/gift-cards/schema",
    "gift-cards": "/admin/gift-cards",
    "index_getindexdetails": "/admin/index/get-index-details",
    "index_postindexsync": "/admin/index/trigger-index-sync",
    "index": "/admin/index",
    "inventory-items_getinventoryitemsid": "/admin/inventory-items/get-a-inventory-item",
    "inventory-items_getinventoryitems": "/admin/inventory-items/list-inventory-items",
    "inventory-items_getinventoryitemsidlocationlevels": "/admin/inventory-items/list-inventory-levels",
    "inventory-items_postinventoryitems": "/admin/inventory-items/create-inventory-item",
    "inventory-items_postinventoryitemsidlocationlevels": "/admin/inventory-items/create-inventory-level",
    "inventory-items_postinventoryitemslocationlevelsbatch": "/admin/inventory-items/manage-inventory-levels",
    "inventory-items_postinventoryitemsidlocationlevelsbatch": "/admin/inventory-items/manage-inventory-levels-2",
    "inventory-items_postinventoryitemsid": "/admin/inventory-items/update-an-inventory-item",
    "inventory-items_postinventoryitemsidlocationlevelslocation_id": "/admin/inventory-items/update-inventory-level",
    "inventory-items_deleteinventoryitemsid": "/admin/inventory-items/delete-inventory-item",
    "inventory-items_deleteinventoryitemsidlocationlevelslocation_id": "/admin/inventory-items/remove-inventory-level",
    "inventory-items_inventoryitem_schema": "/admin/inventory-items/schema",
    "inventory-items": "/admin/inventory-items",
    "invites_getinvitesid": "/admin/invites/get-an-invite",
    "invites_getinvites": "/admin/invites/list-invites",
    "invites_postinvitesaccept": "/admin/invites/accept-invite",
    "invites_postinvites": "/admin/invites/create-invite",
    "invites_postinvitesidresend": "/admin/invites/refresh-invite-token",
    "invites_deleteinvitesid": "/admin/invites/delete-invite",
    "invites_invite_schema": "/admin/invites/schema",
    "invites": "/admin/invites",
    "layouts_getlayoutsconfigurations": "/admin/layouts/list-layout-configurations",
    "layouts_getlayoutszoneconfiguration": "/admin/layouts/list-layout-configurations-2",
    "layouts_postlayoutszoneconfiguration": "/admin/layouts/add-layout-configuration",
    "layouts_deletelayoutszoneconfiguration": "/admin/layouts/clear-configuration-of-layout",
    "layouts": "/admin/layouts",
    "locales_getlocalescode": "/admin/locales/get-locale",
    "locales_getlocales": "/admin/locales/list-locales",
    "locales_locale_schema": "/admin/locales/schema",
    "locales": "/admin/locales",
    "multi-factor-authentication_getmfafactors": "/admin/multi-factor-authentication/list-mfa-factors",
    "multi-factor-authentication_postmfarecoverycodes": "/admin/multi-factor-authentication/generate-mfa-recovery-codes",
    "multi-factor-authentication_postmfafactors": "/admin/multi-factor-authentication/start-mfa-factor-enrollment",
    "multi-factor-authentication_postmfachallengesidverify": "/admin/multi-factor-authentication/verify-mfa-challenge",
    "multi-factor-authentication_postmfafactorsidverify": "/admin/multi-factor-authentication/verify-and-enable-mfa-factor",
    "multi-factor-authentication": "/admin/multi-factor-authentication",
    "notifications_getnotificationsid": "/admin/notifications/get-a-notification",
    "notifications_getnotifications": "/admin/notifications/list-notifications",
    "notifications_notification_schema": "/admin/notifications/schema",
    "notifications": "/admin/notifications",
    "order-changes_postorderchangesid": "/admin/order-changes/update-order-change",
    "order-changes_orderchange_schema": "/admin/order-changes/schema",
    "order-changes": "/admin/order-changes",
    "order-edits_postordereditsiditems": "/admin/order-edits/add-items",
    "order-edits_postordereditsidshippingmethod": "/admin/order-edits/add-shipping-method",
    "order-edits_postordereditsidconfirm": "/admin/order-edits/confirm-order-edit",
    "order-edits_postorderedits": "/admin/order-edits/create-order-edit",
    "order-edits_postordereditsidrequest": "/admin/order-edits/request-order-edit",
    "order-edits_postordereditsiditemsaction_id": "/admin/order-edits/update-item",
    "order-edits_postordereditsiditemsitemitem_id": "/admin/order-edits/update-item-quantity",
    "order-edits_postordereditsidshippingmethodaction_id": "/admin/order-edits/update-shipping-method",
    "order-edits_deleteordereditsid": "/admin/order-edits/cancel-order-edit",
    "order-edits_deleteordereditsiditemsaction_id": "/admin/order-edits/remove-item",
    "order-edits_deleteordereditsidshippingmethodaction_id": "/admin/order-edits/remove-shipping-method",
    "order-edits": "/admin/order-edits",
    "orders_getordersid": "/admin/orders/get-an-order",
    "orders_getordersidpreview": "/admin/orders/get-preview",
    "orders_getordersidchanges": "/admin/orders/list-changes",
    "orders_getordersidlineitems": "/admin/orders/list-line-items",
    "orders_getorders": "/admin/orders/list-orders",
    "orders_getordersidshippingoptions": "/admin/orders/list-shipping-options",
    "orders_postordersidarchive": "/admin/orders/archive-an-order",
    "orders_postordersidpaymentsessionsauthorize": "/admin/orders/authorize-payment-session",
    "orders_postordersidfulfillmentsfulfillment_idcancel": "/admin/orders/cancel-fulfillment",
    "orders_postordersidcancel": "/admin/orders/cancel-order",
    "orders_postordersidtransfercancel": "/admin/orders/cancel-transfer",
    "orders_postordersidcomplete": "/admin/orders/complete-order",
    "orders_postordersidfulfillments": "/admin/orders/create-fulfillment",
    "orders_postordersidcreditlines": "/admin/orders/create-credit-line",
    "orders_postordersidfulfillmentsfulfillment_idshipments": "/admin/orders/create-shipment",
    "orders_postordersexport": "/admin/orders/export-orders",
    "orders_postordersidfulfillmentsfulfillment_idmarkasdelivered": "/admin/orders/mark-delivered",
    "orders_postordersidtransfer": "/admin/orders/request-transfer",
    "orders_postordersidtransferguest": "/admin/orders/transfer-to-guest",
    "orders_postordersid": "/admin/orders/update-order",
    "orders_order_schema": "/admin/orders/schema",
    "orders": "/admin/orders",
    "payment-collections_postpaymentcollections": "/admin/payment-collections/create-payment-collection",
    "payment-collections_postpaymentcollectionsidpaymentsessions": "/admin/payment-collections/initialize-payment-session",
    "payment-collections_postpaymentcollectionsidmarkaspaid": "/admin/payment-collections/mark-as-paid",
    "payment-collections_deletepaymentcollectionsid": "/admin/payment-collections/delete-a-payment-collection",
    "payment-collections_paymentcollection_schema": "/admin/payment-collections/schema",
    "payment-collections": "/admin/payment-collections",
    "payments_getpaymentsid": "/admin/payments/get-a-payment",
    "payments_getpaymentspaymentproviders": "/admin/payments/list-payment-providers",
    "payments_getpayments": "/admin/payments/list-payments",
    "payments_postpaymentsidcapture": "/admin/payments/capture-payment",
    "payments_postpaymentsidrefund": "/admin/payments/refund-payment",
    "payments_payment_schema": "/admin/payments/schema",
    "payments": "/admin/payments",
    "plugins_getplugins": "/admin/plugins/list-plugins",
    "plugins_plugin_schema": "/admin/plugins/schema",
    "plugins": "/admin/plugins",
    "price-lists_getpricelistsid": "/admin/price-lists/get-a-price-list",
    "price-lists_getpricelists": "/admin/price-lists/list-price-lists",
    "price-lists_getpricelistsidprices": "/admin/price-lists/list-prices",
    "price-lists_postpricelists": "/admin/price-lists/create-price-list",
    "price-lists_postpricelistsidpricesbatch": "/admin/price-lists/manage-prices",
    "price-lists_postpricelistsidproducts": "/admin/price-lists/remove-products-from-price-list",
    "price-lists_postpricelistsid": "/admin/price-lists/update-a-price-list",
    "price-lists_deletepricelistsid": "/admin/price-lists/delete-a-price-list",
    "price-lists_pricelist_schema": "/admin/price-lists/schema",
    "price-lists": "/admin/price-lists",
    "price-preferences_getpricepreferencesid": "/admin/price-preferences/get-a-price-preference",
    "price-preferences_getpricepreferences": "/admin/price-preferences/list-price-preferences",
    "price-preferences_postpricepreferences": "/admin/price-preferences/create-price-preference",
    "price-preferences_postpricepreferencesid": "/admin/price-preferences/update-a-price-preference",
    "price-preferences_deletepricepreferencesid": "/admin/price-preferences/delete-a-price-preference",
    "price-preferences_pricepreference_schema": "/admin/price-preferences/schema",
    "price-preferences": "/admin/price-preferences",
    "product-categories_getproductcategoriesid": "/admin/product-categories/get-a-product-category",
    "product-categories_getproductcategories": "/admin/product-categories/list-product-categories",
    "product-categories_postproductcategories": "/admin/product-categories/create-product-category",
    "product-categories_postproductcategoriesidproducts": "/admin/product-categories/manage-products",
    "product-categories_postproductcategoriesid": "/admin/product-categories/update-a-product-category",
    "product-categories_deleteproductcategoriesid": "/admin/product-categories/delete-a-product-category",
    "product-categories_productcategory_schema": "/admin/product-categories/schema",
    "product-categories": "/admin/product-categories",
    "product-options_getproductoptionsid": "/admin/product-options/get-a-product-option",
    "product-options_getproductoptionsidvaluesvalue_id": "/admin/product-options/get-product-option-value",
    "product-options_getproductoptionsidvalues": "/admin/product-options/list-product-option-values",
    "product-options_getproductoptions": "/admin/product-options/list-product-options",
    "product-options_postproductoptions": "/admin/product-options/create-product-option",
    "product-options_postproductoptionsid": "/admin/product-options/update-a-product-option",
    "product-options_postproductoptionsidvaluesvalue_id": "/admin/product-options/update-product-option-value",
    "product-options_deleteproductoptionsid": "/admin/product-options/delete-a-product-option",
    "product-options_deleteproductoptionsidvaluesvalue_id": "/admin/product-options/remove-value-from-product-option",
    "product-options_productoption_schema": "/admin/product-options/schema",
    "product-options": "/admin/product-options",
    "product-tags_getproducttagsid": "/admin/product-tags/get-a-product-tag",
    "product-tags_getproducttags": "/admin/product-tags/list-product-tags",
    "product-tags_postproducttags": "/admin/product-tags/create-product-tag",
    "product-tags_postproducttagsid": "/admin/product-tags/update-a-product-tag",
    "product-tags_deleteproducttagsid": "/admin/product-tags/delete-a-product-tag",
    "product-tags_producttag_schema": "/admin/product-tags/schema",
    "product-tags": "/admin/product-tags",
    "product-types_getproducttypesid": "/admin/product-types/get-a-product-type",
    "product-types_getproducttypes": "/admin/product-types/list-product-types",
    "product-types_postproducttypes": "/admin/product-types/create-product-type",
    "product-types_postproducttypesid": "/admin/product-types/update-a-product-type",
    "product-types_deleteproducttypesid": "/admin/product-types/delete-a-product-type",
    "product-types_producttype_schema": "/admin/product-types/schema",
    "product-types": "/admin/product-types",
    "product-variants_getproductvariants": "/admin/product-variants/list-product-variants",
    "product-variants_productvariant_schema": "/admin/product-variants/schema",
    "product-variants": "/admin/product-variants",
    "products_getproductsid": "/admin/products/get-a-product",
    "products_getproductsidvariantsvariant_id": "/admin/products/get-variant",
    "products_getproductsidoptions": "/admin/products/list-options",
    "products_getproducts": "/admin/products/list-products",
    "products_getproductsidvariants": "/admin/products/list-variants",
    "products_postproductsidoptionsbatch": "/admin/products/add-options-to-product",
    "products_postproductsidvariantsvariant_idinventoryitems": "/admin/products/associate-variants-inventory",
    "products_postproductsimporttransaction_idconfirm": "/admin/products/confirm-product-import",
    "products_postproductsimportstransaction_idconfirm": "/admin/products/confirm-product-import-2",
    "products_postproductsidvariants": "/admin/products/create-variant",
    "products_postproducts": "/admin/products/create-product",
    "products_postproductsimport": "/admin/products/create-product-import",
    "products_postproductsimports": "/admin/products/create-product-import-2",
    "products_postproductsexport": "/admin/products/export-products",
    "products_postproductsidvariantsvariant_idimagesbatch": "/admin/products/manage-images-of-product-variant",
    "products_postproductsbatch": "/admin/products/manage-products",
    "products_postproductsidvariantsbatch": "/admin/products/manage-variants-in-a-product",
    "products_postproductsidvariantsinventoryitemsbatch": "/admin/products/manage-variants-inventory",
    "products_postproductsidimagesimage_idvariantsbatch": "/admin/products/manage-variants-of-product-image",
    "products_postproductsid": "/admin/products/update-a-product",
    "products_postproductsidvariantsvariant_id": "/admin/products/update-variant",
    "products_postproductsidvariantsvariant_idinventoryitemsinventory_item_id": "/admin/products/update-product-variants-inventory-details",
    "products_deleteproductsid": "/admin/products/delete-a-product",
    "products_deleteproductsidvariantsvariant_id": "/admin/products/delete-variant",
    "products_deleteproductsidvariantsvariant_idinventoryitemsinventory_item_id": "/admin/products/remove-inventory-item",
    "products_product_schema": "/admin/products/schema",
    "products": "/admin/products",
    "promotions_getpromotionsid": "/admin/promotions/get-a-promotion",
    "promotions_getpromotions": "/admin/promotions/list-promotions",
    "promotions_getpromotionsruleattributeoptionsrule_type": "/admin/promotions/list-potential-rule-attributes",
    "promotions_getpromotionsrulevalueoptionsrule_typerule_attribute_id": "/admin/promotions/list-rule-values",
    "promotions_getpromotionsidrule_type": "/admin/promotions/list-rules",
    "promotions_postpromotions": "/admin/promotions/create-promotion",
    "promotions_postpromotionsidrulesbatch": "/admin/promotions/manage-rules",
    "promotions_postpromotionsidtargetrulesbatch": "/admin/promotions/manage-target-rules",
    "promotions_postpromotionsidbuyrulesbatch": "/admin/promotions/manage-buy-rules",
    "promotions_postpromotionsid": "/admin/promotions/update-a-promotion",
    "promotions_deletepromotionsid": "/admin/promotions/delete-a-promotion",
    "promotions_promotion_schema": "/admin/promotions/schema",
    "promotions": "/admin/promotions",
    "property-labels_getpropertylabelsid": "/admin/property-labels/get-a-property-label",
    "property-labels_getpropertylabels": "/admin/property-labels/list-property-labels",
    "property-labels_postpropertylabels": "/admin/property-labels/create-property-label",
    "property-labels_postpropertylabelsbatch": "/admin/property-labels/create-property-label-2",
    "property-labels_postpropertylabelsid": "/admin/property-labels/update-a-property-label",
    "property-labels_deletepropertylabelsid": "/admin/property-labels/delete-a-property-label",
    "property-labels_propertylabel_schema": "/admin/property-labels/schema",
    "property-labels": "/admin/property-labels",
    "refund-reasons_getrefundreasonsid": "/admin/refund-reasons/get-a-refund-reason",
    "refund-reasons_getrefundreasons": "/admin/refund-reasons/list-refund-reasons",
    "refund-reasons_postrefundreasons": "/admin/refund-reasons/create-refund-reason",
    "refund-reasons_postrefundreasonsid": "/admin/refund-reasons/update-a-refund-reason",
    "refund-reasons_deleterefundreasonsid": "/admin/refund-reasons/delete-a-refund-reason",
    "refund-reasons_refundreason_schema": "/admin/refund-reasons/schema",
    "refund-reasons": "/admin/refund-reasons",
    "regions_getregionsid": "/admin/regions/get-a-region",
    "regions_getregions": "/admin/regions/list-regions",
    "regions_postregions": "/admin/regions/create-region",
    "regions_postregionsid": "/admin/regions/update-a-region",
    "regions_deleteregionsid": "/admin/regions/delete-a-region",
    "regions_region_schema": "/admin/regions/schema",
    "regions": "/admin/regions",
    "reservations_getreservationsid": "/admin/reservations/get-a-reservation",
    "reservations_getreservations": "/admin/reservations/list-reservations",
    "reservations_postreservations": "/admin/reservations/create-reservation",
    "reservations_postreservationsid": "/admin/reservations/update-a-reservation",
    "reservations_deletereservationsid": "/admin/reservations/delete-a-reservation",
    "reservations_reservation_schema": "/admin/reservations/schema",
    "reservations": "/admin/reservations",
    "return-reasons_getreturnreasonsid": "/admin/return-reasons/get-a-return-reason",
    "return-reasons_getreturnreasons": "/admin/return-reasons/list-return-reasons",
    "return-reasons_postreturnreasons": "/admin/return-reasons/create-return-reason",
    "return-reasons_postreturnreasonsid": "/admin/return-reasons/update-a-return-reason",
    "return-reasons_deletereturnreasonsid": "/admin/return-reasons/delete-a-return-reason",
    "return-reasons_returnreason_schema": "/admin/return-reasons/schema",
    "return-reasons": "/admin/return-reasons",
    "returns_getreturnsid": "/admin/returns/get-a-return",
    "returns_getreturns": "/admin/returns/list-returns",
    "returns_postreturnsidshippingmethod": "/admin/returns/add-shipping-method",
    "returns_postreturnsiddismissitems": "/admin/returns/add-damaged-items",
    "returns_postreturnsidreceiveitems": "/admin/returns/add-received-items",
    "returns_postreturnsidrequestitems": "/admin/returns/add-items",
    "returns_postreturnsidcancel": "/admin/returns/cancel-a-return",
    "returns_postreturnsidreceiveconfirm": "/admin/returns/confirm-return-receival",
    "returns_postreturnsidrequest": "/admin/returns/confirm-return-request",
    "returns_postreturns": "/admin/returns/create-return",
    "returns_postreturnsidreceive": "/admin/returns/start-return-receival",
    "returns_postreturnsidreceiveitemsaction_id": "/admin/returns/update-received-item",
    "returns_postreturnsid": "/admin/returns/update-a-return",
    "returns_postreturnsidshippingmethodaction_id": "/admin/returns/update-shipping-method",
    "returns_postreturnsiddismissitemsaction_id": "/admin/returns/update-damaged-item",
    "returns_postreturnsidrequestitemsaction_id": "/admin/returns/update-requested-item",
    "returns_deletereturnsidreceive": "/admin/returns/cancel-return-receival",
    "returns_deletereturnsidrequest": "/admin/returns/cancel-return-request",
    "returns_deletereturnsidreceiveitemsaction_id": "/admin/returns/remove-received-item",
    "returns_deletereturnsiddismissitemsaction_id": "/admin/returns/remove-damaged-item",
    "returns_deletereturnsidrequestitemsaction_id": "/admin/returns/remove-item",
    "returns_deletereturnsidshippingmethodaction_id": "/admin/returns/remove-shipping-method",
    "returns_return_schema": "/admin/returns/schema",
    "returns": "/admin/returns",
    "sales-channels_getsaleschannelsid": "/admin/sales-channels/get-a-sales-channel",
    "sales-channels_getsaleschannels": "/admin/sales-channels/list-sales-channels",
    "sales-channels_postsaleschannels": "/admin/sales-channels/create-sales-channel",
    "sales-channels_postsaleschannelsidproducts": "/admin/sales-channels/manage-products",
    "sales-channels_postsaleschannelsid": "/admin/sales-channels/update-a-sales-channel",
    "sales-channels_deletesaleschannelsid": "/admin/sales-channels/delete-a-sales-channel",
    "sales-channels_saleschannel_schema": "/admin/sales-channels/schema",
    "sales-channels": "/admin/sales-channels",
    "shipping-option-types_getshippingoptiontypesid": "/admin/shipping-option-types/get-a-shipping-option-type",
    "shipping-option-types_getshippingoptiontypes": "/admin/shipping-option-types/list-shipping-option-types",
    "shipping-option-types_postshippingoptiontypes": "/admin/shipping-option-types/create-shipping-option-type",
    "shipping-option-types_postshippingoptiontypesid": "/admin/shipping-option-types/update-a-shipping-option-type",
    "shipping-option-types_deleteshippingoptiontypesid": "/admin/shipping-option-types/delete-shipping-option-type",
    "shipping-option-types_shippingoptiontype_schema": "/admin/shipping-option-types/schema",
    "shipping-option-types": "/admin/shipping-option-types",
    "shipping-options_getshippingoptionsid": "/admin/shipping-options/get-a-shipping-option",
    "shipping-options_getshippingoptions": "/admin/shipping-options/list-shipping-options",
    "shipping-options_postshippingoptions": "/admin/shipping-options/create-shipping-option",
    "shipping-options_postshippingoptionsidrulesbatch": "/admin/shipping-options/manage-rules",
    "shipping-options_postshippingoptionsid": "/admin/shipping-options/update-a-shipping-option",
    "shipping-options_deleteshippingoptionsid": "/admin/shipping-options/delete-a-shipping-option",
    "shipping-options_shippingoption_schema": "/admin/shipping-options/schema",
    "shipping-options": "/admin/shipping-options",
    "shipping-profiles_getshippingprofilesid": "/admin/shipping-profiles/get-a-shipping-profile",
    "shipping-profiles_getshippingprofiles": "/admin/shipping-profiles/list-shipping-profiles",
    "shipping-profiles_postshippingprofiles": "/admin/shipping-profiles/create-shipping-profile",
    "shipping-profiles_postshippingprofilesid": "/admin/shipping-profiles/update-a-shipping-profile",
    "shipping-profiles_deleteshippingprofilesid": "/admin/shipping-profiles/delete-a-shipping-profile",
    "shipping-profiles_shippingprofile_schema": "/admin/shipping-profiles/schema",
    "shipping-profiles": "/admin/shipping-profiles",
    "stock-locations_getstocklocationsid": "/admin/stock-locations/get-a-stock-location",
    "stock-locations_getstocklocations": "/admin/stock-locations/list-stock-locations",
    "stock-locations_poststocklocationsidfulfillmentsets": "/admin/stock-locations/add-fulfillment-set",
    "stock-locations_poststocklocations": "/admin/stock-locations/create-stock-location",
    "stock-locations_poststocklocationsidfulfillmentproviders": "/admin/stock-locations/manage-fulfillment-providers",
    "stock-locations_poststocklocationsidsaleschannels": "/admin/stock-locations/manage-sales-channels",
    "stock-locations_poststocklocationsid": "/admin/stock-locations/update-a-stock-location",
    "stock-locations_deletestocklocationsid": "/admin/stock-locations/delete-a-stock-location",
    "stock-locations_stocklocation_schema": "/admin/stock-locations/schema",
    "stock-locations": "/admin/stock-locations",
    "store-credit-accounts_getstorecreditaccountsid": "/admin/store-credit-accounts/get-a-store-credit-account",
    "store-credit-accounts_getstorecreditaccounts": "/admin/store-credit-accounts/list-store-credit-accounts",
    "store-credit-accounts_getstorecreditaccountsidtransactions": "/admin/store-credit-accounts/list-transactions",
    "store-credit-accounts_poststorecreditaccountsidcredit": "/admin/store-credit-accounts/add-credit-to-store-credit-account",
    "store-credit-accounts_poststorecreditaccounts": "/admin/store-credit-accounts/create-store-credit-account",
    "store-credit-accounts_storecreditaccount_schema": "/admin/store-credit-accounts/schema",
    "store-credit-accounts": "/admin/store-credit-accounts",
    "stores_getstoresid": "/admin/stores/get-a-store",
    "stores_getstores": "/admin/stores/list-stores",
    "stores_poststoresid": "/admin/stores/update-a-store",
    "stores_store_schema": "/admin/stores/schema",
    "stores": "/admin/stores",
    "tax-providers_gettaxproviders": "/admin/tax-providers/list-tax-providers",
    "tax-providers_taxprovider_schema": "/admin/tax-providers/schema",
    "tax-providers": "/admin/tax-providers",
    "tax-rates_gettaxratesid": "/admin/tax-rates/get-a-tax-rate",
    "tax-rates_gettaxrates": "/admin/tax-rates/list-tax-rates",
    "tax-rates_posttaxrates": "/admin/tax-rates/create-tax-rate",
    "tax-rates_posttaxratesidrules": "/admin/tax-rates/create-tax-rule",
    "tax-rates_posttaxratesid": "/admin/tax-rates/update-a-tax-rate",
    "tax-rates_deletetaxratesid": "/admin/tax-rates/delete-a-tax-rate",
    "tax-rates_deletetaxratesidrulesrule_id": "/admin/tax-rates/remove-rule",
    "tax-rates_taxrate_schema": "/admin/tax-rates/schema",
    "tax-rates": "/admin/tax-rates",
    "tax-regions_gettaxregionsid": "/admin/tax-regions/get-a-tax-region",
    "tax-regions_gettaxregions": "/admin/tax-regions/list-tax-regions",
    "tax-regions_posttaxregions": "/admin/tax-regions/create-tax-region",
    "tax-regions_posttaxregionsid": "/admin/tax-regions/update-a-tax-region",
    "tax-regions_deletetaxregionsid": "/admin/tax-regions/delete-a-tax-region",
    "tax-regions_taxregion_schema": "/admin/tax-regions/schema",
    "tax-regions": "/admin/tax-regions",
    "translations_gettranslationsentities": "/admin/translations/list-translatable-entities",
    "translations_gettranslationssettings": "/admin/translations/list-settings",
    "translations_gettranslations": "/admin/translations/list-translations",
    "translations_gettranslationsstatistics": "/admin/translations/get-statistics",
    "translations_posttranslationssettingsbatch": "/admin/translations/manage-translation-settings",
    "translations_posttranslationsbatch": "/admin/translations/manage-translations",
    "translations_translation_schema": "/admin/translations/schema",
    "translations": "/admin/translations",
    "uploads_getuploadsid": "/admin/uploads/get-a-file",
    "uploads_postuploadspresignedurls": "/admin/uploads/get-presigned-upload-url",
    "uploads_postuploads": "/admin/uploads/upload-files",
    "uploads_deleteuploadsid": "/admin/uploads/delete-a-file",
    "uploads": "/admin/uploads",
    "users_getusersid": "/admin/users/get-a-user",
    "users_getusersme": "/admin/users/get-logged-in-user",
    "users_getusers": "/admin/users/list-users",
    "users_postusersid": "/admin/users/update-a-user",
    "users_deleteusersid": "/admin/users/delete-a-user",
    "users_user_schema": "/admin/users/schema",
    "users": "/admin/users",
    "views_getviewsentityconfigurationsactive": "/admin/views/get-active-view-configuration",
    "views_getviewsentityconfigurationsid": "/admin/views/get-view-configuration",
    "views_getviewsentitycolumns": "/admin/views/list-columns",
    "views_getviewsentityconfigurations": "/admin/views/list-view-configurations",
    "views_getviewsentities": "/admin/views/list-views",
    "views_postviewsentityconfigurations": "/admin/views/create-view-configuration",
    "views_postviewsentityconfigurationsactive": "/admin/views/make-view-configuration-active",
    "views_postviewsentityconfigurationsid": "/admin/views/update-view-configuration",
    "views_deleteviewsentityconfigurationsid": "/admin/views/remove-view-configurations",
    "views_view_schema": "/admin/views/schema",
    "views": "/admin/views",
    "workflows-executions_getworkflowsexecutionsid": "/admin/workflows-executions/get-a-workflows-execution",
    "workflows-executions_getworkflowsexecutionsworkflow_idtransaction_id": "/admin/workflows-executions/get-exection",
    "workflows-executions_getworkflowsexecutions": "/admin/workflows-executions/list-workflows-executions",
    "workflows-executions_getworkflowsexecutionsworkflow_idsubscribe": "/admin/workflows-executions/subscribe-to-workflow",
    "workflows-executions_getworkflowsexecutionsworkflow_idtransaction_idsubscribe": "/admin/workflows-executions/subscribe-to-workflow-execution-events",
    "workflows-executions_postworkflowsexecutionsworkflow_idrun": "/admin/workflows-executions/execute-a-workflow",
    "workflows-executions_postworkflowsexecutionsworkflow_idstepsfailure": "/admin/workflows-executions/fail-a-step",
    "workflows-executions_postworkflowsexecutionsworkflow_idstepssuccess": "/admin/workflows-executions/succed-a-step",
    "workflows-executions": "/admin/workflows-executions"
  },
  "store": {
    "authentication": "/store/authentication",
    "publishable-api-key": "/store/publishable-api-key",
    "http-compression": "/store/http-compression",
    "manage-metadata": "/store/manage-metadata",
    "select-fields-and-relations": "/store/select-fields-and-relations",
    "query-parameter-types": "/store/query-parameter-types",
    "pagination": "/store/pagination",
    "workflows": "/store/workflows",
    "localization": "/store/localization",
    "auth_postactor_typeauth_provider": "/store/auth/authenticate-customer",
    "auth_postverificationconfirm": "/store/auth/confirm-verification",
    "auth_postactor_typeauth_providerresetpassword": "/store/auth/generate-reset-password-token",
    "auth_postadminauthtokenrefresh": "/store/auth/refresh-authentication-token",
    "auth_postverificationrequest": "/store/auth/request-verification",
    "auth_postactor_typeauth_providerupdate": "/store/auth/reset-password",
    "auth_postactor_typeauth_provider_register": "/store/auth/retrieve-registration-jwt-token",
    "auth_postsession": "/store/auth/set-authentication-session",
    "auth_postactor_typeauth_providercallback": "/store/auth/validate-authentication-callback",
    "auth_postactor_typeauth_providerverificationconfirm": "/store/auth/verify-the-customers-email",
    "auth_deletesession": "/store/auth/delete-authentication-session",
    "auth": "/store/auth",
    "carts_getcartsid": "/store/carts/get-a-cart",
    "carts_postcartsidgiftcards": "/store/carts/add-gift-card",
    "carts_postcartsidlineitems": "/store/carts/add-line-item",
    "carts_postcartsidpromotions": "/store/carts/add-promotions",
    "carts_postcartsidshippingmethods": "/store/carts/add-shipping-method",
    "carts_postcartsidstorecredits": "/store/carts/add-store-credit",
    "carts_postcartsidtaxes": "/store/carts/calculate-taxes",
    "carts_postcartsidcustomer": "/store/carts/change-customer",
    "carts_postcartsidcomplete": "/store/carts/complete-cart",
    "carts_postcarts": "/store/carts/create-cart",
    "carts_postcartsid": "/store/carts/update-a-cart",
    "carts_postcartsidlineitemsline_id": "/store/carts/update-line-item",
    "carts_deletecartsidgiftcards": "/store/carts/remove-gift-card",
    "carts_deletecartsidlineitemsline_id": "/store/carts/remove-line-item",
    "carts_deletecartsidpromotions": "/store/carts/remove-promotions-from-cart",
    "carts_cart_schema": "/store/carts/schema",
    "carts": "/store/carts",
    "collections_getcollectionsid": "/store/collections/get-a-collection",
    "collections_getcollections": "/store/collections/list-collections",
    "collections_collection_schema": "/store/collections/schema",
    "collections": "/store/collections",
    "currencies_getcurrenciescode": "/store/currencies/get-a-currency",
    "currencies_getcurrencies": "/store/currencies/list-currencies",
    "currencies_currency_schema": "/store/currencies/schema",
    "currencies": "/store/currencies",
    "customers_getcustomersmeaddressesaddress_id": "/store/customers/get-address",
    "customers_getcustomersme": "/store/customers/get-customer",
    "customers_getcustomersmeaddresses": "/store/customers/list-customers-addresses",
    "customers_postcustomersmeaddresses": "/store/customers/create-address",
    "customers_postcustomers": "/store/customers/register-customer",
    "customers_postcustomersme": "/store/customers/update-customer",
    "customers_postcustomersmeaddressesaddress_id": "/store/customers/update-address",
    "customers_deletecustomersmeaddressesaddress_id": "/store/customers/remove-address",
    "customers_customer_schema": "/store/customers/schema",
    "customers": "/store/customers",
    "gift-cards_getgiftcardsidorcode": "/store/gift-cards/get-gift-card",
    "gift-cards_giftcard_schema": "/store/gift-cards/schema",
    "gift-cards": "/store/gift-cards",
    "locales_getlocales": "/store/locales/list-locales",
    "locales_locale_schema": "/store/locales/schema",
    "locales": "/store/locales",
    "multi-factor-authentication-(mfa)-factors_getmfafactors": "/store/multi-factor-authentication-(mfa)-factors/list-mfa-factors",
    "multi-factor-authentication-(mfa)-factors_postmfarecoverycodes": "/store/multi-factor-authentication-(mfa)-factors/generate-mfa-recovery-codes",
    "multi-factor-authentication-(mfa)-factors_postmfafactors": "/store/multi-factor-authentication-(mfa)-factors/start-mfa-factor-enrollment",
    "multi-factor-authentication-(mfa)-factors_postmfachallengesidverify": "/store/multi-factor-authentication-(mfa)-factors/verify-mfa-challenge",
    "multi-factor-authentication-(mfa)-factors_postmfafactorsidverify": "/store/multi-factor-authentication-(mfa)-factors/verify-and-enable-mfa-factor",
    "multi-factor-authentication-(mfa)-factors_deletemfafactorsid": "/store/multi-factor-authentication-(mfa)-factors/disable-mfa-factor",
    "multi-factor-authentication-(mfa)-factors": "/store/multi-factor-authentication-(mfa)-factors",
    "orders_getordersid": "/store/orders/get-an-order",
    "orders_getorders": "/store/orders/list-orders",
    "orders_postordersidtransferaccept": "/store/orders/accept-transfer",
    "orders_postordersidtransfercancel": "/store/orders/cancel-transfer",
    "orders_postordersidtransferdecline": "/store/orders/decline-transfer",
    "orders_postordersidtransferrequest": "/store/orders/request-order-transfer",
    "orders_order_schema": "/store/orders/schema",
    "orders": "/store/orders",
    "payment-collections_postpaymentcollections": "/store/payment-collections/create-payment-collection",
    "payment-collections_postpaymentcollectionsidpaymentsessions": "/store/payment-collections/initialize-payment-session",
    "payment-collections_paymentcollection_schema": "/store/payment-collections/schema",
    "payment-collections": "/store/payment-collections",
    "payment-providers_getpaymentproviders": "/store/payment-providers/list-payment-providers",
    "payment-providers_paymentprovider_schema": "/store/payment-providers/schema",
    "payment-providers": "/store/payment-providers",
    "product-categories_getproductcategoriesid": "/store/product-categories/get-a-product-category",
    "product-categories_getproductcategories": "/store/product-categories/list-product-categories",
    "product-categories_productcategory_schema": "/store/product-categories/schema",
    "product-categories": "/store/product-categories",
    "product-options_getproductoptionsid": "/store/product-options/get-a-product-option",
    "product-options_getproductoptions": "/store/product-options/list-product-options",
    "product-options_productoption_schema": "/store/product-options/schema",
    "product-options": "/store/product-options",
    "product-tags_getproducttagsid": "/store/product-tags/get-a-product-tag",
    "product-tags_getproducttags": "/store/product-tags/list-product-tags",
    "product-tags_producttag_schema": "/store/product-tags/schema",
    "product-tags": "/store/product-tags",
    "product-types_getproducttypesid": "/store/product-types/get-a-product-type",
    "product-types_getproducttypes": "/store/product-types/list-product-types",
    "product-types_producttype_schema": "/store/product-types/schema",
    "product-types": "/store/product-types",
    "product-variants_getproductvariants": "/store/product-variants/list-product-variants",
    "product-variants_productvariant_schema": "/store/product-variants/schema",
    "product-variants": "/store/product-variants",
    "products_getproductsid": "/store/products/get-a-product",
    "products_getproducts": "/store/products/list-products",
    "products_product_schema": "/store/products/schema",
    "products": "/store/products",
    "regions_getregionsid": "/store/regions/get-a-region",
    "regions_getregions": "/store/regions/list-regions",
    "regions_region_schema": "/store/regions/schema",
    "regions": "/store/regions",
    "return-reasons_getreturnreasonsid": "/store/return-reasons/get-a-return-reason",
    "return-reasons_getreturnreasons": "/store/return-reasons/list-return-reasons",
    "return-reasons_returnreason_schema": "/store/return-reasons/schema",
    "return-reasons": "/store/return-reasons",
    "returns_postreturns": "/store/returns/create-return",
    "returns_return_schema": "/store/returns/schema",
    "returns": "/store/returns",
    "shipping-options_getshippingoptions": "/store/shipping-options/list-shipping-options-for-cart",
    "shipping-options_postshippingoptionsidcalculate": "/store/shipping-options/calculate-shipping-option-price",
    "shipping-options_shippingoption_schema": "/store/shipping-options/schema",
    "shipping-options": "/store/shipping-options",
    "store-credit-accounts_getstorecreditaccountsid": "/store/store-credit-accounts/get-store-credit-account",
    "store-credit-accounts_getstorecreditaccounts": "/store/store-credit-accounts/list-store-credit-accounts",
    "store-credit-accounts_poststorecreditaccountsclaim": "/store/store-credit-accounts/claim-store-credit-account",
    "store-credit-accounts_storecreditaccount_schema": "/store/store-credit-accounts/schema",
    "store-credit-accounts": "/store/store-credit-accounts"
  }
}
