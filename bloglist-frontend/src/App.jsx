import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";
import BlogList from "./components/BlogList";
import "./index.css";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import { Container, AppBar, Toolbar, Button } from "@mui/material";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

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
    try {
      const blog = await blogService.create(blogObject);
      setBlogs(blogs.concat(blog));
      setNotification({
        text: `a new blog ${blogObject.title} ${blogObject.author} added`,
        type: "success",
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
      navigate("/");
    } catch (error) {
      setNotification({
        text: "Failed to create blog, Please try again",
        type: "error",
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
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
        navigate("/");
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
  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };
  return (
    <Container>
      <AppBar position="static">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Blog App</h2>
          <div>
            {" "}
            <Button color="inherit" component={Link} to="/" sx={style}>
              blogs
            </Button>
            {user ? (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/create"
                  sx={style}
                >
                  new blog
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  sx={style}
                  onClick={() => {
                    window.localStorage.removeItem("loggedBloglistUser");
                    setUser(null);
                    navigate("/");
                  }}
                >
                  logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login" sx={style}>
                login
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Notification notification={notification} />

      <Routes>
        <Route path="/" element={<BlogList sortedBlogs={sortedBlogs} />} />
        <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
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
    </Container>
  );
};

export default App;
