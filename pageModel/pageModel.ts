// This file will be used to define the selectors that will be used in your tests
// Locator documentation : https://playwright.dev/docs/api/class-locator
// Example of locator usage : page.locator("CSS selector").click()

import { ITestController } from "../runnerConfiguration/runner";

export const createPageModel = (testController: ITestController) => {
  const page = testController.page!;

  return {
    myWebSite: {
      home: {
        loginButton: page.getByRole('link', { name: 'Sign in' }),
      },
      loginForm: {
        usernameInput: page.locator("#login_field"),
        passwordInput: page.locator("#password"),
        submitButton: page.locator('[name="commit"]'),
        form: page.locator('form[action="/session"]'),
      },
      logoutButton: page.locator('[href*="/logout"]'),
    },
  };
};
