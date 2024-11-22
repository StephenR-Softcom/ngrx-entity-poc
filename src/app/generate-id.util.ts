const ID_LENGTH = 8;

export const generateId = (): string => {
  const randomHex = Math.random().toString(16);
  const startIndex = 2; // Skip the leading "0."
  return randomHex.substring(startIndex, startIndex + ID_LENGTH);
}
