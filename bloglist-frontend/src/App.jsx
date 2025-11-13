import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import "./index.css";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  const Notification = ({ notification }) => {
    if (notification.message === null) {
      return null;
    }
    return <div className={notification.type}>{notification.message}</div>;
  };
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  );
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      setNotification({ message: "wrong username or password", type: "error" });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 5000);
    }
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      const blog = await blogService.create(blogObject);
      setBlogs(blogs.concat(blog));
      setNotification({
        message: `A new blog "${blogObject.title}" by ${blogObject.author} added`,
        type: "added",
      });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 5000);
    } catch (error) {
      setNotification({
        message: `Failed to create blog, Please try again`,
        type: "error",
      });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 5000);
    }
  };
  const toggleButton = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleLike = async (blog) => {
    const updatedBlog = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    };
    const returnedBlog = await blogService.update(blog.id, updatedBlog);
    setBlogs(
      blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog))
    );
  };
  return (
    <div>
      {!user && (
        <div>
          <h2>Log in to application</h2>
          <Notification notification={notification} />
          {loginForm()}
        </div>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification notification={notification} />
          <p>
            {user.name} logged in
            <button
              onClick={() => {
                window.localStorage.removeItem("loggedBloglistUser");
                setUser(null);
              }}
            >
              logout
            </button>
          </p>

          <div>
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
          </div>

          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              expandedId={expandedId}
              onToggle={toggleButton}
              handleLike={() => handleLike(blog)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
