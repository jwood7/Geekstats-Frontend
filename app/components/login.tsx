import { useState, useEffect, useRef } from "react";
import { login, logout } from "../actions";
import { getCookie } from "cookies-next";

export default function LoginModal(params: { setShowLogin: (show: boolean) => void }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Create a reference to the username input field
  const usernameRef = useRef<HTMLInputElement>(null);

  // Function to handle login
  async function handleLogin(showErrorMsg?: boolean) {
    let userId = getCookie("userId")?.toString() ?? "-1";
    setLoggedIn(!(parseInt(userId) < 0));
    if (userId === "-1") {
      if (username.length > 0 && password.length > 0) {
        const user = await login(username, password);
        if (user.username) {
          setLoginError("");
          userId = getCookie("userId")?.toString() ?? "-1";
          setLoggedIn(!(parseInt(userId) < 0));
          params.setShowLogin(false);
        } else {
          setLoginError(user);
        }
      } else {
        if (showErrorMsg) setLoginError("Username and Password are required");
      }
    }
  }

  // Function to handle logout
  async function handleLogout() {
    await logout();
    const userId = getCookie("userId")?.toString() ?? "-1";
    setLoggedIn(!(parseInt(userId) < 0));
    params.setShowLogin(false);
  }

  // Effect to check login status on mount
  useEffect(() => {
    handleLogin(false);

    // Set focus to the username input when the component loads
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  // Submit handler for form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission
    handleLogin(true); // Trigger the login attempt
  };

  return (
    <div className="sm:rounded-2xl flex bg-white overflow-hidden h-full sm:w-1/3 sm:h-4/5 sm:my-20 sm:mx-auto flex-col items-center justify-between">
      <div className="flex flex-row justify-end w-full py-2 px-4">
        <button onClick={() => params.setShowLogin(false)}>X</button>
      </div>
      {!loggedIn ? (
        <>
          <h1 className="text-2xl">Login</h1>
          <form className="flex flex-col w-1/2 gap-2" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              ref={usernameRef} // Attach the ref to the username input
              className="bg-[#EAEAEA] px-1"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              className="bg-[#EAEAEA] px-1"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-red-500">{loginError}</p>
            <button type="submit" className="bg-silver px-5 py-1 rounded mb-32">
              Submit
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="text-2xl">Log out</h1>
          <p>Are you sure you want to log out?</p>
          <button className="bg-silver px-5 py-1 rounded mb-32" onClick={() => handleLogout()}>
            Log out
          </button>
        </>
      )}
    </div>
  );
}
