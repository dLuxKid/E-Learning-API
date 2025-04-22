import { Router } from "express";
import {
  createExam,
  deleteExam,
  getExams,
  submitExam,
  updateExam,
} from "../controllers/exam.controller";
import { protectRoute, restrictTo } from "../middlewares";

export default (router: Router) => {
  router.get("/exam/get-exam/:course_id", getExams);
  router.post(
    "/exam/create-exam",
    protectRoute,
    restrictTo("instructor"),
    createExam
  );
  router.put(
    "/exam/update-exam/:exam_id",
    protectRoute,
    restrictTo("instructor"),
    updateExam
  );
  router.delete(
    "/exam/delete-exam/:exam_id",
    protectRoute,
    restrictTo("instructor"),
    deleteExam
  );
  router.post(
    "/exam/submit-exam/:exam_id",
    protectRoute,
    restrictTo("student"),
    submitExam
  );
  // router.get("/exam/get-submitted-exams", protectRoute, getSubmittedExams);
};
