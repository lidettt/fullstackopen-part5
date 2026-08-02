import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("renders content", () => {
  const blog = {
    title: "Testing the blog component",
    author: "Lidet Tester",
    url: "https://example.com",
    likes: 10,
    user: { username: "lidet-test" },
  };

  render(<Blog blog={blog} user={null} />);

  const title = screen.getByText("Testing the blog component");
  expect(title).toBeDefined();

  const url = screen.queryByText("https://example.com");
  expect(url).not.toBeNull();

  const likes = screen.getByText("likes 10");
  expect(likes).toBeDefined();
  const likeButton = screen.queryByRole("button", { name: "like" });
  expect(likeButton).toBeNull();

  const author = screen.getByText("Added by Lidet Tester");
  expect(author).toBeDefined();

  const removeButton = screen.queryByRole("button", { name: "remove" });
  expect(removeButton).toBeNull();
});

test("authenticated but not blog's creator show only the like button", () => {
  const blog = {
    title: "Testing the blog component",
    author: "Lidet Tester",
    url: "https://example.com",
    likes: 10,
    user: { username: "lidet-test" },
  };
  const loggedUser = { username: "notcreator" };

  render(<Blog blog={blog} user={loggedUser} />);

  const title = screen.getByText("Testing the blog component");
  expect(title).toBeDefined();

  const url = screen.queryByText("https://example.com");
  expect(url).not.toBeNull();

  const likes = screen.getByText("likes 10");
  expect(likes).toBeDefined();
  const likeButton = screen.queryByRole("button", { name: "like" });
  expect(likeButton).not.toBeNull();

  const author = screen.getByText("Added by Lidet Tester");
  expect(author).toBeDefined();

  const removeButton = screen.queryByRole("button", { name: "remove" });
  expect(removeButton).toBeNull();
});

test("blog's creator show the delete button", () => {
  const blog = {
    title: "Testing the blog component",
    author: "Lidet Tester",
    url: "https://example.com",
    likes: 10,
    user: { username: "lidet-test" },
  };
  const loggedUser = { username: "lidet-test" };

  render(<Blog blog={blog} user={loggedUser} />);

  const title = screen.getByText("Testing the blog component");
  expect(title).toBeDefined();

  const url = screen.queryByText("https://example.com");
  expect(url).not.toBeNull();

  const likes = screen.getByText("likes 10");
  expect(likes).toBeDefined();
  const likeButton = screen.queryByRole("button", { name: "like" });
  expect(likeButton).not.toBeNull();

  const author = screen.getByText("Added by Lidet Tester");
  expect(author).toBeDefined();

  const removeButton = screen.queryByRole("button", { name: "remove" });
  expect(removeButton).not.toBeNull();
});

test("check, that the form calls the event handler if it received as props with the right details when a new blog is created", async () => {
  const mockSubmitHandler = vi.fn();
  const user = userEvent.setup();
  render(<BlogForm createBlog={mockSubmitHandler} />);

  await user.type(screen.getByLabelText("title"), "Testing the blog component");
  await user.type(screen.getByLabelText("author"), "Lidet Tester");
  await user.type(screen.getByLabelText("url"), "https://example.com");

  await user.click(screen.getByRole("button", { name: /create/i }));

  expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
  expect(mockSubmitHandler).toHaveBeenCalledWith({
    title: "Testing the blog component",
    author: "Lidet Tester",
    url: "https://example.com",
  });
});
