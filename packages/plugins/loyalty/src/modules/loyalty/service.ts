import { MedusaService } from "@medusajs/framework/utils";
import GiftCard from "./models/gift-card";

class LoyaltyModuleService extends MedusaService({
  GiftCard,
}) {}

export default LoyaltyModuleService;
