import { body } from "express-validator";
import { withValidationErrors } from "./withErrorMiddleware.js";
import { isMobileNumber } from "../utils/formatValidation.js";
import { BadRequestError } from "../errors/customErrors.js";
import pool from "../db.js";

export const validateUser = withValidationErrors([
  body("name").notEmpty().withMessage(`Enter name`),
  body("mobile")
    .isNumeric()
    .withMessage(`Mobile no. must be a numeric`)
    .custom(isMobileNumber)
    .withMessage(`Invalid mobile no.`)
    .custom(async (value) => {
      const check = await pool.query(
        `select count(id) from user_master where mobile=$1`,
        [value]
      );
      if (check.rows[0].count > 0) {
        throw new BadRequestError(`Mobile no. exists`);
      }
      return true;
    }),
  body("email")
    .isEmail()
    .withMessage(`Enter a valid email address`)
    .custom(async (value) => {
      const check = await pool.query(
        `select count(id) from user_master where email=$1`,
        [value]
      );
      if (check.rows[0].count > 0) {
        throw new BadRequestError(`Email exists`);
      }
      return true;
    }),
  body("roles").custom((value) => {
    if (value.length === 0) {
      throw new BadRequestError(`Select at least role for the user`);
    }
    return true;
  }),
]);
