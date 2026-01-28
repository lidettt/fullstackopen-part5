import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

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

test("shows url and likes when view button is clicked", async () => {
  const blog = {
    id: "1",
    title: "Testing the blog component",
    author: "Lidet Tester",
    url: "https://example.com",
    likes: 10,
  };

  const mockToggle = vi.fn();

  // render with expandedId set to null (collapsed)
  const { rerender } = render(
    <Blog blog={blog} expandedId={null} onToggle={mockToggle} />,
  );

  //find and await for user to click the button
  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  //re-render after the user click the button to change the expandedId to blog.id instead of null
  rerender(<Blog blog={blog} expandedId={blog.id} onToggle={mockToggle} />);

  const url = screen.queryByText("https://example.com");
  expect(url).toBeDefined();
  const likes = screen.queryByText("10");
  expect(likes).toBeDefined();
});
