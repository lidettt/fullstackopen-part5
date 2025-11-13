const Blog = ({ blog, expandedId, onToggle, handleLike }) => {
  const isExpanded = expandedId === blog.id;
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button
          onClick={() => {
            onToggle(blog.id);
          }}
        >
          {isExpanded ? "hide" : "view"}
        </button>
        {isExpanded && (
          <div>
            <p> {blog.url}</p>
            <p>
              likes {blog.likes} <button onClick={handleLike}>like</button>
            </p>

            <p>{blog.user?.username || "unknown user"}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Blog;
