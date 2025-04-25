import { NextFunction, Request, Response } from "express";
import enrolledModel from "../models/enrolled.model";
import reviewModel from "../models/review.model";
import AppError from "../utils/error-handlers/app-error";
import catchAsyncError from "../utils/error-handlers/catch-async-error";

export const reviewCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = (req as any).identity.id;
    const course_id = req.params.course_id;

    if (
      !(await enrolledModel.findOne({
        user: user_id,
        course: course_id,
      }))
    )
      return next(new AppError("Not enrolled in this course", 404));

    await reviewModel.create({
      user: user_id,
      course: course_id,
      review: req.body.review,
      rating: req.body.rating,
    });

    res.status(201).json({
      status: "success",
      data: { message: "Review submitted successfully" },
    });
  }
);

export const updateReview = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = (req as any).identity.id;
    const course_id = req.params.course_id;

    const review = await reviewModel.findOne({
      user: user_id,
      course: course_id,
    });

    if (!review) return next(new AppError("Review not found", 404));

    review.review = req.body.review;
    review.rating = req.body.rating;

    await review.save();

    res.status(200).json({
      status: "success",
      data: { message: "Review updated successfully" },
    });
  }
);

export const deleteReview = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = (req as any).identity.id;
    const course_id = req.params.course_id;

    await reviewModel.findOneAndDelete({
      user: user_id,
      course: course_id,
    });

    res.status(204).json({
      status: "success",
      data: { message: "Review deleted successfully" },
    });
  }
);
