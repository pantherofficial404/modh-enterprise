import { Types } from 'mongoose';
export const isEmpty = (value: string) => !Boolean(value);

export const isEmail = (value: string) => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);

export const isValidPassword = (value: string) => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(value);

export const isIndianNumber = (value: string) => /^[0]?[789]\d{9}$/.test(value);

export const isValidPincode = (value: string) => /^[1-9][0-9]{5}$/.test(value);

export const isValidRating = (value: string) => /\b[0-5]{1}\b/.test(value);

export const isValidMongooseId = (value: string) => Types.ObjectId.isValid(value);

export default {
  isEmpty,
  isEmail,
  isValidPassword,
  isIndianNumber,
  isValidPincode,
  isValidRating,
  isValidMongooseId,
}
