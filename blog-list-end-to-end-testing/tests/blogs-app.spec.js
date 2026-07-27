const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "lidet-test",
        name: "Voeun Chanlidet",
        password: "lidet123",
      },
    });

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

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("lidet-test");
      await page.getByLabel("password").fill("lidet123");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Voeun Chanlidet logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("lidet-test");
      await page.getByLabel("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("wrong username or password");
    });
  });
});
