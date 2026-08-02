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
    await page.getByRole("link", { name: "login" }).click();

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
      await page.getByRole("link", { name: "login" }).click();
      await page.getByLabel("username").fill("lidet-test");
      await page.getByLabel("password").fill("lidet123");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByRole("link", { name: "login" }).click();
      await page.getByLabel("username").fill("lidet-test");
      await page.getByLabel("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("wrong username or password");
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByRole("link", { name: "login" }).click();
      await page.getByLabel("username").fill("lidet-test");
      await page.getByLabel("password").fill("lidet123");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("link", { name: "new blog", exact: true }).click();
      await page.getByLabel("title").fill("new blog can be created");
      await page.getByLabel("author").fill("lidet");
      await page.getByLabel("url").fill("newblog.com");
      await page.getByRole("button", { name: "create" }).click();

      await expect(
        page.getByRole("link", { name: "new blog can be created" }),
      ).toBeVisible();
    });
    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("link", { name: "new blog", exact: true }).click();
        await page.getByLabel("title").fill("new blog can be created");
        await page.getByLabel("author").fill("lidet");
        await page.getByLabel("url").fill("newblog.com");
        await page.getByRole("button", { name: "create" }).click();
      });

      test("the blog can be liked", async ({ page }) => {
        await page
          .getByRole("link", { name: "new blog can be created", exact: true })
          .click();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("likes 1")).toBeVisible();
      });

      test("the blog's delete button available to only the user who added it", async ({
        page,
        request,
      }) => {
        await request.post("http://localhost:3003/api/users", {
          data: {
            username: "lidet-test-2",
            name: "Voeun Chanlidet",
            password: "lidet123",
          },
        });
        await page.getByRole("button", { name: "logout" }).click();

        await expect(page.getByRole("link", { name: "login" })).toBeVisible();
        await page.getByRole("link", { name: "login" }).click();

        await expect(page.getByLabel("username")).toBeVisible();
        await page.getByLabel("username").fill("lidet-test-2");
        await page.getByLabel("password").fill("lidet123");
        await page.getByRole("button", { name: "login" }).click();

        await page
          .getByRole("link", { name: "new blog can be created", exact: true })
          .click();
        await expect(
          page.getByRole("button", { name: "remove" }),
        ).not.toBeVisible();
      });

      test("the blog can be deleted by the user who added it", async ({
        page,
      }) => {
        await page
          .getByRole("link", { name: "new blog can be created", exact: true })
          .click();

        page.on("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "remove" }).click();

        await expect(
          page.getByRole("link", {
            name: "new blog can be created",
            exact: true,
          }),
        ).not.toBeVisible();
      });

      test.skip("blogs are arranged in the order according to the likes", async ({
        page,
      }) => {
        // like the first blog one time
        const firstBlog = page
          .locator(".blog")
          .filter({ hasText: "new blog can be created" });
        await firstBlog.getByRole("button", { name: "view" }).click();
        await firstBlog.getByRole("button", { name: "like" }).click();
        await expect(firstBlog.getByText("likes 1")).toBeVisible();

        //create & like the second blog 3 times
        await page.getByRole("button", { name: "create new blog" }).click();
        await page.getByLabel("title").fill("second blog");
        await page.getByLabel("author").fill("lidet");
        await page.getByLabel("url").fill("secondblog.com");
        await page.getByRole("button", { name: "create" }).click();
        const secondBlog = page
          .locator(".blog")
          .filter({ hasText: "second blog" });
        await secondBlog.getByRole("button", { name: "view" }).click();
        await secondBlog.getByRole("button", { name: "like" }).click();
        await expect(secondBlog.getByText("likes 1")).toBeVisible();
        await secondBlog.getByRole("button", { name: "like" }).click();
        await expect(secondBlog.getByText("likes 2")).toBeVisible();
        await secondBlog.getByRole("button", { name: "like" }).click();
        await expect(secondBlog.getByText("likes 3")).toBeVisible();

        //create & like the third blog 2 times
        await page.getByRole("button", { name: "create new blog" }).click();
        await page.getByLabel("title").fill("third blog");
        await page.getByLabel("author").fill("lidet");
        await page.getByLabel("url").fill("thirdblog.com");
        await page.getByRole("button", { name: "create" }).click();
        const thirdBlog = page
          .locator(".blog")
          .filter({ hasText: "third blog" });
        await thirdBlog.getByRole("button", { name: "view" }).click();
        await thirdBlog.getByRole("button", { name: "like" }).click();
        await expect(thirdBlog.getByText("likes 1")).toBeVisible();
        await thirdBlog.getByRole("button", { name: "like" }).click();
        await expect(thirdBlog.getByText("likes 2")).toBeVisible();

        const allBlogs = page.locator(".blog");
        await expect(allBlogs.nth(0).getByText("second blog")).toBeVisible();
        await expect(allBlogs.nth(1).getByText("third blog")).toBeVisible();
        await expect(
          allBlogs.nth(2).getByText("new blog can be created"),
        ).toBeVisible();
      });
    });
  });
});
