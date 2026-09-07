import {Page,expect} from '@playwright/test';

export class studentRegistrationPage {

    nameInp:any;
    emailInp:any;
    genderBtn:any;
    mobileInp:any;
    dobInp:any;
    subjectInp:any;
    hobbiesBtn:any;
    addressInp:any;
    loginBtn:any;
    stateDrp:any;
    cityDrp:any

    constructor( private page:Page){
        this.nameInp = page.getByRole('textbox', { name: 'Name:' });
        this.emailInp = page.getByRole('textbox', { name: 'Email:' });
        this.mobileInp = page.getByRole('textbox', { name: 'Mobile(10 Digits):' });
        this.dobInp = page.locator('#dob');
        this.subjectInp = page.getByLabel('Subjects:');
        this.addressInp =  page.getByPlaceholder('Currend Address');
        this.stateDrp = page.locator('#state');
        this.cityDrp = page.locator('#city');
        this.loginBtn = page.locator("//input[@value='Login']");
    }

    async openUrl(){
        await this.page.goto('https://www.tutorialspoint.com/selenium/practice/selenium_automation_practice.php');
    }

    async filldetails(name:string,email:string,mobile:string,dob:string,subject:string,address:string,state:string,city:string,gender:string,hobby:string,page:Page){
        await this.nameInp.fill(name);
        await this.emailInp.fill(email);
        await this.mobileInp.fill(mobile);
        await this.dobInp.fill(dob);
        await this.subjectInp.fill(subject);
        await this.addressInp.fill(address);
        await this.stateDrp.selectOption(state);
        await this.cityDrp.selectOption(city);
        await this.page.getByText(gender, { exact: true }).click();
        await this.page.getByText(hobby, { exact: true }).click();
    }

    async clickSubmit(){
        // await this.loginBtn.click();
        await expect(this.loginBtn).toBeEnabled();
        console.log("Login button is enabled");
    }
}