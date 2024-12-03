import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError } from "zod"

export const errorHandling: (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => void = (error, request, response, _) => {
  if (error instanceof AppError) {
    return response
      .status(error.statusCode)
      .json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return response
      .status(400)
      .json({ message: "validation error", issues: error.format() });
  }

  return response.status(500).json({ message: error.message });
};