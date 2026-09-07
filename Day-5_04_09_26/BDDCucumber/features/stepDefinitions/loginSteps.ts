import { Given, When, Then } from '@cucumber/cucumber';
import {LoginPage} from '../../pages/LoginPage';
import {CustomWorld} from '../../support/world';

import { studentRegistrationPage } from '../../pages/studentRegistrationPage';




let login : LoginPage;
let student : studentRegistrationPage;

Given('the user is on the Login Page', async function (this: CustomWorld) {
  // Write code here that turns the phrase above into concrete actions
  login = new LoginPage(this.page);
  await login.openApp();
});

When('the user enters valid credentials', async function (this: CustomWorld) {
  // Write code here that turns the phrase above into concrete actions
  await login.login();
});

When('clicks the Login button', async function (this: CustomWorld) {
  // Write code here that turns the phrase above into concrete actions
  await login.clickLoginButton();
});

Then('the user should be redirected to the Dashboard page', async function (this: CustomWorld) {
  // Write code here that turns the phrase above into concrete actions
  console.log('Login Successful');
});

// Given('the user is on the Login Page', async function (this: CustomWorld) {
//   // Write code here that turns the phrase above into concrete actions
//   login = new LoginPage(this.page);
//   await login.openApp();
// });

When('the user enters invalid credentials',async function (this: CustomWorld) {
  // Write code here that turns the phrase above into concrete actions
  await login.LoginWithInvalidCredentials();
});

// When ('clicks the Login button', async function (this: CustomWorld) {
//   // Write code here that turns the phrase above into concrete actions
//   await login.clickLoginButton();
// });

Then('an error message should be displayed indicating invalid login', async function (this: CustomWorld) {
  // Write code here that turns the phrase above into concrete actions
  console.log('Error Displayed');
  await login.errorcheck();
});


Given('User opens the application',async function (this:CustomWorld) {
  // Write code here that turns the phrase above into concrete actions
  login = new LoginPage(this.page);
  await login.openApp();
});

When('User enters {string} and {string}', async function (this: CustomWorld, string, string2) {
  // Write code here that turns the phrase above into concrete actions
  await login.loginwithmultipleusers(string,string2);
});

// Then('an error message should be displayed indicating invalid login', async function (this: CustomWorld) {
//   // Write code here that turns the phrase above into concrete actions
//   console.log('Error Displayed');
//   await login.errorcheck();
// });



// Student Steps

Given('User opens the student application', async function (this: CustomWorld) {
  // Write code here that turns the phrase above into concrete actions
  student = new studentRegistrationPage(this.page);
  await student.openUrl();
});

When('User enters {string} and {string} and {string} and {string} and {string} and {string} and {string} and {string} and {string} and {string}', async function (this: CustomWorld, string, string2, string3, string4, string5, string6, string7, string8,string9,string10) {
  // Write code here that turns the phrase above into concrete actions
  await student.filldetails(string,string2,string3,string4,string5,string6,string7,string8,string9,string10,this.page);
});

Then('Login button is enabled', async function (this: CustomWorld) {
  // Write code here that turns the phrase above into concrete actions
  await student.clickSubmit();
});