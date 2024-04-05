import { body } from "express-validator";
import { withValidationErrors } from "./withErrorMiddleware.js";
import {
  BadRequestError,
  UnauthenticatedError,
} from "../errors/customErrors.js";
import { verifyJWT } from "../utils/functions.js";

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

export const protectRoute = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError(`Login required`);
  }
  try {
    const { uuid } = verifyJWT(token);
    req.uuid = { uuid };
    next();
  } catch (error) {
    throw new UnauthenticatedError(`Login required`);
  }
};
