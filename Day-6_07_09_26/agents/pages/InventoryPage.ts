import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly inventoryItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productDescriptions: Locator;
  readonly productImages: Locator;
  readonly sortDropdown: Locator;
  readonly footerTwitter: Locator;
  readonly footerFacebook: Locator;
  readonly footerLinkedIn: Locator;
  readonly footerCopyright: Locator;

  constructor(page: Page) {
    super(page);

    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.productDescriptions = page.locator('[data-test="inventory-item-desc"]');
    this.productImages = page.locator('.inventory_item_img img');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    this.footerTwitter = page.locator('[data-test="social-twitter"]');
    this.footerFacebook = page.locator('[data-test="social-facebook"]');
    this.footerLinkedIn = page.locator('[data-test="social-linkedin"]');
    this.footerCopyright = page.locator('[data-test="footer-copy"]');
  }

  productCard(productName: string): Locator {
    return this.inventoryItems.filter({ hasText: productName });
  }

  addButton(productId: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productId}"]`);
  }

  removeButton(productId: string): Locator {
    return this.page.locator(`[data-test="remove-${productId}"]`);
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async addProduct(productId: string): Promise<void> {
    await this.addButton(productId).click();
  }

  async removeProduct(productId: string): Promise<void> {
    await this.removeButton(productId).click();
  }

  async openProduct(productName: string): Promise<void> {
    await this.productNames.filter({ hasText: productName }).click();
  }

  async expectProductCount(count: number): Promise<void> {
    await expect(this.inventoryItems).toHaveCount(count);
  }

  async expectProductVisible(productName: string): Promise<void> {
    await expect(this.productCard(productName)).toBeVisible();
  }

  async expectSort(option: SortOption): Promise<void> {
    await expect(this.sortDropdown).toHaveValue(option);
  }

  async expectProductAdded(productId: string): Promise<void> {
    await expect(this.removeButton(productId)).toBeVisible();
  }

  async expectProductRemoved(productId: string): Promise<void> {
    await expect(this.addButton(productId)).toBeVisible();
  }
}