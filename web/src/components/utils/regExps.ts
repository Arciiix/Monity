export const numericRegexp = /^\d*\.?\d*$/;
export const priceRegexp = /^\d*\.?\d{0,2}$/;
export const basicNameRegexp =
  /^(?![,.\/\-=():;!@#$%^&*])[A-ZĄĆĘŚŁŃÓŻŹ0-9,.\/\-=():;!@#$%^&* ]*$/i; // First parentheses - don't start with symbol, second part - allowed characters
