import {Page} from "@playwright/test"

export class fundTransferPage{
    addNewBtn:any;
    transferAmt:any;
    executeTrfBtn:any;
    transferType:any;
    benefOpt:any;
    initiateWireBtn:any;
    otpInp:any;
    verifyOtpBtn:any;
    

    constructor(private page:Page){
        this.addNewBtn = page.getByRole('button', { name: 'Add New' });
        this.transferAmt = page.getByRole('spinbutton', { name: '0.00' });
        this.executeTrfBtn = page.getByRole('button', { name: 'Execute Transfer' });
        this.transferType = page.locator('#transfer-type');
        this.benefOpt = page.locator('#bene-select');
        this.initiateWireBtn = page.getByRole('button', { name: 'Initiate Wire' });
        this.otpInp = page.getByRole('textbox', { name: 'Enter 6-digit OTP' });
        this.verifyOtpBtn =  page.getByRole('button', { name: 'Verify' });

    }

    async transfer(amt:string){
        await this.transferAmt.fill(amt);
        await this.executeTrfBtn.click();
    }

    async wireTransfer(benef:number,amt:string,page: Page){
        await this.transferType.selectOption({ label: 'External Wire Transfer' });
        await this.benefOpt.selectOption({index:Number(benef)})
        await this.transferAmt.fill(amt);
        await this.initiateWireBtn.click();

        let otpTxt = await page.locator('strong.otp-display-code').textContent();

        await this.otpInp.fill(otpTxt);
        await this.verifyOtpBtn.click();

    }

}