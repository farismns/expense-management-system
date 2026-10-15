import pool from "../../config/database.js";

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

export default { findByIdAndUserId };
