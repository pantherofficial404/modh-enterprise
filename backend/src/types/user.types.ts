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

export type IAddressType = 'HOME' | 'WORK';

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
  type: IAddressType;
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
  type: IAddressType;
}

export interface IUpdateAddressBody extends IAddAddressBody {
  uuid: string;
}