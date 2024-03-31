import { body } from "express-validator";
import { withValidationErrors } from "./withErrorMiddleware.js";
import slug from "slug";
import pool from "../db.js";
import { BadRequestError } from "../errors/customErrors.js";

export const validateModule = withValidationErrors([
  body("name").notEmpty().withMessage(`Enter module name`),
  body("name")
    .isLength({ min: 3, max: 255 })
    .withMessage(`Module name must be between 3 to 255 characters`),
  body("name").custom(async (value, { req }) => {
    const input = slug(value);
    const check = await pool.query(
      `select count(id) from modules where slug=$1`,
      [input]
    );
    if (Number(check.rows[0].count) > 0) {
      throw new BadRequestError(`Module exists`);
    }
    return true;
  }),
  body("desc")
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 255 })
    .withMessage(`Description must be between 3 to 255 characters`),
]);