import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./auth.store";
import "./login.css";

export default function Login() {
  const [role, setRole] = useState("chef");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = login(role, password);
    if (!success) {
      setError("Invalid credentials");
      return;
    }

    navigate("/orders");
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>KOT Dashboard</h2>
        <p className="subtitle">Restaurant Control Panel</p>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="chef">Chef</option>
          <option value="manager">Manager</option>
        </select>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>

        <div className="hint">
          <p>Chef → chef@123</p>
          <p>Manager → manager@123</p>
        </div>
      </form>
    </div>
  );
}
