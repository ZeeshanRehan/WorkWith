import { Schema, model, type Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User: Model<IUser> = model<IUser>("User", userSchema);
