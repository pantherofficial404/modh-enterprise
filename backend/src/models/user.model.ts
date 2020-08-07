// Libraries
import Mongoose from 'mongoose';

// Project files
import { IUser } from '@app/types';

type IUserModel = IUser & Mongoose.Document;

const UserSchema = new Mongoose.Schema<IUser>({
  firstName: { type: Mongoose.Schema.Types.String, required: true },
  lastName: { type: Mongoose.Schema.Types.String, required: true },
  password: { type: Mongoose.Schema.Types.String, required: true },
  email: { type: Mongoose.Schema.Types.String, required: true },
  mobileNo: { type: Mongoose.Schema.Types.String, required: true },
  otp: { type: Mongoose.Schema.Types.String, required: false },
  roles: [{ type: Mongoose.Schema.Types.String, required: true }],
  addresses: [{ type: Mongoose.Schema.Types.Mixed, required: false }],
  isVerified: { type: Mongoose.Schema.Types.Boolean, default: false },
  forgotPasswordToken: { type: Mongoose.Schema.Types.String, required: false },
  favouritesProducts: { type: Mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const User = Mongoose.model<IUserModel>('user', UserSchema);
export default User;