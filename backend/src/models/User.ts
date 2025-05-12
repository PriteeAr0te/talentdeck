import {Document, Schema, model, HydratedDocument} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    fullName: {type: String, required: true},
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
},
{ timestamps: true}
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next(); // Skip if password wasn't changed
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  // 🔍 Method to Match Password (Login check)
  userSchema.methods.matchPassword = async function (
    enteredPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  };

export const User = model<IUser>("User", userSchema);
export type IUserDocument = HydratedDocument<IUser>;