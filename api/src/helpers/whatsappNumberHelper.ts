/**
 * Inserts the digit '9' after the fourth character of a string/number.
 * @param {string|number} input - The original phone number or any digit string.
 * @returns {string} - The new string with '9' inserted after the fourth character.
 */
export const formatWhatsappNumber = (input: string): string => {
  const s = String(input).replace('whatsapp:', '');
  if (s.length <= 4) return s; // nothing to do if too short
  return s.slice(0, 4) + '9' + s.slice(4);
};
