import * as mongoose from 'mongoose';
import { IUser, UserSchema } from './user.model';

export interface IDank extends mongoose.Document {
    danker: IUser;
    dankee: IUser;
    dankText: string;
    dateTime: Date;
}

export const DankSchema = new mongoose.Schema({
    dankee: UserSchema,
    danker: UserSchema,
    dankText: { type: String, required: true },
    dateTime: { type: Date },
});

export const Dank = mongoose.model<IDank>('Dank', DankSchema);
