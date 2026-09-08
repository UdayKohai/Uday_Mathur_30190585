import { expect, Locator, Page } from '@playwright/test';

export class SideMenuComponent {
  readonly page: Page;
  readonly closeButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.closeButton = page.getByRole('button', { name: 'Close Menu' });
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async openAllItems(): Promise<void> {
    await this.allItemsLink.click();
  }

  async openAbout(): Promise<void> {
    await this.aboutLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.resetAppStateLink.click();
  }

  async expectVisible(): Promise<void> {
    await expect(this.logoutLink).toBeVisible();
  }

  async expectHidden(): Promise<void> {
    await expect(this.logoutLink).toBeHidden();
  }
}