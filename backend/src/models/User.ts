import { Document, Schema, model, HydratedDocument, ObjectId } from "mongoose";
import bcrypt from "bcryptjs";
import { Profile } from "./Profile";

export interface IUser extends Document {
  _id: ObjectId;
  fullName: string;
  email: string;
  password: string;
  role: string;
  profileCreated: boolean,
  bookmarks: ObjectId[],
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  profile?: {
    profilePicture?: string;
    [key: string]: any;
  };
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["creator"],
    default: "creator",
  },
  profileCreated: {
    type: Boolean,
    default: false,
  },
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: Profile,
      index: true,
      default: [],
    }
  ]
},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

userSchema.virtual("profile", {
  ref: "Profile",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = model<IUser>("User", userSchema);
export type IUserDocument = HydratedDocument<IUser>;