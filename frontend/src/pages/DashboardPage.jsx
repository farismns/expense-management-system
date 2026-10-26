import { useEffect, useState } from "react";
import { api } from "../api.js";

function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

  return {
    startDate: `${year}-${month}-01`,
    endDate: `${year}-${month}-${String(lastDay).padStart(2, "0")}`,
  };
}

const initialPeriod = getCurrentMonthRange();

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
    timeZone: "UTC",
  }).format(date);
}

function DashboardPage() {
  const [startDate, setStartDate] = useState(initialPeriod.startDate);
  const [endDate, setEndDate] = useState(initialPeriod.endDate);

  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const [summaryResult, expensesResult, transactionsResult] =
          await Promise.all([
            api.getSummary(startDate, endDate),
            api.getExpensesByCategory(startDate, endDate),
            api.getTransactions(),
          ]);

        if (cancelled) {
          return;
        }

        setSummary(summaryResult?.data?.summary ?? null);
        setExpenses(expensesResult?.data?.expenses ?? []);
        setTransactions(transactionsResult?.data?.transactions ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load dashboard data. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [startDate, endDate, retryKey]);

  const summaryCards = [
    {
      title: "Total Income",
      value: summary?.totalIncome,
      description: "Income during selected period",
      className: "income-value",
    },
    {
      title: "Total Expenses",
      value: summary?.totalExpense,
      description: "Expenses during selected period",
      className: "expense-value",
    },
    {
      title: "Net Balance",
      value: summary?.netBalance,
      description: "Income minus expenses",
      className: "",
    },
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="dashboard-page">
      <section className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your personal finances.</p>
        </div>
      </section>

      <section className="date-filter">
        <div className="date-filter-heading">
          <h2>Reporting Period</h2>
          <p>Select a date range to update your financial summary.</p>
        </div>

        <div className="date-filter-fields">
          <label>
            <span>Start Date</span>
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>

          <label>
            <span>End Date</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
        </div>
      </section>

      {error && (
        <div className="dashboard-error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => {
              setRetryKey((previous) => previous + 1);
            }}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <p className="dashboard-status" role="status">
          Loading dashboard data...
        </p>
      ) : (
        <>
          <section className="summary-grid">
            {summaryCards.map((card) => (
              <article className="summary-card" key={card.title}>
                <p className="summary-title">{card.title}</p>
                <h2 className={card.className}>
                  {summary ? formatCurrency(card.value) : "Unavailable"}
                </h2>
                <p className="summary-description">{card.description}</p>
              </article>
            ))}
          </section>

          <section className="dashboard-grid">
            <article className="content-card">
              <h2>Expenses by Category</h2>
              <p>Breakdown of expenses during the selected period.</p>

              {expenses.length === 0 ? (
                <div className="empty-state">
                  No expense data available for this period.
                </div>
              ) : (
                <div className="category-list">
                  {expenses.map((item, index) => {
                    const total = Number(item.totalExpense ?? 0);
                    const overallExpense = expenses.reduce(
                      (sum, expense) => sum + Number(expense.totalExpense ?? 0),
                      0,
                    );

                    const percentage =
                      overallExpense > 0 ? (total / overallExpense) * 100 : 0;

                    return (
                      <div
                        className="category-item"
                        key={item.categoryId ?? `category-${index}`}
                      >
                        <div className="category-item-heading">
                          <span>{item.categoryName}</span>
                          <strong>{formatCurrency(total)}</strong>
                        </div>

                        <div className="category-track">
                          <div
                            className="category-bar"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>

            <article className="content-card">
              <h2>Recent Transactions</h2>
              <p>Your latest recorded transactions.</p>

              {recentTransactions.length === 0 ? (
                <div className="empty-state">No transactions found.</div>
              ) : (
                <div className="transaction-list">
                  {recentTransactions.map((transaction) => (
                    <div className="transaction-item" key={transaction.id}>
                      <div className="transaction-info">
                        <strong>
                          {transaction.description?.trim() ||
                            (transaction.type === "income"
                              ? "Income"
                              : "Expense")}
                        </strong>
                        <span>{formatDate(transaction.date)}</span>
                      </div>

                      <strong
                        className={
                          transaction.type === "income"
                            ? "income-value"
                            : "expense-value"
                        }
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
