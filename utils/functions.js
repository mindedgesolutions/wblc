import dayjs from "dayjs";
import pool from "../db.js";
import slug from "slug";

export const createUsername = async (name) => {
  let username = slug(name);
  const check = await pool.query(
    `select count(id) from user_master where username=$1`,
    [username]
  );
  let newUsername;
  if (Number(check.rows[0].count) === 0) {
    newUsername = username;
  } else {
    newUsername = username + check.rows[0].count;
  }
  return newUsername;
};

export const currentDate = () => {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
};

export const formatStartDate = (date) => {
  const startArray = date.split("-");
  const filterStart = dayjs(
    `${startArray[2]}-${startArray[1]}-${startArray[0]}`,
    "Asia/Kolkata"
  ).format(`YYYY-MM-DD ${process.env.REPORT_START_TIME}`);

  return filterStart;
};
