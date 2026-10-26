import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
function ForgotPasswordPage() {
  const [email, setEmail] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event) { event.preventDefault(); setLoading(true); setError(""); try { const result = await api.forgotPassword(email.trim()); setMessage(result?.message || "If that email is registered, a reset link has been sent."); } catch (requestError) { setError(requestError.message || "Unable to request a reset link."); } finally { setLoading(false); } }
  return <main className="auth-container"><section className="auth-card"><h1>Reset Password</h1><p>Enter your email and we will send a reset link.</p>{message && <p className="form-success" role="status">{message}</p>}<form onSubmit={submit}><div className="form-group"><label htmlFor="reset-email">Email</label><input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></div>{error && <p className="form-error" role="alert">{error}</p>}<button disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button></form><p className="auth-footer"><Link to="/login">Back to log in</Link></p></section></main>;
}
export default ForgotPasswordPage;
