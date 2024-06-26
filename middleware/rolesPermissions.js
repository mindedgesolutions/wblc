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
    const { id } = req.params;
    const condition = id ? `slug=$1 and id!=$2` : `slug=$1`;
    const values = id ? [input, id] : [input];
    const check = await pool.query(
      `select count(id) from modules where ${condition}`,
      values
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

export const validateRole = withValidationErrors([
  body("name").notEmpty().withMessage(`Enter role`),
  body("name")
    .isLength({ min: 3, max: 255 })
    .withMessage(`Role must be between 3 to 255 characters`),
  body("name").custom(async (value, { req }) => {
    const input = slug(value);
    const { id } = req.params;
    const condition = id ? `slug=$1 and id!=$2` : `slug=$1`;
    const values = id ? [input, id] : [input];
    const check = await pool.query(
      `select count(id) from roles where ${condition}`,
      values
    );
    if (Number(check.rows[0].count) > 0) {
      throw new BadRequestError(`Role exists`);
    }
    return true;
  }),
  body("desc")
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 255 })
    .withMessage(`Description must be between 3 to 255 characters`),
]);

export const validatePermission = withValidationErrors([
  body("moduleId").notEmpty().withMessage(`Select a module`),
  body("name")
    .notEmpty()
    .withMessage(`Enter permission name`)
    .custom(async (value, { req }) => {
      const { moduleId } = req.body;
      const input = slug(value);
      const { id } = req.params;
      const condition = id
        ? `slug=$1 and module_id=$2 and id!=$3`
        : `slug=$1 and module_id=$2`;
      const values = id ? [input, moduleId, id] : [input, moduleId];

      const check = await pool.query(
        `select count(id) from permissions where ${condition}`,
        values
      );
      if (Number(check.rows[0].count) > 0) {
        throw new BadRequestError(`Permissions exists`);
      }
      return true;
    }),
  body("desc")
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 255 })
    .withMessage(`Description must be between 3 to 255 characters`),
]);
