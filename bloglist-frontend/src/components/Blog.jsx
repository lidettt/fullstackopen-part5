import { useParams } from "react-router-dom";
const Blog = ({
  blog,
  expandedId,
  onToggle,
  user,
  handleLike,
  handleRemove,
}) => {
  // const isExpanded = expandedId === blog.id;
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  if (!blog) return null;

  return (
    <div style={blogStyle}>
      <div className="blog">
        <h2>{blog.title}</h2>

        <div>
          <a href={blog.url}> {blog.url}</a>

          <p>
            likes {blog.likes}{" "}
            {user && <button onClick={handleLike}>like</button>}
          </p>
          <p>Added by {blog.author}</p>
          {user?.username === blog.user?.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Blog;
