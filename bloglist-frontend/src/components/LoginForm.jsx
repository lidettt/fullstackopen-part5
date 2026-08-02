import { TextField, Button } from "@mui/material";
const LoginForm = ({
  handleLogin,
  username,
  password,
  handlePasswordChange,
  handleUsernameChange,
  // notification,
}) => {
  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Log in to application</h2>
        <div>
          <TextField
            variant="standard"
            label="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <TextField
            variant="standard"
            label="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  );
};
export default LoginForm;
