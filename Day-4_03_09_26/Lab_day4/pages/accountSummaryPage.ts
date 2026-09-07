import {Page, expect} from '@playwright/test'

export class accountSummaryPage{
    accSumBtn:any;
    fundTransfer:any;
    lastTrfAmt:any;
    balanceAmt:any;

    constructor( private page:Page){
        this.accSumBtn = page.getByRole('button', { name: 'Accounts Summary' });
        this.fundTransfer = page.getByRole('button', { name: 'Funds Transfer' });
        this.lastTrfAmt = page.locator('//td').nth(3);
        this.balanceAmt = page.locator("div[data-account='checking'] div[class='balance']");
    }

    async checkTrnf(amt:string){
        await expect(this.lastTrfAmt).toContainText(amt);
    }

    // async valBal(oldBalance:number, newBalance:number, amt:number){
    //     const Tamt:number = oldBalance - newBalance;
    //     console.log(oldBalance);
    //     console.log(newBalance);
    //     console.log(amt);
    //     console.log(Tamt);

    //     if(Tamt==amt) console.log('cool');
    //     else console.log('not cool');
    // }

    async valBal(oldBalance: string, newBalance: string, amt: number) {

    const oldBal = parseFloat(oldBalance.replace(/[$,]/g, ''));
    const newBal = parseFloat(newBalance.replace(/[$,]/g, ''));

    const Tamt = oldBal - newBal;

    // console.log(oldBal);
    // console.log(newBal);
    // console.log(amt);
    // console.log(Tamt);

    // if (Tamt === Number(amt)) {
    //     console.log('cool');
    // } else {
    //     console.log('not cool');
    // }

    expect(Tamt).toBe(Number(amt));
}




}