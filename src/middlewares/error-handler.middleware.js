import { ApiError } from "../utils/apiError.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: "Internal Server Error" });
};
