import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutOverviewPage extends BasePage {
  readonly overviewItems: Locator;
  readonly itemQuantities: Locator;
  readonly itemPrices: Locator;
  readonly paymentInformationLabel: Locator;
  readonly paymentInformationValue: Locator;
  readonly shippingInformationLabel: Locator;
  readonly shippingInformationValue: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);

    this.overviewItems = page.locator('[data-test="inventory-item"]');
    this.itemQuantities = page.locator('[data-test="item-quantity"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');

    this.paymentInformationLabel = page.locator('[data-test="payment-info-label"]');
    this.paymentInformationValue = page.locator('[data-test="payment-info-value"]');
    this.shippingInformationLabel = page.locator('[data-test="shipping-info-label"]');
    this.shippingInformationValue = page.locator('[data-test="shipping-info-value"]');

    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');

    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.overviewItems).toHaveCount(count);
  }

  async expectTotals(itemTotal: string, tax: string, total: string): Promise<void> {
    await expect(this.subtotalLabel).toHaveText(`Item total: ${itemTotal}`);
    await expect(this.taxLabel).toHaveText(`Tax: ${tax}`);
    await expect(this.totalLabel).toHaveText(`Total: ${total}`);
  }

  async expectPaymentInformation(): Promise<void> {
    await expect(this.paymentInformationLabel).toHaveText('Payment Information:');
    await expect(this.paymentInformationValue).toHaveText('SauceCard #31337');
  }

  async expectShippingInformation(): Promise<void> {
    await expect(this.shippingInformationLabel).toHaveText('Shipping Information:');
    await expect(this.shippingInformationValue).toHaveText('Free Pony Express Delivery!');
  }
}
