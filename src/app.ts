import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  NextFunction,
  Request,
  Response,
  type Application,
} from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import AppError from "./utils/error-handlers/app-error";
import globalErrorController from "./utils/error-handlers/error-controller";
import router from "./router";

const app: Application = express();

app.use(compression());
app.use(cookieParser());
app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 10 * 60 * 1000,
  message: "Too many requests from this IP, Try again in an hour",
});
app.use("/", limiter);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(mongoSanitize());
app.use(
  cors({
    credentials: true,
  })
);
app.use(hpp());

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});
app.use("/", router());
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 500));
});
app.use(globalErrorController);

export default app;
