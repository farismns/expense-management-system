import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const result = await api.login({
        email,
        password,
      });

      const token = result?.data?.token;

      if (!token) {
        throw new Error("Login response did not include an access token.");
      }

      const user = result?.data?.user;
      if (!user) {
        throw new Error("Login response did not include user data.");
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      storage.setItem("token", token);
      setUser(user);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-container">
      <section className="auth-card">
        <h1>Welcome Back</h1>
        <p>Log in to manage your finances.</p>

        {success && (
          <p className="form-success" role="status">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <label className="remember-me"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> Remember me</label>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p className="auth-footer"><Link to="/forgot-password">Forgot your password?</Link></p>
      </section>
    </main>
  );
}

export default LoginForm;
