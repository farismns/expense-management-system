import pool from "../../config/database.js";

const findByEmail = async (email) => {
  const query = `
    SELECT id, email, password, fullname
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [email]);

  return rows[0] ?? null;
};

const create = async ({ email, password, fullname }) => {
  const query = `
    INSERT INTO users (email, password, fullname)
    VALUES ($1, $2, $3)
    RETURNING id, email, fullname
  `;

  const { rows } = await pool.query(query, [email, password, fullname]);

  return rows[0];
};

export default {
  findByEmail,
  create,
};
