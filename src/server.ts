import dotenv from "dotenv";
import mongoose, { Error } from "mongoose";
import app from "./app";

dotenv.config({ path: "./.env" });

const port = process.env.PORT;
const DB = process.env.DB as string;

mongoose.Promise = Promise;
mongoose
  .connect(DB)
  .then(() => console.log("connection successfull"))
  .catch((error: Error) => console.log(error));

app.listen(port, () => console.log(`listening on port - ${port}`));
