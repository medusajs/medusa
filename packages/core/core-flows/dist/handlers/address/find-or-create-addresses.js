"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateAddresses = void 0;
const utils_1 = require("@medusajs/utils");
var Aliases;
(function (Aliases) {
    Aliases["Addresses"] = "addresses";
    Aliases["Region"] = "region";
})(Aliases || (Aliases = {}));
async function findOrCreateAddresses({ container, data, }) {
    const regionService = container.resolve("regionService");
    const addressRepository = container.resolve("addressRepository");
    const shippingAddress = data[Aliases.Addresses].shipping_address;
    const shippingAddressId = data[Aliases.Addresses].shipping_address_id;
    const billingAddress = data[Aliases.Addresses].billing_address;
    const billingAddressId = data[Aliases.Addresses].billing_address_id;
    const addressesDTO = {};
    const region = await regionService.retrieve(data[Aliases.Region].region_id, {
        relations: ["countries"],
    });
    const regionCountries = region.countries.map(({ iso_2 }) => iso_2);
    if (!shippingAddress && !shippingAddressId) {
        if (region.countries.length === 1) {
            const shippingAddress = addressRepository.create({
                country_code: regionCountries[0],
            });
            addressesDTO.shipping_address = shippingAddress;
            addressesDTO.shipping_address_id = shippingAddress?.id;
        }
    }
    else {
        if (shippingAddress) {
            if (!regionCountries.includes(shippingAddress.country_code)) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, "Shipping country not in region");
            }
        }
        if (shippingAddressId) {
            const address = await regionService.findOne({
                where: { id: shippingAddressId },
            });
            if (address?.country_code &&
                !regionCountries.includes(address.country_code)) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, "Shipping country not in region");
            }
            addressesDTO.shipping_address = address;
            addressesDTO.shipping_address_id = address.id;
        }
    }
    if (billingAddress) {
        if (!regionCountries.includes(billingAddress.country_code)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, "Billing country not in region");
        }
    }
    if (billingAddressId) {
        const address = await regionService.findOne({
            where: { id: billingAddressId },
        });
        if (address?.country_code &&
            !regionCountries.includes(address.country_code)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, "Billing country not in region");
        }
        addressesDTO.billing_address = address;
        addressesDTO.billing_address_id = billingAddressId;
    }
    return addressesDTO;
}
exports.findOrCreateAddresses = findOrCreateAddresses;
findOrCreateAddresses.aliases = Aliases;
