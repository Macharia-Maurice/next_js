import mongoose, {
    Document,
    Model,
    Schema
} from "mongoose";

// 1. Define a TypeScript interface for the user schema
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    isVerified?: boolean;
    isAdmin?: boolean;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// 2. Create the schema
const userSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordTokenExpiry: {
        type: Date,
    },
    verifyToken: {
        type: String,
    },
    verifyTokenExpiry: {
        type: Date,
    },
}, { timestamps: true });

// 3. Define the User model with the interface
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;