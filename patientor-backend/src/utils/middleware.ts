import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";

export const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).json({ error: "unknown endpoint!" });
};

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
): void => {
  if (error instanceof MongooseError) {
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else if (error.name === "CastError") {
      res.status(400).json({ error: "malformatted id" });
    }
  } else if (error instanceof mongoose.mongo.MongoServerError) {
    res.status(400).json({ error: "expected patient name to be unique" });
  }
  next(error);
};
