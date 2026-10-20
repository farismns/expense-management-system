import pool from "../../config/database.js";

const create = async ({
  user_id,
  category_id,
  amount,
  start_date,
  end_date,
}) => {
  const query = `
    INSERT INTO budgets (
      user_id,
      category_id,
      amount,
      start_date,
      end_date
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
  id,
  user_id,
  category_id,
  amount,
  to_char(start_date, 'YYYY-MM-DD') AS start_date,
  to_char(end_date, 'YYYY-MM-DD') AS end_date
  `;

  const values = [user_id, category_id, amount, start_date, end_date];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findAllByUserId = async (userId) => {
  const query = `
    SELECT
      id,
      user_id,
      category_id,
      amount,
      to_char(start_date, 'YYYY-MM-DD') AS start_date,
      to_char(end_date, 'YYYY-MM-DD') AS end_date
    FROM budgets
    WHERE user_id = $1
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows;
};

const findByIdAndUserId = async (budgetId, userId) => {
  const query = `
    SELECT
      id,
      user_id,
      category_id,
      amount,
      to_char(start_date, 'YYYY-MM-DD') AS start_date,
      to_char(end_date, 'YYYY-MM-DD') AS end_date
    FROM budgets
    WHERE id = $1
      AND user_id = $2
  `;

  const { rows } = await pool.query(query, [budgetId, userId]);
  return rows[0] ?? null;
};

const updateByIdAndUserId = async (
  budgetId,
  userId,
  { category_id, amount, start_date, end_date },
) => {
  const query = `
    UPDATE budgets
    SET
      category_id = $1,
      amount = $2,
      start_date = $3,
      end_date = $4
    WHERE id = $5
      AND user_id = $6
    RETURNING
  id,
  user_id,
  category_id,
  amount,
  to_char(start_date, 'YYYY-MM-DD') AS start_date,
  to_char(end_date, 'YYYY-MM-DD') AS end_date
  `;

  const values = [category_id, amount, start_date, end_date, budgetId, userId];

  const { rows } = await pool.query(query, values);
  return rows[0] ?? null;
};

const deleteByIdAndUserId = async (budgetId, userId) => {
  const query = `
    DELETE FROM budgets
    WHERE id = $1
      AND user_id = $2
    RETURNING
  id,
  user_id,
  category_id,
  amount,
  to_char(start_date, 'YYYY-MM-DD') AS start_date,
  to_char(end_date, 'YYYY-MM-DD') AS end_date
  `;

  const { rows } = await pool.query(query, [budgetId, userId]);
  return rows[0] ?? null;
};

const findOverlappingPeriod = async ({
  user_id,
  category_id,
  start_date,
  end_date,
  excludeBudgetId = null,
}) => {
  const query = `
    SELECT id
    FROM budgets
    WHERE user_id = $1
      AND category_id = $2
      AND start_date <= $4
      AND end_date >= $3
      AND ($5::integer IS NULL OR id <> $5)
    LIMIT 1
  `;

  const values = [user_id, category_id, start_date, end_date, excludeBudgetId];

  const { rows } = await pool.query(query, values);
  return rows[0] ?? null;
};

export default {
  create,
  findAllByUserId,
  findByIdAndUserId,
  updateByIdAndUserId,
  deleteByIdAndUserId,
  findOverlappingPeriod,
};
