import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const emptyPasswordForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

function ProfilePage() {
  const { user, setUser, refreshUser } = useAuth();
  const [form, setForm] = useState({ email: "", fullname: "" });
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(!user);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) { queueMicrotask(() => { setForm({ email: user.email, fullname: user.fullname }); setLoading(false); }); return; }
    queueMicrotask(async () => { try { const current = await refreshUser(); setForm({ email: current.email, fullname: current.fullname }); } catch (requestError) { setError(requestError.message || "Unable to load your profile."); } finally { setLoading(false); } });
  }, [refreshUser, user]);

  const changed = user && (form.email.trim() !== user.email || form.fullname.trim() !== user.fullname);
  function change(event) { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })); setError(""); setMessage(""); }
  function cancel() { setForm({ email: user.email, fullname: user.fullname }); setEditing(false); setError(""); }
  async function saveProfile(event) {
    event.preventDefault();
    if (!form.fullname.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError("Enter your full name and a valid email address."); return; }
    setSaving(true); setError("");
    try { const result = await api.updateMyProfile({ email: form.email.trim(), fullname: form.fullname.trim() }); const updated = result?.data?.user; if (!updated) throw new Error("Profile data is unavailable."); setUser(updated); setForm({ email: updated.email, fullname: updated.fullname }); setEditing(false); setMessage("Profile updated successfully."); }
    catch (requestError) { setError(requestError.message || "Unable to update your profile."); } finally { setSaving(false); }
  }
  function changePasswordField(event) { const { name, value } = event.target; setPasswordForm((current) => ({ ...current, [name]: value })); setPasswordError(""); setMessage(""); }
  async function savePassword(event) {
    event.preventDefault();
    if (passwordForm.newPassword.length < 8) { setPasswordError("New password must be at least 8 characters long."); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordError("New password and confirmation do not match."); return; }
    setChangingPassword(true); setPasswordError("");
    try { await api.changeMyPassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }); setPasswordForm(emptyPasswordForm); setMessage("Password updated successfully. Use your new password next time you log in."); }
    catch (requestError) { setPasswordError(requestError.message || "Unable to update password."); } finally { setChangingPassword(false); }
  }

  return <section className="profile-page"><header className="page-heading"><div><h1>My Profile</h1><p>Update your account information and password separately.</p></div>{user && !editing && <button className="primary-button" type="button" onClick={() => setEditing(true)}>Edit Profile</button>}</header>
    {error && <div className="dashboard-error" role="alert"><p>{error}</p><button type="button" onClick={() => refreshUser()}>Retry</button></div>}{message && <p className="form-success" role="status">{message}</p>}
    {loading ? <p className="dashboard-status" role="status">Loading profile...</p> : user && <><section className="content-card profile-card">{editing ? <form className="profile-form" onSubmit={saveProfile}><div className="form-group"><label htmlFor="profile-fullname">Full name</label><input id="profile-fullname" name="fullname" value={form.fullname} onChange={change} maxLength="100" required disabled={saving} /></div><div className="form-group"><label htmlFor="profile-email">Email address</label><input id="profile-email" name="email" type="email" value={form.email} onChange={change} required disabled={saving} /></div><div className="transaction-form-actions"><button className="primary-button" type="submit" disabled={saving || !changed}>{saving ? "Saving..." : "Save Changes"}</button><button className="secondary-button" type="button" onClick={cancel} disabled={saving}>Cancel</button></div></form> : <dl className="profile-details"><div><dt>Full name</dt><dd>{user.fullname}</dd></div><div><dt>Email address</dt><dd>{user.email}</dd></div></dl>}</section>
      <section className="content-card profile-card password-card"><h2>Change Password</h2><p>Changing your name or email does not change your password.</p><form className="profile-form" onSubmit={savePassword}><div className="form-group"><label htmlFor="current-password">Current password</label><input id="current-password" name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={changePasswordField} autoComplete="current-password" required disabled={changingPassword} /></div><div className="form-group"><label htmlFor="new-password">New password</label><input id="new-password" name="newPassword" type="password" value={passwordForm.newPassword} onChange={changePasswordField} minLength="8" autoComplete="new-password" required disabled={changingPassword} /></div><div className="form-group"><label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={changePasswordField} minLength="8" autoComplete="new-password" required disabled={changingPassword} /></div>{passwordError && <p className="form-error" role="alert">{passwordError}</p>}<div className="transaction-form-actions"><button className="primary-button" type="submit" disabled={changingPassword}>{changingPassword ? "Updating..." : "Update Password"}</button></div></form></section></>}</section>;
}
export default ProfilePage;
