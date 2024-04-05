import pool from "../db.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/customErrors.js";
import { checkPassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/functions.js";

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  const checkUname = await pool.query(
    `select count(id)::INTEGER from user_master where username='${username}'`,
    []
  );
  if (checkUname.rows[0].count === 0) {
    throw new BadRequestError(`User doesn't exist`);
  }
  const user = await pool.query(
    `select * from user_master where username='${username}'`
  );
  const checkPass = await checkPassword(password, user.rows[0].password);
  if (!checkPass) {
    throw new BadRequestError(`Incorrect password! Please try again`);
  }
  const token = createJWT({
    uuid: user.rows[0].uuid,
  });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.OK).json({ token });
};

export const adminLogout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};
