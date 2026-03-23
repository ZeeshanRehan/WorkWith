import { Schema, Types, model, type Model } from "mongoose";

export interface IEntry {
  userId: Types.ObjectId;
  groupId: string;
  metric: string;
  value: number | boolean | string;
  date: string;
}

const entrySchema = new Schema<IEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    groupId: {
      type: String,
      required: true,
      trim: true,
    },
    metric: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
  },
  {
    timestamps: true,
  },
);

export const Entry: Model<IEntry> = model<IEntry>("Entry", entrySchema);
