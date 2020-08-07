// Project files
import { IAddAddressBody } from '@app/types';
import * as Validator from './validator.helpers';

export const validateAddress = (body: IAddAddressBody): string[] => {
  const formErrors: string[] = [];
  if (Validator.isEmpty(body?.address1)) {
    formErrors.push('Address1 is required');
  }
  if (Validator.isEmpty(body?.city)) {
    formErrors.push('City is required');
  }
  if (Validator.isEmpty(body?.name)) {
    formErrors.push('Name is required');
  }
  if (Validator.isEmpty(body?.state)) {
    formErrors.push('State is required');
  }
  if (!Validator.isIndianNumber(body?.mobileNo)) {
    formErrors.push('Mobile no is invalid');
  }
  if (body?.alternateMobileNo && !Validator.isIndianNumber(body?.alternateMobileNo)) {
    formErrors.push('Alternate mobile no is invalid');
  }
  if (!Validator.isValidPincode(String(body?.pincode))) {
    formErrors.push('Pincode is invalid');
  }
  if (!(body?.type === 'HOME' || body?.type === 'WORK')) {
    formErrors.push('Address type should be either home or work');
  }
  return formErrors;
}

export default {
  validateAddress,
}