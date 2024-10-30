import express from "express";
import cookieParser from "cookie-parser";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
const PORT = 8000;
import userRouter from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users", userRouter);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
