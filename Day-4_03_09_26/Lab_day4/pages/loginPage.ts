import {Page} from "@playwright/test"

export class loginPage{
    usernameInp:any;
    passwordBtn:any;
    rememberChcBtn:any;
    loginBtn:any;

    constructor( private page : Page) {
        this.usernameInp = page.getByRole('textbox', { name: 'Enter username' });
        this.passwordBtn = page.getByPlaceholder('Enter password');
        this.rememberChcBtn = page.getByRole('checkbox');
        this.loginBtn = page.getByRole('button', { name: 'LOGIN' });
    }
   
    async open(url:string){
        await this.page.goto(url);
    }

    async log(username:string, password:string){
        await this.usernameInp.fill(username);
        await this.passwordBtn.fill(password);
        await this.rememberChcBtn.click();
        await this.loginBtn.click();
    }

}