export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

export const validatePincode = (pincode: string): boolean => {
  const re = /^[1-9][0-9]{5}$/;
  return re.test(pincode);
};

export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
