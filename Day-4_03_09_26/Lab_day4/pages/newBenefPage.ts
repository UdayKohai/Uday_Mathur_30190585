import {Page} from "@playwright/test"

export class newBenefPage{
    fullNameInp:any;
    accNumberInp:any;
    recipBankInp:any;
    saveBenefBtn:any;
    cancelBtn:any;


    constructor(private page:Page){
        this.fullNameInp =  page.getByRole('textbox', { name: 'e.g. John Doe' });
        this.accNumberInp =  page.getByRole('textbox', { name: 'e.g. 1234567890' });
        this.recipBankInp = page.locator('#bene-bank');
        this.saveBenefBtn = page.getByRole('button', { name: 'Save Beneficiary' });
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    }

    async addbenef(name:string,accNum:string,bank:string){
        await this.fullNameInp.fill(name);
        await this.accNumberInp.fill(accNum);
        await this.recipBankInp.selectOption({label:bank});
        await this.saveBenefBtn.click();
    }

}