import pool from "../db";
import slug from "slug";

export const createUsername = async (name) => {
  let username = slug(name);
  const check = await pool.query(
    `select count(id) from user_master where username=$1`,
    [username]
  );
  let newUsername;
  if (check.rows[0].count === 0) {
    newUsername = username;
  } else {
    newUsername = username + check.rows[0].count;
  }
  return newUsername;
};
