import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";
import BlogList from "./components/BlogList";
import "./index.css";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
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
  const navigate = useNavigate();

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
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  const match = useMatch("/blogs/:id");

  const blog = match
    ? sortedBlogs.find((blog) => blog.id === match.params.id)
    : null;

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      navigate("/");
    } catch {
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
    } catch {
      setNotification({
        message: "Failed to create blog, Please try again",
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
      blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog)),
    );
  };
  const handleRemove = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        await blogService.remove(blog.id);
        setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id));
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setNotification({
          message: error.response.data.error,
          type: "error",
        });
        setTimeout(() => {
          setNotification({ message: null, type: null });
        }, 5000);
      } else {
        setNotification({
          message: "oh no something went wrong",
          type: "error",
        });
        setTimeout(() => {
          setNotification({ message: null, type: null });
        }, 5000);
      }
    }
  };

  const padding = {
    padding: 5,
  };

  return (
    <div>
      {notification && <Notification notification={notification} />}
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>

        {user ? (
          <button
            onClick={() => {
              window.localStorage.removeItem("loggedBloglistUser");
              setUser(null);
              navigate("/");
            }}
          >
            logout
          </button>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
      </div>
      <Routes>
        <Route path="/" element={<BlogList sortedBlogs={sortedBlogs} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              user={user}
              handleLike={() => handleLike(blog)}
              handleRemove={() => handleRemove(blog)}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginForm
              handleLogin={handleLogin}
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              notification={notification}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
