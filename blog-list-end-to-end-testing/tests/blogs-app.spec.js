const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = page.getByText("Log in to application");
    const usernameLabel = page.getByLabel("username");
    const passwordLabel = page.getByLabel("password");
    const loginButton = page.getByRole("button", { name: "login" });

    await expect(locator).toBeVisible();
    await expect(usernameLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
    await expect(loginButton).toBeVisible();
  });
});
