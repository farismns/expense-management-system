import pool from "../../config/database.js";

const create = async ({
  date,
  amount,
  type,
  category_id,
  description,
  user_id,
}) => {
  const query = `
    INSERT INTO transactions (
      date,
      amount,
      type,
      category_id,
      description,
      user_id
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      date,
      amount,
      type,
      category_id,
      description
  `;

  const values = [date, amount, type, category_id, description, user_id];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findAllByUserId = async (userId) => {
  const query = `
    SELECT
      id,
      date,
      amount,
      type,
      category_id,
      description
    FROM transactions
    WHERE user_id = $1
    ORDER BY date DESC, id DESC
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows;
};

const findByIdAndUserId = async (transactionId, userId) => {
  const query = `
    SELECT
      id,
      date,
      amount,
      type,
      category_id,
      description
    FROM transactions
    WHERE id = $1
      AND user_id = $2
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [transactionId, userId]);
  return rows[0] ?? null;
};

const updateByIdAndUserId = async (
  transactionId,
  userId,
  { date, amount, type, category_id, description },
) => {
  const query = `
    UPDATE transactions
    SET
      date = $1,
      amount = $2,
      type = $3,
      category_id = $4,
      description = $5
    WHERE id = $6
      AND user_id = $7
    RETURNING
      id,
      date,
      amount,
      type,
      category_id,
      description
  `;

  const values = [
    date,
    amount,
    type,
    category_id,
    description,
    transactionId,
    userId,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0] ?? null;
};

const deleteByIdAndUserId = async (transactionId, userId) => {
  const query = `
    DELETE FROM transactions
    WHERE id = $1
      AND user_id = $2
    RETURNING
      id,
      date,
      amount,
      type,
      category_id,
      description
  `;

  const values = [transactionId, userId];

  const { rows } = await pool.query(query, values);
  return rows[0] ?? null;
};

export default {
  create,
  findAllByUserId,
  findByIdAndUserId,
  updateByIdAndUserId,
  deleteByIdAndUserId,
};
