import pool from "../../config/database.js";

const findFinancialSummary = async (userId, startDate, endDate) => {
  const query = `
    SELECT
      COALESCE(
        SUM(amount) FILTER (WHERE type = 'income'),
        0
      )::text AS total_income,
      COALESCE(
        SUM(amount) FILTER (WHERE type = 'expense'),
        0
      )::text AS total_expense,
      (
        COALESCE(
          SUM(amount) FILTER (WHERE type = 'income'),
          0
        ) -
        COALESCE(
          SUM(amount) FILTER (WHERE type = 'expense'),
          0
        )
      )::text AS net_balance
    FROM transactions
    WHERE user_id = $1
      AND date >= $2
      AND date <= $3
  `;

  const values = [userId, startDate, endDate];
  const { rows } = await pool.query(query, values);

  return rows[0];
};

const findExpensesByCategory = async (userId, startDate, endDate) => {
  const query = `
    SELECT
      t.category_id,
      COALESCE(c.name, 'Uncategorized') AS category_name,
      SUM(t.amount)::text AS total_expense
    FROM transactions AS t
    LEFT JOIN categories AS c
      ON c.id = t.category_id
      AND c.user_id = t.user_id
    WHERE t.user_id = $1
      AND t.type = 'expense'
      AND t.date >= $2
      AND t.date <= $3
    GROUP BY
      t.category_id,
      c.name
    ORDER BY SUM(t.amount) DESC, t.category_id ASC
  `;

  const values = [userId, startDate, endDate];
  const { rows } = await pool.query(query, values);

  return rows;
};

export default {
  findFinancialSummary,
  findExpensesByCategory,
};
