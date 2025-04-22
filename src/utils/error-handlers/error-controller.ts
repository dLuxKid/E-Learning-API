import type { NextFunction, Request, Response } from "express";
import AppError from "./app-error";
import { Error as MongooseError } from "mongoose";

const handleCastErrorDB = (err: MongooseError.CastError): AppError =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsDB = (err: MongooseError): AppError =>
  new AppError(
    `user with email "${
      (err as any).keyValue.email
    }" already exists. Please use another email!`,
    400
  );

const handleValidationErrorDB = (err: MongooseError.ValidationError) =>
  new AppError(
    `Invalid input data: ${Object.values(err.errors)
      .map((el) => el.message)
      .join(", ")}`,
    400
  );

const handleJsonWebTokenError = () =>
  new AppError("Invalid Token, Please log in again", 401);

const handleTokenExpiredError = () =>
  new AppError("Expired Token, Please log in again", 401);

export default function globalErrorController(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else if (process.env.NODE_ENV === "production") {
    let error = err;
    error.message = err.message || "Something went wrong";

    if (error.name === "CastError")
      handleCastErrorDB(error as unknown as MongooseError.CastError);
    if (error.code === 11000) handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      handleValidationErrorDB(
        error as unknown as MongooseError.ValidationError
      );

    if (error.name === "JsonWebTokenError") error = handleJsonWebTokenError();
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    }
  }
}
