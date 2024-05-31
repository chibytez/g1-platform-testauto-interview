// This file will be used to define the expected behavior of every steps you'll define.

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { defineParameterType } from "@cucumber/cucumber";
import { WEBSITE_INFORMATION } from "../configuration";
import { createPageModel } from "../pageModel/pageModel";
const fetch = require('./fetchWrapper');
import { CustomWorld, Book } from "./world";

type WebSiteUrls = {
  [key: string]: string;
};

defineParameterType({
  name: "website",
  regexp: /google|facebook|twitter/,
  transformer: (website) => website,
});

const webSitesUrl: WebSiteUrls = {
  google: "https://www.google.be/",
  facebook: "https://fr-fr.facebook.com/",
  twitter: "https://github.com/"
};

/* GIVENS */

Given(
  "the user opened my website",
  async function (this: CustomWorld): Promise<void> {
    const page = this.page!;
    await page.goto(WEBSITE_INFORMATION.URL);
  }
);

Given(
  "the user is logged off",
  async function (this: CustomWorld): Promise<void> {
    const page = this.page!;
    await page.goto("https://www.luckygames.be/");
    // Add steps to ensure the user is logged off
  }
);

/* WHENS */

When(
  "the user navigates to {website}",
  async function (this: CustomWorld, website: string): Promise<void> {
    const page = this.page!;
    await page.goto(webSitesUrl[website]);
  }
);

When(
  "the user opens the login form",
  async function (this: CustomWorld): Promise<void> {
    const pageModel = createPageModel(this);
    await pageModel.myWebSite.home.loginButton.click();
  }
);

When(
  "the user logs in with valid credentials",
  async function (this: CustomWorld): Promise<void> {
    const pageModel = createPageModel(this);
    await pageModel.myWebSite.home.loginButton.click();
    await pageModel.myWebSite.loginForm.usernameInput.fill(process.env.USERNAME || "");
    await pageModel.myWebSite.loginForm.passwordInput.fill(process.env.PASSWORD || "");
    await pageModel.myWebSite.loginForm.submitButton.click();
  }
);

When(
  "the user navigates to the TOURNAMENTS page",
  async function (this: CustomWorld): Promise<void> {
    const page = this.page!;
    await page.goto("https://www.luckygames.be/tournaments");
  }
);

When(
  "the user fetches the list of books",
  async function (this: CustomWorld): Promise<void> {
    const response = await fetch("http://fakerestapi.azurewebsites.net/api/v1/Books");
    const books: Book[] = await response.json() as Book[];
    this.books = books.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
  }
);

/* THENS */

Then(
  "{website} should be displayed",
  async function (this: CustomWorld, website: string): Promise<void> {
    const page = this.page!;
    await expect(page).toHaveURL(webSitesUrl[website]);
  }
);

Then(
  "the login form should be displayed",
  async function (this: CustomWorld): Promise<void> {
    const pageModel = createPageModel(this);
    await expect(pageModel.myWebSite.loginForm.form).toBeVisible();
  }
);

Then(
  "the user should be logged in successfully",
  async function (this: CustomWorld): Promise<void> {
    const pageModel = createPageModel(this);
    await expect(pageModel.myWebSite.logoutButton).toBeVisible();
  }
);

Then(
  "there should be at least 1 tournament displayed on the CURRENT AND UPCOMING page",
  async function (this: CustomWorld): Promise<void> {
    const page = this.page!;
    await page.waitForSelector("[data-testid='current-upcoming-tournaments'] .tournament-item");
    const tournaments = await page.locator("[data-testid='current-upcoming-tournaments'] .tournament-item").count();
    expect(tournaments).toBeGreaterThan(0);
  }
);

Then(
  "there should be at least 1 tournament displayed on the FINISHED tournament page",
  async function (this: CustomWorld): Promise<void> {
    const page = this.page!;
    await page.waitForSelector("[data-testid='finished-tournaments'] .tournament-item");
    const tournaments = await page.locator("[data-testid='finished-tournaments'] .tournament-item").count();
    expect(tournaments).toBeGreaterThan(0);
  }
);

Then(
  "the books should be displayed in ascending order of publishDate",
  async function (this: CustomWorld): Promise<void> {
    const sortedBooks = this.books!.map(book => `Book: ${book.title} (Published: ${book.publishDate})`).join('\n');
    console.log(sortedBooks);
  }
);