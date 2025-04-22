import e, { NextFunction, Request, Response } from "express";
import courseModel from "../models/course.model";
import enrolledModel from "../models/enrolled.model";
import AppError from "../utils/error-handlers/app-error";
import catchAsyncError from "../utils/error-handlers/catch-async-error";

export const getCourses = catchAsyncError(
  async (req: Request, res: Response) => {
    let query = courseModel.find();

    if (req.query.category)
      query = query.find({ category: req.query.category });
    if (req.query.level) query = query.find({ level: req.query.level });
    if (req.query.availability)
      query = query.find({ availability: req.query.availability });
    if (req.query.title) query = query.find({ title: req.query.title });

    if (req.query.sort)
      query = query.sort((req.query.sort as string).split(",").join(" "));
    else query = query.sort("startDate");

    query = query
      .populate("reviews")
      .skip(((Number(req.query.page) || 1) - 1) * Number(req.query.limit) || 10)
      .limit(Number(req.query.limit) || 10);

    const courses = await query;

    res.status(200).json({
      status: "success",
      data: { courses },
    });
  }
);

export const createCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = (req as any).identity.id;

    const {
      title,
      description,
      duration,
      availability,
      category,
      level,
      prerequisites,
      thumbnail,
      tags,
      lessons,
    } = req.body;

    const course = await courseModel.create({
      title,
      description,
      duration,
      availability,
      category,
      level,
      prerequisites,
      thumbnail,
      tags,
      lessons,
      instructor: user_id,
    });

    res.status(201).json({
      status: "success",
      data: { course },
    });
  }
);

export const getMyCourses = catchAsyncError(
  async (req: Request, res: Response) => {
    const user_id = (req as any).identity.id;
    const courses = await courseModel.find({ instructor: user_id });

    res.status(200).json({
      status: "success",
      data: { courses },
    });
  }
);

export const updateCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = (req as any).identity.id;
    const course_id = req.params.course_id;

    const course = await courseModel.findOne({
      _id: course_id,
      instructor: user_id,
    });
    if (!course) return next(new AppError("Course not found", 404));

    const {
      title,
      description,
      duration,
      availability,
      category,
      level,
      prerequisites,
      thumbnail,
      tags,
      lessons,
    } = req.body;

    course.title = title;
    course.description = description;
    course.duration = duration;
    course.availability = availability;
    course.category = category;
    course.level = level;
    course.prerequisites = prerequisites;
    course.thumbnail = thumbnail;
    course.tags = tags;
    course.lessons = lessons;

    await course.save();

    res.status(200).json({
      status: "success",
      data: { message: "Course updated successfully" },
    });
  }
);

export const getCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const course_id = req.params.course_id;

    const course = await courseModel.findById(course_id).populate({
      path: "instructor",
      select: "username email profile_picture _id",
    });

    res.status(200).json({
      status: "success",
      data: { course },
    });
  }
);

export const getEnrolledCourses = catchAsyncError(
  async (req: Request, res: Response) => {
    const user_id = (req as any).identity.id;

    const courses = await enrolledModel
      .find({ user: user_id })
      .populate({
        path: "course",
        select:
          "title description instructor duration availability category level thumbnail lessons",
      })
      .populate({
        path: "course.instructor",
        select: "username email profile_picture _id",
      });

    res.status(200).json({
      status: "success",
      data: { courses },
    });
  }
);

export const enrollInCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = (req as any).identity;

    const course_id = req.params.course_id;
    const course = await courseModel.findById(course_id);
    if (!course) return next(new AppError("Course not found", 404));

    if (await enrolledModel.findOne({ user: user_id, course: course_id }))
      return next(new AppError("Already enrolled in this course", 400));

    await enrolledModel.create({
      user: user_id,
      course: course_id,
      lessons: course.lessons.map((lesson) => ({
        course_id: lesson._id,
        completed: false,
        notes: "",
      })),
    });

    res.status(201).json({
      status: "success",
      data: { message: "Enrolled successfully" },
    });
  }
);

export const updateProgress = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = (req as any).identity.id;
    const course_id = req.params.course_id;

    const enrolled = await enrolledModel.findOne({
      user: user_id,
      course: course_id,
    });

    if (!enrolled)
      return next(new AppError("Not enrolled in this course", 404));

    enrolled.lessons.map((lesson) =>
      lesson.course_id.toString() === req.body.lesson_id
        ? { ...lesson, completed: req.body.completed, notes: req.body.notes }
        : lesson
    );

    enrolled.progress = Math.round(
      (enrolled.lessons.filter((lesson) => lesson.completed).length /
        enrolled.lessons.length) *
        100
    );

    await enrolled.save();

    res.status(200).json({
      status: "success",
      data: { message: "Progress updated successfully" },
    });
  }
);

export const requestCertificate = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = (req as any).identity.id;
    const course_id = req.params.course_id;

    const enrolled = await enrolledModel.findOne({
      user: user_id,
      course: course_id,
    });

    if (!enrolled)
      return next(new AppError("Not enrolled in this course", 404));

    enrolled.completed =
      enrolled.progress === 100 &&
      enrolled.exams.every((exam) => exam.completed);

    if (!enrolled.completed)
      return next(new AppError("Course not completed", 400));

    if (!enrolled.certificateRequested)
      enrolled.certificateRequested = new Date();

    await enrolled.save();

    res.status(200).json({
      status: "success",
      data: {
        message: "You are eligible for a certificate",
      },
    });
  }
);
