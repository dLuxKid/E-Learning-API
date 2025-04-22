import type { Router } from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  updatePassword,
} from "../controllers/auth.controller";
import { protectRoute } from "../middlewares";

export default (router: Router) => {
  router.post("/auth/login", login);
  router.post("/auth/signup", signup);
  router.post("/auth/forgot-password", forgotPassword);
  router.put("/auth/reset-password", resetPassword);
  router.put("/auth/update-password", protectRoute, updatePassword);
};
