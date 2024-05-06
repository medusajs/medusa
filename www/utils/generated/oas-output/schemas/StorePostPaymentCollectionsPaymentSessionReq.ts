/**
 * @schema StorePostPaymentCollectionsPaymentSessionReq
 * type: object
 * description: SUMMARY
 * x-schemaName: StorePostPaymentCollectionsPaymentSessionReq
 * required:
 *   - provider_id
 * properties:
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The payment collection's provider id.
 *   context:
 *     type: object
 *     description: The payment collection's context.
 *     properties:
 *       billing_address:
 *         type: object
 *         description: The context's billing address.
 *         properties:
 *           id:
 *             type: string
 *             title: id
 *             description: The billing address's ID.
 *           address_1:
 *             type: string
 *             title: address_1
 *             description: The billing address's address 1.
 *           address_2:
 *             type: string
 *             title: address_2
 *             description: The billing address's address 2.
 *           company:
 *             type: string
 *             title: company
 *             description: The billing address's company.
 *           country_code:
 *             type: string
 *             title: country_code
 *             description: The billing address's country code.
 *           city:
 *             type: string
 *             title: city
 *             description: The billing address's city.
 *           phone:
 *             type: string
 *             title: phone
 *             description: The billing address's phone.
 *           postal_code:
 *             type: string
 *             title: postal_code
 *             description: The billing address's postal code.
 *           province:
 *             type: string
 *             title: province
 *             description: The billing address's province.
 *           metadata:
 *             type: object
 *             description: The billing address's metadata.
 *             properties: {}
 *           created_at:
 *             oneOf:
 *               - type: string
 *                 title: created_at
 *                 description: The billing address's created at.
 *               - type: string
 *                 title: created_at
 *                 description: The billing address's created at.
 *                 format: date-time
 *           updated_at:
 *             oneOf:
 *               - type: string
 *                 title: updated_at
 *                 description: The billing address's updated at.
 *               - type: string
 *                 title: updated_at
 *                 description: The billing address's updated at.
 *                 format: date-time
 *           deleted_at:
 *             oneOf:
 *               - type: string
 *                 title: deleted_at
 *                 description: The billing address's deleted at.
 *               - type: string
 *                 title: deleted_at
 *                 description: The billing address's deleted at.
 *                 format: date-time
 *       email:
 *         type: string
 *         title: email
 *         description: The context's email.
 *         format: email
 *       resource_id:
 *         type: string
 *         title: resource_id
 *         description: The context's resource id.
 *       customer:
 *         type: object
 *         description: The context's customer.
 *         x-schemaName: Customer
 *         properties:
 *           id:
 *             type: string
 *             title: id
 *             description: The customer's ID.
 *           email:
 *             type: string
 *             title: email
 *             description: The customer's email.
 *             format: email
 *           default_billing_address_id:
 *             type: string
 *             title: default_billing_address_id
 *             description: The customer's default billing address id.
 *           default_shipping_address_id:
 *             type: string
 *             title: default_shipping_address_id
 *             description: The customer's default shipping address id.
 *           company_name:
 *             type: string
 *             title: company_name
 *             description: The customer's company name.
 *           first_name:
 *             type: string
 *             title: first_name
 *             description: The customer's first name.
 *           last_name:
 *             type: string
 *             title: last_name
 *             description: The customer's last name.
 *           addresses:
 *             type: array
 *             description: The customer's addresses.
 *             items:
 *               type: object
 *               description: The address's addresses.
 *               x-schemaName: CustomerAddress
 *               properties: {}
 *           phone:
 *             type: string
 *             title: phone
 *             description: The customer's phone.
 *           groups:
 *             type: array
 *             description: The customer's groups.
 *             items:
 *               type: object
 *               description: The group's groups.
 *               properties: {}
 *           metadata:
 *             type: object
 *             description: The customer's metadata.
 *             properties: {}
 *           created_by:
 *             type: string
 *             title: created_by
 *             description: The customer's created by.
 *           deleted_at:
 *             oneOf:
 *               - type: string
 *                 title: deleted_at
 *                 description: The customer's deleted at.
 *               - type: string
 *                 title: deleted_at
 *                 description: The customer's deleted at.
 *                 format: date-time
 *           created_at:
 *             oneOf:
 *               - type: string
 *                 title: created_at
 *                 description: The customer's created at.
 *               - type: string
 *                 title: created_at
 *                 description: The customer's created at.
 *                 format: date-time
 *           updated_at:
 *             oneOf:
 *               - type: string
 *                 title: updated_at
 *                 description: The customer's updated at.
 *               - type: string
 *                 title: updated_at
 *                 description: The customer's updated at.
 *                 format: date-time
 *       extra:
 *         type: object
 *         description: The context's extra.
 *         properties: {}
 *   data:
 *     type: object
 *     description: The payment collection's data.
 *     properties: {}
 * 
*/

