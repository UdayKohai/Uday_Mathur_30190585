import { expect, Locator, Page } from '@playwright/test';
import { HeaderComponent } from './HeaderComponent';
import { SideMenuComponent } from './SideMenuComponent';

export abstract class BasePage {
  protected readonly page: Page;
  readonly header: HeaderComponent;
  readonly sideMenu: SideMenuComponent;

  readonly title: Locator;
  readonly errorBanner: Locator;
  readonly errorCloseButton: Locator;

  protected constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.sideMenu = new SideMenuComponent(page);

    this.title = page.locator('[data-test="title"]');
    this.errorBanner = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error-button"]');
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async expectTitle(title: string): Promise<void> {
    await expect(this.title).toHaveText(title);
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorBanner).toHaveText(message);
  }

  async dismissError(): Promise<void> {
    await this.errorCloseButton.click();
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async goForward(): Promise<void> {
    await this.page.goForward();
  }
}