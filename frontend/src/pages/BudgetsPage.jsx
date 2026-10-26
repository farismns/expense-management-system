import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api.js";

const today = new Date().toISOString().slice(0, 10);
const initialForm = { category_id: "", amount: "", start_date: today, end_date: today };
const formatCurrency = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
const listFrom = (result, key) => Array.isArray(result?.data) ? result.data : result?.data?.[key] ?? [];

function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const expenseCategories = useMemo(() => categories.filter(({ type }) => type === "expense"), [categories]);
  const names = useMemo(() => new Map(categories.map(({ id, name }) => [Number(id), name])), [categories]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [budgetResult, categoryResult] = await Promise.all([api.getBudgets(), api.getCategories()]);
      setBudgets(listFrom(budgetResult, "budgets"));
      setCategories(listFrom(categoryResult, "categories"));
    } catch (requestError) { setError(requestError.message || "Unable to load budgets."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { queueMicrotask(load); }, [load]);

  function reset() { setForm(initialForm); setEditing(null); }
  function change(event) { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })); setError(""); setMessage(""); }
  async function submit(event) {
    event.preventDefault();
    if (!form.category_id || Number(form.amount) <= 0 || form.start_date > form.end_date) { setError("Choose an expense category, enter a positive amount, and use a valid date range."); return; }
    setSaving(true); setError("");
    try {
      const payload = { ...form, category_id: Number(form.category_id), amount: Number(form.amount) };
      if (editing) await api.updateBudget(editing.id, payload); else await api.createBudget(payload);
      setMessage(editing ? "Budget updated successfully." : "Budget created successfully."); reset(); await load();
    } catch (requestError) { setError(requestError.message || "Unable to save budget."); }
    finally { setSaving(false); }
  }
  function edit(budget) { setEditing(budget); setForm({ category_id: String(budget.category_id), amount: String(budget.amount), start_date: budget.start_date, end_date: budget.end_date }); setError(""); setMessage(""); }
  async function remove(budget) {
    const name = names.get(Number(budget.category_id)) || "this category";
    if (!window.confirm(`Delete the budget for ${name}?`)) return;
    try { await api.deleteBudget(budget.id); if (editing?.id === budget.id) reset(); setMessage("Budget deleted successfully."); await load(); }
    catch (requestError) { setError(requestError.message || "Unable to delete budget."); }
  }
  return <section className="budgets-page">
    <header className="page-heading"><div><h1>Budgets</h1><p>Set spending limits for expense categories and periods.</p></div></header>
    {error && <div className="dashboard-error" role="alert"><p>{error}</p><button type="button" onClick={load}>Retry</button></div>}
    {message && <p className="form-success" role="status">{message}</p>}
    <section className="content-card budget-form-card"><h2>{editing ? "Edit Budget" : "Create Budget"}</h2><p>Budgets for the same category cannot have overlapping periods.</p>
      <form className="budget-form" onSubmit={submit}><div className="transaction-form-grid">
        <div className="form-group"><label htmlFor="budget-category">Expense category</label><select id="budget-category" name="category_id" value={form.category_id} onChange={change} required disabled={saving}><option value="">Select category</option>{expenseCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
        <div className="form-group"><label htmlFor="budget-amount">Budget limit (IDR)</label><input id="budget-amount" name="amount" type="number" min="0.01" step="any" value={form.amount} onChange={change} required disabled={saving} /></div>
        <div className="form-group"><label htmlFor="budget-start">Start date</label><input id="budget-start" name="start_date" type="date" value={form.start_date} max={form.end_date} onChange={change} required disabled={saving} /></div>
        <div className="form-group"><label htmlFor="budget-end">End date</label><input id="budget-end" name="end_date" type="date" value={form.end_date} min={form.start_date} onChange={change} required disabled={saving} /></div>
      </div><div className="transaction-form-actions"><button className="primary-button" type="submit" disabled={saving || !expenseCategories.length}>{saving ? "Saving..." : editing ? "Update Budget" : "Save Budget"}</button>{editing && <button className="secondary-button" type="button" onClick={reset} disabled={saving}>Cancel</button>}</div></form>
      {!loading && !expenseCategories.length && <p className="form-error">Create an expense category before setting a budget.</p>}
    </section>
    {loading ? <p className="dashboard-status" role="status">Loading budgets...</p> : <section className="content-card budgets-card"><h2>Your Budgets</h2>{!budgets.length ? <div className="empty-state">No budgets yet. Create one to plan your spending.</div> : <div className="transactions-table-wrapper"><table className="transactions-table"><thead><tr><th>Category</th><th>Limit</th><th>Period</th><th>Actions</th></tr></thead><tbody>{budgets.map((budget) => <tr key={budget.id}><td>{names.get(Number(budget.category_id)) || "Unknown category"}</td><td className="amount-column">{formatCurrency(budget.amount)}</td><td>{budget.start_date} — {budget.end_date}</td><td><div className="transaction-actions"><button className="secondary-button" type="button" onClick={() => edit(budget)}>Edit</button><button className="delete-button" type="button" onClick={() => remove(budget)}>Delete</button></div></td></tr>)}</tbody></table></div>}</section>}
  </section>;
}

export default BudgetsPage;
