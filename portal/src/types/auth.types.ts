export interface ISignupBody {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  mobileNo: string;
  isVerified?: boolean;
}

export interface ILoginBody {
  email: string;
  password: string;
}