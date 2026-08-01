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
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};
export default LoginForm;
