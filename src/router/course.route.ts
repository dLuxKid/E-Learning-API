import type { Router } from "express";
import {
  enrollInCourse,
  getCourse,
  getCourses,
  getMyCourses,
  requestCertificate,
  updateCourse,
  updateProgress,
} from "../controllers/course.controller";
import { protectRoute, restrictTo } from "../middlewares";

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
  router.post("/course/enroll/:course_id", protectRoute, enrollInCourse);
  router.post(
    "/course/update-progress/:course_id",
    protectRoute,
    updateProgress
  );
  router.patch(
    "/course/update-progress/:course_id",
    protectRoute,
    restrictTo("instructor"),
    updateCourse
  );
};
