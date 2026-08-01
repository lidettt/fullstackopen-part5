import Blog from "./Blog";

const BlogList = ({
  sortedBlogs,
  user,
  expandedId,
  toggleButton,
  handleLike,
  handleRemove,
}) => {
  return (
    <div>
      <h2>blogs</h2>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          expandedId={expandedId}
          onToggle={toggleButton}
          handleLike={() => handleLike(blog)}
          handleRemove={() => handleRemove(blog)}
        />
      ))}
    </div>
  );
};

export default BlogList;
