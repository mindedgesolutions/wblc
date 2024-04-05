import { body } from "express-validator";
import { withValidationErrors } from "./withErrorMiddleware.js";
import { BadRequestError } from "../errors/customErrors.js";

export const validateAuth = withValidationErrors([
  body("username").notEmpty().withMessage(`Enter username`),
  body("password").notEmpty().withMessage(`Enter password`),
  body("inputCaptcha")
    .notEmpty()
    .withMessage(`Enter captcha`)
    .custom((value, { req }) => {
      if (value !== req.body.captcha) {
        throw new BadRequestError(`Incorrect captcha entered`);
      }
      return true;
    }),
]);
