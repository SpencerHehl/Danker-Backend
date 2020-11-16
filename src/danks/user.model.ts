import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    displayName: string;
    email?: string;
    userId: string;
}

export const UserSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String },
    userId: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', UserSchema);
