import { useState } from "react";
import { TextField, Button } from "@mui/material";
const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const handleAddNewBlog = async (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };
  const margin = {
    margin: 5,
  };
  return (
    <form onSubmit={handleAddNewBlog}>
      <h2>create new</h2>
      <div>
        <TextField
          style={margin}
          label="title"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        <TextField
          style={margin}
          label="author"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        <TextField
          style={margin}
          label="url"
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>

      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        create
      </Button>
    </form>
  );
};
export default BlogForm;
