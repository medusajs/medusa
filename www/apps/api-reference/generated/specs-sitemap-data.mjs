export const specsSitemapData = {
  "admin": [
    {
      "tagSectionId": "api-keys",
      "operationSectionIds": [
        "api-keys_getapikeys",
        "api-keys_postapikeys",
        "api-keys_getapikeysid",
        "api-keys_postapikeysid",
        "api-keys_deleteapikeysid",
        "api-keys_postapikeysidrevoke",
        "api-keys_postapikeysidsaleschannels"
      ]
    },
    {
      "tagSectionId": "auth",
      "operationSectionIds": [
        "auth_postsession",
        "auth_deletesession",
        "auth_postadminauthtokenrefresh",
        "auth_postactor_typeauth_provider",
        "auth_postactor_typeauth_providercallback",
        "auth_postactor_typeauth_provider_register",
        "auth_postactor_typeauth_providerresetpassword",
        "auth_postactor_typeauth_providerupdate"
      ]
    },
    {
      "tagSectionId": "campaigns",
      "operationSectionIds": [
        "campaigns_getcampaigns",
        "campaigns_postcampaigns",
        "campaigns_getcampaignsid",
        "campaigns_postcampaignsid",
        "campaigns_deletecampaignsid",
        "campaigns_postcampaignsidpromotions"
      ]
    },
    {
      "tagSectionId": "claims",
      "operationSectionIds": [
        "claims_getclaimsid",
        "claims_postclaimsidcancel",
        "claims_postclaimsidinbounditems",
        "claims_getclaims",
        "claims_postclaims",
        "claims_postclaimsidinboundshippingmethod",
        "claims_postclaimsidclaimitemsaction_id",
        "claims_deleteclaimsidclaimitemsaction_id",
        "claims_postclaimsidclaimitems",
        "claims_postclaimsidoutbounditems",
        "claims_postclaimsidinbounditemsaction_id",
        "claims_deleteclaimsidinbounditemsaction_id",
        "claims_postclaimsidinboundshippingmethodaction_id",
        "claims_deleteclaimsidinboundshippingmethodaction_id",
        "claims_postclaimsidoutbounditemsaction_id",
        "claims_deleteclaimsidoutbounditemsaction_id",
        "claims_postclaimsidoutboundshippingmethod",
        "claims_postclaimsidoutboundshippingmethodaction_id",
        "claims_deleteclaimsidoutboundshippingmethodaction_id",
        "claims_postclaimsidrequest",
        "claims_deleteclaimsidrequest"
      ]
    },
    {
      "tagSectionId": "collections",
      "operationSectionIds": [
        "collections_getcollections",
        "collections_postcollections",
        "collections_getcollectionsid",
        "collections_postcollectionsid",
        "collections_deletecollectionsid",
        "collections_postcollectionsidproducts"
      ]
    },
    {
      "tagSectionId": "currencies",
      "operationSectionIds": [
        "currencies_getcurrenciescode",
        "currencies_getcurrencies"
      ]
    },
    {
      "tagSectionId": "customer-groups",
      "operationSectionIds": [
        "customer-groups_getcustomergroups",
        "customer-groups_postcustomergroups",
        "customer-groups_getcustomergroupsid",
        "customer-groups_postcustomergroupsid",
        "customer-groups_deletecustomergroupsid",
        "customer-groups_postcustomergroupsidcustomers"
      ]
    },
    {
      "tagSectionId": "customers",
      "operationSectionIds": [
        "customers_getcustomersid",
        "customers_postcustomersid",
        "customers_deletecustomersid",
        "customers_getcustomers",
        "customers_postcustomers",
        "customers_getcustomersidaddresses",
        "customers_postcustomersidaddresses",
        "customers_postcustomersidcustomergroups",
        "customers_getcustomersidaddressesaddress_id",
        "customers_postcustomersidaddressesaddress_id",
        "customers_deletecustomersidaddressesaddress_id"
      ]
    },
    {
      "tagSectionId": "draft-orders",
      "operationSectionIds": [
        "draft-orders_getdraftorders",
        "draft-orders_postdraftorders",
        "draft-orders_getdraftordersid",
        "draft-orders_postdraftordersid",
        "draft-orders_deletedraftordersid",
        "draft-orders_postdraftordersidedititemsitemitem_id",
        "draft-orders_postdraftordersidedititems",
        "draft-orders_postdraftordersidconverttoorder",
        "draft-orders_postdraftordersidedit",
        "draft-orders_deletedraftordersidedit",
        "draft-orders_postdraftordersideditpromotions",
        "draft-orders_deletedraftordersideditpromotions",
        "draft-orders_postdraftordersideditrequest",
        "draft-orders_postdraftordersideditshippingmethodsmethodmethod_id",
        "draft-orders_deletedraftordersideditshippingmethodsmethodmethod_id",
        "draft-orders_postdraftordersideditshippingmethodsaction_id",
        "draft-orders_deletedraftordersideditshippingmethodsaction_id",
        "draft-orders_postdraftordersidedititemsaction_id",
        "draft-orders_deletedraftordersidedititemsaction_id",
        "draft-orders_postdraftordersideditshippingmethods",
        "draft-orders_postdraftordersideditconfirm"
      ]
    },
    {
      "tagSectionId": "exchanges",
      "operationSectionIds": [
        "exchanges_getexchanges",
        "exchanges_postexchanges",
        "exchanges_getexchangesid",
        "exchanges_postexchangesidinbounditems",
        "exchanges_postexchangesidcancel",
        "exchanges_postexchangesidinbounditemsaction_id",
        "exchanges_deleteexchangesidinbounditemsaction_id",
        "exchanges_postexchangesidinboundshippingmethodaction_id",
        "exchanges_deleteexchangesidinboundshippingmethodaction_id",
        "exchanges_postexchangesidoutbounditemsaction_id",
        "exchanges_deleteexchangesidoutbounditemsaction_id",
        "exchanges_postexchangesidoutbounditems",
        "exchanges_postexchangesidrequest",
        "exchanges_deleteexchangesidrequest",
        "exchanges_postexchangesidoutboundshippingmethod",
        "exchanges_postexchangesidinboundshippingmethod",
        "exchanges_postexchangesidoutboundshippingmethodaction_id",
        "exchanges_deleteexchangesidoutboundshippingmethodaction_id"
      ]
    },
    {
      "tagSectionId": "feature-flags",
      "operationSectionIds": [
        "feature-flags_getfeatureflags"
      ]
    },
    {
      "tagSectionId": "fulfillment-providers",
      "operationSectionIds": [
        "fulfillment-providers_getfulfillmentproviders",
        "fulfillment-providers_getfulfillmentprovidersidoptions"
      ]
    },
    {
      "tagSectionId": "fulfillment-sets",
      "operationSectionIds": [
        "fulfillment-sets_deletefulfillmentsetsid",
        "fulfillment-sets_postfulfillmentsetsidservicezones",
        "fulfillment-sets_getfulfillmentsetsidservicezoneszone_id",
        "fulfillment-sets_postfulfillmentsetsidservicezoneszone_id",
        "fulfillment-sets_deletefulfillmentsetsidservicezoneszone_id"
      ]
    },
    {
      "tagSectionId": "fulfillments",
      "operationSectionIds": [
        "fulfillments_postfulfillments",
        "fulfillments_postfulfillmentsidcancel",
        "fulfillments_postfulfillmentsidshipment"
      ]
    },
    {
      "tagSectionId": "gift-cards",
      "operationSectionIds": [
        "gift-cards_getgiftcards",
        "gift-cards_postgiftcards",
        "gift-cards_getgiftcardsid",
        "gift-cards_postgiftcardsid",
        "gift-cards_getgiftcardsidorders"
      ]
    },
    {
      "tagSectionId": "index",
      "operationSectionIds": [
        "index_getindexdetails",
        "index_postindexsync"
      ]
    },
    {
      "tagSectionId": "inventory-items",
      "operationSectionIds": [
        "inventory-items_postinventoryitemslocationlevelsbatch",
        "inventory-items_getinventoryitems",
        "inventory-items_postinventoryitems",
        "inventory-items_postinventoryitemsidlocationlevelsbatch",
        "inventory-items_getinventoryitemsid",
        "inventory-items_postinventoryitemsid",
        "inventory-items_deleteinventoryitemsid",
        "inventory-items_getinventoryitemsidlocationlevels",
        "inventory-items_postinventoryitemsidlocationlevels",
        "inventory-items_postinventoryitemsidlocationlevelslocation_id",
        "inventory-items_deleteinventoryitemsidlocationlevelslocation_id"
      ]
    },
    {
      "tagSectionId": "invites",
      "operationSectionIds": [
        "invites_getinvitesid",
        "invites_deleteinvitesid",
        "invites_postinvitesidresend",
        "invites_postinvitesaccept",
        "invites_getinvites",
        "invites_postinvites"
      ]
    },
    {
      "tagSectionId": "locales",
      "operationSectionIds": [
        "locales_getlocales",
        "locales_getlocalescode"
      ]
    },
    {
      "tagSectionId": "notifications",
      "operationSectionIds": [
        "notifications_getnotificationsid",
        "notifications_getnotifications"
      ]
    },
    {
      "tagSectionId": "order-changes",
      "operationSectionIds": [
        "order-changes_postorderchangesid"
      ]
    },
    {
      "tagSectionId": "order-edits",
      "operationSectionIds": [
        "order-edits_postorderedits",
        "order-edits_deleteordereditsid",
        "order-edits_postordereditsiditems",
        "order-edits_postordereditsidconfirm",
        "order-edits_postordereditsiditemsitemitem_id",
        "order-edits_postordereditsidrequest",
        "order-edits_postordereditsidshippingmethodaction_id",
        "order-edits_deleteordereditsidshippingmethodaction_id",
        "order-edits_postordereditsidshippingmethod",
        "order-edits_postordereditsiditemsaction_id",
        "order-edits_deleteordereditsiditemsaction_id"
      ]
    },
    {
      "tagSectionId": "orders",
      "operationSectionIds": [
        "orders_getordersid",
        "orders_postordersid",
        "orders_postordersidcancel",
        "orders_postordersidarchive",
        "orders_postordersidcomplete",
        "orders_postordersidfulfillmentsfulfillment_idcancel",
        "orders_postordersidcreditlines",
        "orders_getorders",
        "orders_postordersidfulfillmentsfulfillment_idmarkasdelivered",
        "orders_getordersidchanges",
        "orders_getordersidlineitems",
        "orders_getordersidpreview",
        "orders_postordersidtransfer",
        "orders_postordersidfulfillmentsfulfillment_idshipments",
        "orders_getordersidshippingoptions",
        "orders_postordersexport",
        "orders_postordersidtransfercancel",
        "orders_postordersidfulfillments"
      ]
    },
    {
      "tagSectionId": "payment-collections",
      "operationSectionIds": [
        "payment-collections_deletepaymentcollectionsid",
        "payment-collections_postpaymentcollections",
        "payment-collections_postpaymentcollectionsidmarkaspaid",
        "payment-collections_postpaymentcollectionsidpaymentsessions"
      ]
    },
    {
      "tagSectionId": "payments",
      "operationSectionIds": [
        "payments_getpaymentspaymentproviders",
        "payments_getpaymentsid",
        "payments_postpaymentsidcapture",
        "payments_postpaymentsidrefund",
        "payments_getpayments"
      ]
    },
    {
      "tagSectionId": "plugins",
      "operationSectionIds": [
        "plugins_getplugins"
      ]
    },
    {
      "tagSectionId": "price-lists",
      "operationSectionIds": [
        "price-lists_getpricelistsid",
        "price-lists_postpricelistsid",
        "price-lists_deletepricelistsid",
        "price-lists_getpricelists",
        "price-lists_postpricelists",
        "price-lists_getpricelistsidprices",
        "price-lists_postpricelistsidproducts",
        "price-lists_postpricelistsidpricesbatch"
      ]
    },
    {
      "tagSectionId": "price-preferences",
      "operationSectionIds": [
        "price-preferences_getpricepreferencesid",
        "price-preferences_postpricepreferencesid",
        "price-preferences_deletepricepreferencesid",
        "price-preferences_getpricepreferences",
        "price-preferences_postpricepreferences"
      ]
    },
    {
      "tagSectionId": "product-categories",
      "operationSectionIds": [
        "product-categories_postproductcategoriesidproducts",
        "product-categories_getproductcategories",
        "product-categories_postproductcategories",
        "product-categories_getproductcategoriesid",
        "product-categories_postproductcategoriesid",
        "product-categories_deleteproductcategoriesid"
      ]
    },
    {
      "tagSectionId": "product-tags",
      "operationSectionIds": [
        "product-tags_getproducttagsid",
        "product-tags_postproducttagsid",
        "product-tags_deleteproducttagsid",
        "product-tags_getproducttags",
        "product-tags_postproducttags"
      ]
    },
    {
      "tagSectionId": "product-types",
      "operationSectionIds": [
        "product-types_getproducttypesid",
        "product-types_postproducttypesid",
        "product-types_deleteproducttypesid",
        "product-types_getproducttypes",
        "product-types_postproducttypes"
      ]
    },
    {
      "tagSectionId": "product-variants",
      "operationSectionIds": [
        "product-variants_getproductvariants"
      ]
    },
    {
      "tagSectionId": "products",
      "operationSectionIds": [
        "products_postproductsimport",
        "products_getproductsid",
        "products_postproductsid",
        "products_deleteproductsid",
        "products_getproducts",
        "products_postproducts",
        "products_postproductsbatch",
        "products_postproductsimportstransaction_idconfirm",
        "products_postproductsimports",
        "products_postproductsidimagesimage_idvariantsbatch",
        "products_getproductsidoptionsoption_id",
        "products_postproductsidoptionsoption_id",
        "products_deleteproductsidoptionsoption_id",
        "products_postproductsexport",
        "products_postproductsidvariantsbatch",
        "products_getproductsidoptions",
        "products_postproductsidoptions",
        "products_getproductsidvariantsvariant_id",
        "products_postproductsidvariantsvariant_id",
        "products_deleteproductsidvariantsvariant_id",
        "products_postproductsidvariantsinventoryitemsbatch",
        "products_postproductsidvariantsvariant_idinventoryitems",
        "products_postproductsidvariantsvariant_idimagesbatch",
        "products_postproductsidvariantsvariant_idinventoryitemsinventory_item_id",
        "products_deleteproductsidvariantsvariant_idinventoryitemsinventory_item_id",
        "products_getproductsidvariants",
        "products_postproductsidvariants",
        "products_postproductsimporttransaction_idconfirm"
      ]
    },
    {
      "tagSectionId": "promotions",
      "operationSectionIds": [
        "promotions_getpromotionsruleattributeoptionsrule_type",
        "promotions_getpromotionsrulevalueoptionsrule_typerule_attribute_id",
        "promotions_postpromotionsidbuyrulesbatch",
        "promotions_postpromotionsidtargetrulesbatch",
        "promotions_getpromotionsid",
        "promotions_postpromotionsid",
        "promotions_deletepromotionsid",
        "promotions_getpromotionsidrule_type",
        "promotions_getpromotions",
        "promotions_postpromotions",
        "promotions_postpromotionsidrulesbatch"
      ]
    },
    {
      "tagSectionId": "property-labels",
      "operationSectionIds": [
        "property-labels_getpropertylabelsid",
        "property-labels_postpropertylabelsid",
        "property-labels_deletepropertylabelsid",
        "property-labels_postpropertylabelsbatch",
        "property-labels_getpropertylabels",
        "property-labels_postpropertylabels"
      ]
    },
    {
      "tagSectionId": "refund-reasons",
      "operationSectionIds": [
        "refund-reasons_getrefundreasonsid",
        "refund-reasons_postrefundreasonsid",
        "refund-reasons_deleterefundreasonsid",
        "refund-reasons_getrefundreasons",
        "refund-reasons_postrefundreasons"
      ]
    },
    {
      "tagSectionId": "regions",
      "operationSectionIds": [
        "regions_getregions",
        "regions_postregions",
        "regions_getregionsid",
        "regions_postregionsid",
        "regions_deleteregionsid"
      ]
    },
    {
      "tagSectionId": "reservations",
      "operationSectionIds": [
        "reservations_getreservationsid",
        "reservations_postreservationsid",
        "reservations_deletereservationsid",
        "reservations_getreservations",
        "reservations_postreservations"
      ]
    },
    {
      "tagSectionId": "return-reasons",
      "operationSectionIds": [
        "return-reasons_getreturnreasonsid",
        "return-reasons_postreturnreasonsid",
        "return-reasons_deletereturnreasonsid",
        "return-reasons_getreturnreasons",
        "return-reasons_postreturnreasons"
      ]
    },
    {
      "tagSectionId": "returns",
      "operationSectionIds": [
        "returns_getreturnsid",
        "returns_postreturnsid",
        "returns_postreturnsiddismissitems",
        "returns_postreturnsidcancel",
        "returns_postreturnsidreceiveitems",
        "returns_postreturnsidreceive",
        "returns_deletereturnsidreceive",
        "returns_postreturnsidreceiveconfirm",
        "returns_postreturnsiddismissitemsaction_id",
        "returns_deletereturnsiddismissitemsaction_id",
        "returns_postreturnsidrequestitems",
        "returns_postreturnsidreceiveitemsaction_id",
        "returns_deletereturnsidreceiveitemsaction_id",
        "returns_postreturnsidshippingmethod",
        "returns_postreturnsidrequest",
        "returns_deletereturnsidrequest",
        "returns_getreturns",
        "returns_postreturns",
        "returns_postreturnsidrequestitemsaction_id",
        "returns_deletereturnsidrequestitemsaction_id",
        "returns_postreturnsidshippingmethodaction_id",
        "returns_deletereturnsidshippingmethodaction_id"
      ]
    },
    {
      "tagSectionId": "sales-channels",
      "operationSectionIds": [
        "sales-channels_postsaleschannelsidproducts",
        "sales-channels_getsaleschannelsid",
        "sales-channels_postsaleschannelsid",
        "sales-channels_deletesaleschannelsid",
        "sales-channels_getsaleschannels",
        "sales-channels_postsaleschannels"
      ]
    },
    {
      "tagSectionId": "shipping-option-types",
      "operationSectionIds": [
        "shipping-option-types_getshippingoptiontypesid",
        "shipping-option-types_postshippingoptiontypesid",
        "shipping-option-types_deleteshippingoptiontypesid",
        "shipping-option-types_getshippingoptiontypes",
        "shipping-option-types_postshippingoptiontypes"
      ]
    },
    {
      "tagSectionId": "shipping-options",
      "operationSectionIds": [
        "shipping-options_getshippingoptions",
        "shipping-options_postshippingoptions",
        "shipping-options_postshippingoptionsidrulesbatch",
        "shipping-options_getshippingoptionsid",
        "shipping-options_postshippingoptionsid",
        "shipping-options_deleteshippingoptionsid"
      ]
    },
    {
      "tagSectionId": "shipping-profiles",
      "operationSectionIds": [
        "shipping-profiles_getshippingprofiles",
        "shipping-profiles_postshippingprofiles",
        "shipping-profiles_getshippingprofilesid",
        "shipping-profiles_postshippingprofilesid",
        "shipping-profiles_deleteshippingprofilesid"
      ]
    },
    {
      "tagSectionId": "stock-locations",
      "operationSectionIds": [
        "stock-locations_getstocklocations",
        "stock-locations_poststocklocations",
        "stock-locations_getstocklocationsid",
        "stock-locations_poststocklocationsid",
        "stock-locations_deletestocklocationsid",
        "stock-locations_poststocklocationsidfulfillmentproviders",
        "stock-locations_poststocklocationsidsaleschannels",
        "stock-locations_poststocklocationsidfulfillmentsets"
      ]
    },
    {
      "tagSectionId": "store-credit-accounts",
      "operationSectionIds": [
        "store-credit-accounts_getstorecreditaccountsid",
        "store-credit-accounts_getstorecreditaccounts",
        "store-credit-accounts_poststorecreditaccounts",
        "store-credit-accounts_poststorecreditaccountsidcredit",
        "store-credit-accounts_getstorecreditaccountsidtransactions"
      ]
    },
    {
      "tagSectionId": "stores",
      "operationSectionIds": [
        "stores_getstoresid",
        "stores_poststoresid",
        "stores_getstores"
      ]
    },
    {
      "tagSectionId": "tax-providers",
      "operationSectionIds": [
        "tax-providers_gettaxproviders"
      ]
    },
    {
      "tagSectionId": "tax-rates",
      "operationSectionIds": [
        "tax-rates_gettaxrates",
        "tax-rates_posttaxrates",
        "tax-rates_posttaxratesidrules",
        "tax-rates_gettaxratesid",
        "tax-rates_posttaxratesid",
        "tax-rates_deletetaxratesid",
        "tax-rates_deletetaxratesidrulesrule_id"
      ]
    },
    {
      "tagSectionId": "tax-regions",
      "operationSectionIds": [
        "tax-regions_gettaxregions",
        "tax-regions_posttaxregions",
        "tax-regions_gettaxregionsid",
        "tax-regions_posttaxregionsid",
        "tax-regions_deletetaxregionsid"
      ]
    },
    {
      "tagSectionId": "translations",
      "operationSectionIds": [
        "translations_gettranslations",
        "translations_gettranslationsentities",
        "translations_posttranslationsbatch",
        "translations_gettranslationssettings",
        "translations_gettranslationsstatistics",
        "translations_posttranslationssettingsbatch"
      ]
    },
    {
      "tagSectionId": "uploads",
      "operationSectionIds": [
        "uploads_postuploads",
        "uploads_postuploadspresignedurls",
        "uploads_getuploadsid",
        "uploads_deleteuploadsid"
      ]
    },
    {
      "tagSectionId": "users",
      "operationSectionIds": [
        "users_getusersme",
        "users_getusersid",
        "users_postusersid",
        "users_deleteusersid",
        "users_getusers"
      ]
    },
    {
      "tagSectionId": "views",
      "operationSectionIds": [
        "views_getviewsentitycolumns",
        "views_getviewsentityconfigurationsactive",
        "views_postviewsentityconfigurationsactive",
        "views_getviewsentityconfigurationsid",
        "views_postviewsentityconfigurationsid",
        "views_deleteviewsentityconfigurationsid",
        "views_getviewsentities",
        "views_getviewsentityconfigurations",
        "views_postviewsentityconfigurations"
      ]
    },
    {
      "tagSectionId": "workflows-executions",
      "operationSectionIds": [
        "workflows-executions_getworkflowsexecutionsid",
        "workflows-executions_postworkflowsexecutionsworkflow_idstepsfailure",
        "workflows-executions_postworkflowsexecutionsworkflow_idrun",
        "workflows-executions_getworkflowsexecutionsworkflow_idsubscribe",
        "workflows-executions_postworkflowsexecutionsworkflow_idstepssuccess",
        "workflows-executions_getworkflowsexecutions",
        "workflows-executions_getworkflowsexecutionsworkflow_idtransaction_id",
        "workflows-executions_getworkflowsexecutionsworkflow_idtransaction_idsubscribe"
      ]
    }
  ],
  "store": [
    {
      "tagSectionId": "auth",
      "operationSectionIds": [
        "auth_postactor_typeauth_provider",
        "auth_postactor_typeauth_providercallback",
        "auth_postactor_typeauth_providerresetpassword",
        "auth_postsession",
        "auth_deletesession",
        "auth_postactor_typeauth_provider_register",
        "auth_postadminauthtokenrefresh",
        "auth_postactor_typeauth_providerupdate"
      ]
    },
    {
      "tagSectionId": "carts",
      "operationSectionIds": [
        "carts_postcarts",
        "carts_postcartsidgiftcards",
        "carts_deletecartsidgiftcards",
        "carts_postcartsidcomplete",
        "carts_postcartsidlineitems",
        "carts_postcartsidpromotions",
        "carts_deletecartsidpromotions",
        "carts_postcartsidstorecredits",
        "carts_postcartsidshippingmethods",
        "carts_postcartsidlineitemsline_id",
        "carts_deletecartsidlineitemsline_id",
        "carts_getcartsid",
        "carts_postcartsid",
        "carts_postcartsidtaxes",
        "carts_postcartsidcustomer"
      ]
    },
    {
      "tagSectionId": "collections",
      "operationSectionIds": [
        "collections_getcollectionsid",
        "collections_getcollections"
      ]
    },
    {
      "tagSectionId": "currencies",
      "operationSectionIds": [
        "currencies_getcurrencies",
        "currencies_getcurrenciescode"
      ]
    },
    {
      "tagSectionId": "customers",
      "operationSectionIds": [
        "customers_postcustomers",
        "customers_getcustomersme",
        "customers_postcustomersme",
        "customers_getcustomersmeaddresses",
        "customers_postcustomersmeaddresses",
        "customers_getcustomersmeaddressesaddress_id",
        "customers_postcustomersmeaddressesaddress_id",
        "customers_deletecustomersmeaddressesaddress_id"
      ]
    },
    {
      "tagSectionId": "gift-cards",
      "operationSectionIds": [
        "gift-cards_getgiftcardsidorcode"
      ]
    },
    {
      "tagSectionId": "locales",
      "operationSectionIds": [
        "locales_getlocales"
      ]
    },
    {
      "tagSectionId": "orders",
      "operationSectionIds": [
        "orders_getordersid",
        "orders_getorders",
        "orders_postordersidtransferaccept",
        "orders_postordersidtransfercancel",
        "orders_postordersidtransferdecline",
        "orders_postordersidtransferrequest"
      ]
    },
    {
      "tagSectionId": "payment-collections",
      "operationSectionIds": [
        "payment-collections_postpaymentcollections",
        "payment-collections_postpaymentcollectionsidpaymentsessions"
      ]
    },
    {
      "tagSectionId": "payment-providers",
      "operationSectionIds": [
        "payment-providers_getpaymentproviders"
      ]
    },
    {
      "tagSectionId": "product-categories",
      "operationSectionIds": [
        "product-categories_getproductcategoriesid",
        "product-categories_getproductcategories"
      ]
    },
    {
      "tagSectionId": "product-tags",
      "operationSectionIds": [
        "product-tags_getproducttagsid",
        "product-tags_getproducttags"
      ]
    },
    {
      "tagSectionId": "product-types",
      "operationSectionIds": [
        "product-types_getproducttypesid",
        "product-types_getproducttypes"
      ]
    },
    {
      "tagSectionId": "products",
      "operationSectionIds": [
        "products_getproducts",
        "products_getproductsid"
      ]
    },
    {
      "tagSectionId": "regions",
      "operationSectionIds": [
        "regions_getregionsid",
        "regions_getregions"
      ]
    },
    {
      "tagSectionId": "return-reasons",
      "operationSectionIds": [
        "return-reasons_getreturnreasonsid",
        "return-reasons_getreturnreasons"
      ]
    },
    {
      "tagSectionId": "returns",
      "operationSectionIds": [
        "returns_postreturns"
      ]
    },
    {
      "tagSectionId": "shipping-options",
      "operationSectionIds": [
        "shipping-options_postshippingoptionsidcalculate",
        "shipping-options_getshippingoptions"
      ]
    },
    {
      "tagSectionId": "store-credit-accounts",
      "operationSectionIds": [
        "store-credit-accounts_getstorecreditaccountsid",
        "store-credit-accounts_getstorecreditaccounts",
        "store-credit-accounts_poststorecreditaccountsclaim"
      ]
    }
  ]
}
