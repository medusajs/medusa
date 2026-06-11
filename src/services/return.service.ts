import { Inject, Service } from '@medusajs/medusa';
import { ReturnService as MedusaReturnService } from '@medusajs/medusa/dist/services';

@Service()
export class ReturnService extends MedusaReturnService {
  async createReturn(data: any) {
    // Check if items already exist in the return
    const existingItems = data.items.filter((item: any) => {
      return this.return.items.some((existingItem: any) => existingItem.item_id === item.item_id);
    });

    // Remove duplicate items
    data.items = data.items.filter((item: any) => {
      return !existingItems.some((existingItem: any) => existingItem.item_id === item.item_id);
    });

    // Create the return
    return super.createReturn(data);
  }
}