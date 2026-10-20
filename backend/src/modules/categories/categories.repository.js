import pool from "../../config/database.js";

const create = async ({ name, user_id }) => {
  const query = `
    INSERT INTO categories (name, user_id)
    VALUES ($1, $2)
    RETURNING id, name
  `;

  const { rows } = await pool.query(query, [name, user_id]);
  return rows[0];
};

const findAllByUserId = async (userId) => {
  const query = `
    SELECT id, name
    FROM categories
    WHERE user_id = $1
    ORDER BY id ASC
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows;
};

const findByIdAndUserId = async (categoryId, userId) => {
  const query = `
    SELECT id, name
    FROM categories
    WHERE id = $1
      AND user_id = $2
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [categoryId, userId]);
  return rows[0] ?? null;
};

const updateByIdAndUserId = async (categoryId, userId, name) => {
  const query = `
    UPDATE categories
    SET name = $1
    WHERE id = $2
      AND user_id = $3
    RETURNING id, name
  `;

  const { rows } = await pool.query(query, [name, categoryId, userId]);

  return rows[0] ?? null;
};

const deleteByIdAndUserId = async (categoryId, userId) => {
  const query = `
    DELETE FROM categories
    WHERE id = $1
      AND user_id = $2
    RETURNING id, name
  `;

  const { rows } = await pool.query(query, [categoryId, userId]);
  return rows[0] ?? null;
};

export default {
  create,
  findAllByUserId,
  findByIdAndUserId,
  updateByIdAndUserId,
  deleteByIdAndUserId,
};
