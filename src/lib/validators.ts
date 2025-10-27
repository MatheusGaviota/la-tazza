export const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  
  return digit === parseInt(cleaned.charAt(10));
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

export const validateBirthDate = (dateString: string): boolean => {
  if (!dateString) return true;
  const birthDate = new Date(dateString);
  const today = new Date();
  return birthDate <= today;
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password.trim()) {
    return { valid: false, error: 'Digite a senha' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'A senha deve ter pelo menos 6 caracteres' };
  }
  return { valid: true };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};
