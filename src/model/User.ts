import mongoose, { Schema, Document } from 'mongoose';


export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true }
})

export interface User extends Document {

    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifiedCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: [true, 'Username is required'], unique: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Invalid email'] },
    password: { type: String, required: true },
    verifyCode: { type: String, required: true },
    verifiedCodeExpiry: { type: Date, required: true },
    isVerified: { type: Boolean, default: false, },
    isAcceptingMessages: { type: Boolean, default: true },
    messages: [MessageSchema]
})



const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;