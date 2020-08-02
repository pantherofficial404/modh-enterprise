export type IUserRole = 'CUSTOMER' | 'ADMIN';

export interface IUser {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  mobileNo: string;
  otp?: string;
  roles: IUserRole[];
  addresses?: IAddress[];
  isVerified: boolean;
  forgotPasswordToken?: string;
}

export interface IAddress {
  uuid: string;
  name: string;
  mobileNo: string;
  alternateMobileNo?: string;
  pincode: number;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  landmark?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddAddressBody {
  name: string;
  mobileNo: string;
  alternateMobileNo?: string;
  pincode: number;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  landmark?: string;
}

export interface IUpdateAddressBody extends IAddAddressBody {
  uuid: string;
}