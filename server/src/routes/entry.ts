import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
import { Entry } from "../models/Entry.js";

const router = express.Router();

const entrySchema = z.object({
  groupId: z.string().trim().min(1, "groupId is required"),
  metric: z.string().trim().min(1, "metric is required"),
  value: z.union([z.number(), z.boolean(), z.string()]),
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const parsed = entrySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const currentDate = new Date().toISOString().split("T")[0];

  try {
    const entry = await Entry.create({
      userId: req.userId,
      groupId: parsed.data.groupId,
      metric: parsed.data.metric,
      value: parsed.data.value,
      date: currentDate,
    });

    return res.status(201).json({
      success: true,
      message: "Entry created successfully",
      entry,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Invalid entry data",
      });
    }

    console.error("Create entry failed", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
