import pool from "../../config/database.js";

const CATEGORY_FIELDS = "id, name, type, is_default";

const create = async ({ name, user_id, type }) => {
  const query = `
    INSERT INTO categories (name, user_id, type, is_default)
    VALUES ($1, $2, $3, FALSE)
    RETURNING ${CATEGORY_FIELDS}
  `;

  const { rows } = await pool.query(query, [name, user_id, type]);
  return rows[0];
};

const findAllByUserId = async (userId) => {
  const query = `
    SELECT ${CATEGORY_FIELDS}
    FROM categories
    WHERE user_id = $1
    ORDER BY type ASC, is_default DESC, name ASC
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows;
};

const findByIdAndUserId = async (categoryId, userId) => {
  const query = `
    SELECT ${CATEGORY_FIELDS}
    FROM categories
    WHERE id = $1 AND user_id = $2
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
      AND is_default = FALSE
    RETURNING ${CATEGORY_FIELDS}
  `;

  const { rows } = await pool.query(query, [name, categoryId, userId]);
  return rows[0] ?? null;
};

const deleteByIdAndUserId = async (categoryId, userId) => {
  const query = `
    DELETE FROM categories
    WHERE id = $1
      AND user_id = $2
      AND is_default = FALSE
    RETURNING ${CATEGORY_FIELDS}
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
