import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createInitialForm() {
  return {
    date: getToday(),
    type: "expense",
    amount: "",
    category_id: "",
    description: "",
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function formatDateForInput(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [formData, setFormData] = useState(createInitialForm);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api.getTransactions();
      const data = result?.data?.transactions;

      if (!Array.isArray(data)) {
        throw new Error("Invalid transactions response from server.");
      }

      const sorted = [...data].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );

      setTransactions(sorted);
    } catch (err) {
      setError(err.message || "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setCategoryLoading(true);
    setCategoryError("");

    try {
      const result = await api.getCategories();
      const data = result?.data?.categories;

      if (!Array.isArray(data)) {
        throw new Error("Invalid categories response from server.");
      }

      setCategories(data);
    } catch (err) {
      setCategoryError(err.message || "Unable to load categories.");
    } finally {
      setCategoryLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      loadTransactions();
      loadCategories();
    });
  }, [loadTransactions, loadCategories, retryKey]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => {
      if (name === "type") {
        return {
          ...previous,
          type: value,
          category_id: "",
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });

    setFormError("");
  }

  function openCreateForm() {
    setEditingId(null);
    setFormData(createInitialForm());
    setFormError("");
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccess("");

    const amount = Number(formData.amount);

    if (!formData.date) {
      setFormError("Please select a transaction date.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Amount must be greater than zero.");
      return;
    }

    if (
      formData.category_id &&
      !categories.some(
        (category) =>
          String(category.id) === String(formData.category_id) &&
          category.type === formData.type,
      )
    ) {
      setFormError(
        "The selected category does not match the transaction type.",
      );
      return;
    }

    if (formData.type === "expense" && !formData.category_id) {
      setFormError("Please select a category for expense transactions.");
      return;
    }

    const payload = {
      date: formData.date,
      type: formData.type,
      amount,
      category_id: formData.category_id ? Number(formData.category_id) : null,
      description: formData.description.trim(),
    };

    setSubmitting(true);

    try {
      if (editingId !== null) {
        await api.updateTransaction(editingId, payload);
        setSuccess("Transaction updated successfully.");
      } else {
        await api.createTransaction(payload);
        setSuccess("Transaction created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(createInitialForm());

      await loadTransactions();
    } catch (err) {
      setFormError(
        err.message || "Unable to save transaction. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const categoryNames = new Map(
    categories.map((category) => [Number(category.id), category.name]),
  );

  const filteredCategories = categories.filter(
    (category) => category.type === formData.type,
  );

  function handleEdit(transaction) {
    setEditingId(transaction.id);
    setFormError("");
    setError("");
    setSuccess("");

    setFormData({
      date: formatDateForInput(transaction.date),
      type: transaction.type,
      amount: String(transaction.amount ?? ""),
      category_id:
        transaction.category_id == null ? "" : String(transaction.category_id),
      description: transaction.description ?? "",
    });

    setShowForm(true);
  }

  async function handleDelete(transaction) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${transaction.description || "this transaction"}"?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(transaction.id);
    setError("");
    setSuccess("");

    try {
      await api.deleteTransaction(transaction.id);

      setTransactions((previous) =>
        previous.filter((item) => item.id !== transaction.id),
      );

      setSuccess("Transaction deleted successfully.");
    } catch (err) {
      setError(
        err.message || "Unable to delete transaction. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="transactions-page">
      <section className="page-heading">
        <div>
          <h1>Transactions</h1>
          <p>View and manage your income and expenses.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openCreateForm}
        >
          + Add Transaction
        </button>
      </section>

      {success && (
        <p className="form-success" role="status">
          {success}
        </p>
      )}

      {showForm && (
        <section className="content-card transaction-form-card">
          <h2>{editingId !== null ? "Edit Transaction" : "Add Transaction"}</h2>
          <p>Enter the details of your income or expense.</p>

          <form className="transaction-form" onSubmit={handleSubmit}>
            <div className="transaction-form-grid">
              <div className="form-group">
                <label htmlFor="transaction-date">Date</label>
                <input
                  id="transaction-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="transaction-type">Type</label>
                <select
                  id="transaction-type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="transaction-amount">Amount (IDR)</label>
                <input
                  id="transaction-amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="any"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 50000"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="transaction-category">Category</label>
                <select
                  id="transaction-category"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  disabled={categoryLoading || Boolean(categoryError)}
                  required={formData.type === "expense"}
                >
                  <option value="">
                    {categoryLoading
                      ? "Loading categories..."
                      : categoryError
                        ? "Failed to load categories"
                        : formData.type === "expense"
                          ? "Select expense category"
                          : "Select income category"}
                  </option>

                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {categoryError && (
                  <small className="form-error">{categoryError}</small>
                )}

                {!categoryLoading &&
                  !categoryError &&
                  filteredCategories.length === 0 && (
                    <small className="form-error">
                      No categories available for this transaction type. Please
                      create a category first.
                    </small>
                  )}
              </div>

              <div className="form-group transaction-description-field">
                <label htmlFor="transaction-description">Description</label>
                <input
                  id="transaction-description"
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Lunch"
                />
              </div>
            </div>

            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}

            <div className="transaction-form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormError("");
                }}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={submitting || categoryLoading}
              >
                {submitting
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Transaction"
                    : "Save Transaction"}
              </button>
            </div>
          </form>
        </section>
      )}

      {error && (
        <div className="dashboard-error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setRetryKey((previous) => previous + 1)}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <p className="dashboard-status" role="status">
          Loading transactions...
        </p>
      ) : !error && transactions.length === 0 ? (
        <section className="content-card">
          <div className="empty-state">
            No transactions found. Add your first transaction to get started.
          </div>
        </section>
      ) : !error ? (
        <section className="content-card transactions-card">
          <div className="transactions-heading">
            <h2>All Transactions</h2>
            <p>{transactions.length} transaction(s) found</p>
          </div>

          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th className="amount-column">Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.date)}</td>

                    <td className="transaction-description">
                      {transaction.description?.trim() || "-"}
                    </td>

                    <td>
                      {transaction.category_id == null
                        ? "Uncategorized"
                        : (categoryNames.get(Number(transaction.category_id)) ??
                          "Unknown category")}
                    </td>

                    <td>
                      <span
                        className={`transaction-type ${
                          transaction.type === "income"
                            ? "transaction-type-income"
                            : "transaction-type-expense"
                        }`}
                      >
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>

                    <td
                      className={`amount-column ${
                        transaction.type === "income"
                          ? "income-value"
                          : "expense-value"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td>
                      <div className="transaction-actions">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => handleEdit(transaction)}
                          disabled={deletingId === transaction.id}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDelete(transaction)}
                          disabled={deletingId === transaction.id}
                        >
                          {deletingId === transaction.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default TransactionsPage;
