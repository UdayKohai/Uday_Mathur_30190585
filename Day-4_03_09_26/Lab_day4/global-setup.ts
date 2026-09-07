import { chromium } from "@playwright/test";
import { loginPage } from "./pages/loginPage";


async function globalSetup(){

    console.log('Global Setup started');

    let browser = await chromium.launch();

    let page = await browser.newPage();

    await page.goto('https://www.playwrightpad.in/sandbox/banking');

    let loginpage = new loginPage(page);

    await loginpage.usernameInp.fill('apex_user');
    await loginpage.passwordBtn.fill('Password123!');
    await loginpage.rememberChcBtn.click();
    await loginpage.loginBtn.click();
    


    // save authentication

    await page.context().storageState({

        path:
        'auth.json'

});
console.log('Global Setup Completed');

}

export default globalSetup;