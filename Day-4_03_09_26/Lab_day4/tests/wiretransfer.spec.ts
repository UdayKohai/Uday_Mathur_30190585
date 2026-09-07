import {test, expect} from "@playwright/test"
import { loginPage } from "../pages/loginPage"
import { accountSummaryPage } from "../pages/accountSummaryPage"
import { fundTransferPage } from "../pages/fundTransferPage"
import { newBenefPage } from "../pages/newBenefPage"

import fs from 'fs'
import path from 'path';

const datafile = fs.readFileSync(path.join(__dirname,'../testdata/data.json'),'utf-8');
const data = JSON.parse(datafile);

test('wire transfer', async({page})=>{
    const url = data.url;
    const username = data.username;
    const password = data.password;
    const benefName = data.benefName;
    const benefNumb = data.benefNumb;
    const benefBank = data.benefBank;
    const transferAmt = data.transferAmt;
    const benefInd = data.benefInd


    const loginpage = new loginPage(page);
    const accountSummaryP = new accountSummaryPage(page);
    const fundTransferP = new fundTransferPage(page);
    const newBenefP = new newBenefPage(page);

    await loginpage.open(url);
    await loginpage.log(username,password);

    const oldBalance:string = await accountSummaryP.balanceAmt.textContent();

    await accountSummaryP.fundTransfer.click();

    await fundTransferP.addNewBtn.click();

    await newBenefP.addbenef(benefName,benefNumb,benefBank);

    await fundTransferP.wireTransfer(benefInd,transferAmt,page);

    await accountSummaryP.accSumBtn.click();

    await accountSummaryP.checkTrnf(transferAmt);

    const newBalance:string = await accountSummaryP.balanceAmt.textContent();


    await accountSummaryP.valBal(oldBalance,newBalance,transferAmt);

    await page.waitForTimeout(5000);

})
