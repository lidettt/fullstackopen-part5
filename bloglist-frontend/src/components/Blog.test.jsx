import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "Testing the blog component",
    author: "Lidet Tester",
    url: "https://example.com",
    likes: 10,
  };

  render(<Blog blog={blog} expandedId={null} />);

  const title = screen.getByText("Testing the blog component");
  expect(title).toBeDefined();
  const author = screen.getByText("Lidet Tester");
  expect(author).toBeDefined();

  const url = screen.queryByText("https://example.com");
  expect(url).toBeNull();
  const likes = screen.queryByText("10");
  expect(likes).toBeNull();
});
