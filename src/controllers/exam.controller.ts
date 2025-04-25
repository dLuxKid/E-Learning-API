import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../utils/error-handlers/catch-async-error";
import examModel from "../models/exam.model";
import AppError from "../utils/error-handlers/app-error";
import enrolledModel from "../models/enrolled.model";

export const getExams = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const course_id = req.params.course_id;

    const exams = await examModel.find({ course: course_id });

    res.status(200).json({
      status: "success",
      data: { exams },
    });
  }
);

export const createExam = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, course_id, duration, questions } = req.body;
    const user_id = (req as any).identity.id;

    const exam = await examModel.create({
      course: course_id,
      user: user_id,
      title,
      description,
      duration,
      questions,
    });

    res.status(201).json({
      status: "success",
      message: "Exam created successfully",
      data: { exam },
    });
  }
);

export const updateExam = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const exam_id = req.params.exam_id;
    const user_id = (req as any).identity.id;

    const exam = await examModel.findOne({ _id: exam_id, user: user_id });
    if (!exam) return next(new AppError("Exam not found", 404));

    const { title, description, duration, questions } = req.body;

    exam.title = title;
    exam.description = description;
    exam.duration = duration;
    exam.questions = questions;

    await exam.save();

    res.status(200).json({
      status: "success",
      message: "Exam updated successfully",
    });
  }
);

export const deleteExam = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const exam_id = req.params.exam_id;
    const user_id = (req as any).identity.id;

    await examModel.findByIdAndDelete({
      _id: exam_id,
      user: user_id,
    });

    res.status(204).json({
      status: "success",
      message: "Exam deleted successfully",
    });
  }
);

export const submitExam = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const exam_id = req.params.exam_id;
    const user_id = (req as any).identity.id;

    const exam = await examModel.findById(exam_id).select("+questions.answer");
    if (!exam) return next(new AppError("Exam not found", 404));

    const { answers } = req.body;

    if (!answers || answers.length !== exam.questions.length)
      return next(new AppError("Please answer all questions", 400));

    const score = exam.questions.reduce(
      (acc, question, i) => acc + (question.answer === answers[i] ? 1 : 0),
      0
    );

    const enrolledCourse = await enrolledModel.findOne({
      course: exam.course,
      user: user_id,
    });
    if (!enrolledCourse) return next(new AppError("Course not found", 404));

    enrolledCourse.exams.map((exam) =>
      exam.exam_id.toString() === exam_id
        ? { ...exam, completed: true, score }
        : exam
    );

    await enrolledCourse.save();

    res.status(201).json({
      status: "success",
      data: { score, exam, answers },
    });
  }
);
