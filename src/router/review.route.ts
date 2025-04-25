import type { Router } from "express";
import { reviewCourse, updateReview } from "../controllers/review.controller";
import { protectRoute, restrictTo } from "../middlewares";

export default (router: Router) => {
  router.post(
    "/review/review-course/:course_id",
    protectRoute,
    restrictTo("student"),
    reviewCourse
  );
  router.patch(
    "/review/update-review/:course_id",
    protectRoute,
    restrictTo("student"),
    updateReview
  );
  router.delete(
    "/review/delete-review/:course_id",
    protectRoute,
    restrictTo("student"),
    reviewCourse
  );
};
