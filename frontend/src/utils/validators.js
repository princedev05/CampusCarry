export const isEmail = (value = "") => /\S+@\S+\.\S+/.test(value);

export const isOtp = (value = "") => /^\d{6}$/.test(value);

export const minLength = (value = "", min = 1) => value.trim().length >= min;
