import { Page, expect } from '@playwright/test';

export class LoginPage {

constructor(
private page: Page
) {}


// locators 

private txtUser = '#user-name';

private txtPass = '#password';

private btnLogin ='#login-button';

async openApp() {

await this.page.goto(

'https://www.saucedemo.com/');

}

async login() {

console.log(
'Entering credentials');

// Example
await this.page.fill('input[name="user-name"]','standard_user');
await this.page.fill("//input[@id='password']",'secret_sauce');
// await this.page.click('input[name="login-button"]');



}

async LoginWithInvalidCredentials() {
    console.log('Entering invalid Credentials');

    await this.page.fill('input[name="user-name"]','invalid_user');
    await this.page.fill("//input[@id='password']",'invalid_password');
    // await this.page.click('input[name="login-button"]');
    // await expect( this.page.locator('[data-test="error"]')).toBeVisible();
}

async loginwithmultipleusers(username: string, password : string){

    await this.page.fill(this.txtUser,username);

    await this.page.fill(this.txtPass,password);

    await this.page.click(this.btnLogin);

}

async clickLoginButton() {
    await this.page.click(this.btnLogin);
}

async errorcheck() {
    await expect( this.page.locator('[data-test="error"]')).toBeVisible();
}


}