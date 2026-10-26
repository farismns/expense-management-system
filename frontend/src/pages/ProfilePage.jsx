import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ email: "", fullname: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const result = await api.getMyProfile(); const current = result?.data?.user; if (!current) throw new Error("Profile data is unavailable."); setUser(current); setForm({ email: current.email, fullname: current.fullname }); }
    catch (requestError) { setError(requestError.message || "Unable to load your profile."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { queueMicrotask(load); }, [load]);
  const changed = user && (form.email.trim() !== user.email || form.fullname.trim() !== user.fullname);
  function change(event) { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })); setError(""); setMessage(""); }
  function cancel() { setForm({ email: user.email, fullname: user.fullname }); setEditing(false); setError(""); }
  async function submit(event) {
    event.preventDefault();
    if (!form.fullname.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError("Enter your full name and a valid email address."); return; }
    setSaving(true); setError("");
    try { const result = await api.updateMyProfile({ email: form.email.trim(), fullname: form.fullname.trim() }); const updated = result?.data?.user; setUser(updated); setForm({ email: updated.email, fullname: updated.fullname }); setEditing(false); setMessage("Profile updated successfully."); }
    catch (requestError) { setError(requestError.message || "Unable to update your profile."); }
    finally { setSaving(false); }
  }
  return <section className="profile-page"><header className="page-heading"><div><h1>My Profile</h1><p>View and update your account information.</p></div>{user && !editing && <button className="primary-button" type="button" onClick={() => setEditing(true)}>Edit Profile</button>}</header>
    {error && <div className="dashboard-error" role="alert"><p>{error}</p><button type="button" onClick={load}>Retry</button></div>}{message && <p className="form-success" role="status">{message}</p>}
    {loading ? <p className="dashboard-status" role="status">Loading profile...</p> : user && <section className="content-card profile-card">{editing ? <form className="profile-form" onSubmit={submit}><div className="form-group"><label htmlFor="profile-fullname">Full name</label><input id="profile-fullname" name="fullname" value={form.fullname} onChange={change} maxLength="100" required disabled={saving} /></div><div className="form-group"><label htmlFor="profile-email">Email address</label><input id="profile-email" name="email" type="email" value={form.email} onChange={change} required disabled={saving} /></div><div className="transaction-form-actions"><button className="primary-button" type="submit" disabled={saving || !changed}>{saving ? "Saving..." : "Save Changes"}</button><button className="secondary-button" type="button" onClick={cancel} disabled={saving}>Cancel</button></div></form> : <dl className="profile-details"><div><dt>Full name</dt><dd>{user.fullname}</dd></div><div><dt>Email address</dt><dd>{user.email}</dd></div></dl>}</section>}
  </section>;
}
export default ProfilePage;
