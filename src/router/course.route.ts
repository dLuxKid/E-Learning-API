import type { Router } from "express";
import {
  createCourse,
  enrollInCourse,
  getCourse,
  getCourses,
  getMyCourses,
  requestCertificate,
  updateCourse,
  updateProgress,
} from "../controllers/course.controller";
import { handleMediaUpload, protectRoute, restrictTo } from "../middlewares";

export default (router: Router) => {
  router.get("/course/get-all-courses", getCourses);
  router.get(
    "/course/get-my-courses",
    protectRoute,
    restrictTo("instructor"),
    getMyCourses
  );
  router.get("/course/get-course/:course_id", protectRoute, getCourse);
  router.get(
    "/course/get-enrolled-courses",
    protectRoute,
    restrictTo("student"),
    getMyCourses
  );
  router.get(
    "/course/request-certificate/:course_id",
    protectRoute,
    restrictTo("student"),
    requestCertificate
  );
  router.post(
    "/course/create-course",
    protectRoute,
    restrictTo("instructor"),
    handleMediaUpload,
    createCourse
  );
  router.post("/course/enroll/:course_id", protectRoute, enrollInCourse);
  router.post(
    "/course/update-progress/:course_id",
    protectRoute,
    updateProgress
  );
  router.patch(
    "/course/update-course/:course_id",
    protectRoute,
    restrictTo("instructor"),
    handleMediaUpload,
    updateCourse
  );
};
