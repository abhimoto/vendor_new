
export const isValidAadhaar = (value?: string): boolean => {
  return /^\d{12}$/.test(value?.replace(/\s/g, '') || '');
};

export const isValidPhone = (value?: string): boolean => {
  return /^[6-9]\d{9}$/.test(value || '');
};

export const getValidationColor = (
  value: string | undefined,
  isValid: boolean,
): string => {
  if (!value?.trim()) return '#D1D5DB';

  return isValid ? '#16A34A' : '#DC2626';
};
