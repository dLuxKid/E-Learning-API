import express, { Router } from "express";
import authenticationRouter from "./auth.route";
import courseRouter from "./course.route";
import userRouter from "./user.route";
import examRouter from "./exam.route";
import reviewRouter from "./review.route";

const router = express.Router();

export default (): Router => {
  userRouter(router);
  authenticationRouter(router);
  courseRouter(router);
  examRouter(router);
  reviewRouter(router);

  return router;
};
