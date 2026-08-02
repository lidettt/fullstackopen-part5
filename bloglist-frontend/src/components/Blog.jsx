import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  if (!blog) {
    return null;
  }

  return (
    <Card sx={{ maxWidth: 500, marginTop: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography sx={{ my: 1, color: "text.secondary" }}>
          by {blog.author}
        </Typography>
        <Typography variant="body2">
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Typography
          variant="body2"
          sx={{ my: 1, color: "gray", color: "text.secondary" }}
        >
          Added by {blog.user?.username || "unknown user"}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Typography sx={{ mt: 1 }}>{blog.likes} likes</Typography>
          {user && (
            <Button variant="contained" onClick={handleLike}>
              like
            </Button>
          )}
          {user?.username === blog.user?.username && (
            <Button variant="outlined" color="error" onClick={handleRemove}>
              remove
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Blog;
