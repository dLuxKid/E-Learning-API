import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import merge from "lodash/merge";
import { hasChangedPasswordAfter } from "../utils";
import { uploadMedia } from "../utils/upload-image";
import catchAsyncError from "../utils/error-handlers/catch-async-error";
import AppError from "../utils/error-handlers/app-error";
import userModel from "../models/user.model";

interface JwtPayload {
  id: string;
  iat: number;
}

export const protectRoute = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.cookies["jwt"]) {
      token = req.cookies["jwt"];
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to gain access", 401)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const currentUser = await userModel.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }

    if (hasChangedPasswordAfter(currentUser, decoded.iat)) {
      return next(
        new AppError("User recently changed password! Please log in again", 401)
      );
    }

    merge(req, { identity: currentUser });
    next();
  }
);

export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.cookies["jwt"]) {
      token = req.cookies["jwt"];
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next();

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const currentUser = await userModel.findById(decoded.id);
      if (!currentUser) return next();

      if (hasChangedPasswordAfter(currentUser, decoded.iat)) return next();

      merge(req, { identity: currentUser });
      return next();
    } catch (err) {
      return next();
    }
  }
);

export const handleMediaUpload = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.profile_picture)
      req.body.profile_picture = await uploadMedia(req.body.profile_picture);
    else if (
      req.body.thumbnail &&
      !req.body.thumbnail.startsWith("https://res.cloudinary.com/")
    )
      req.body.thumbnail = await uploadMedia(req.body.thumbnail);
    else if (req.body.lessons.length) {
      req.body.lessons.map(async (lesson) => {
        if (!lesson.thumbnail.startsWith("https://res.cloudinary.com/"))
          lesson.thumbnail = await uploadMedia(lesson.thumbnail);
      });
      req.body.lessons.map(async (lesson) => {
        if (!lesson.video.startsWith("https://res.cloudinary.com/"))
          lesson.video = await uploadMedia(lesson.video);
      });
    }

    next();
  }
);

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).identity.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
