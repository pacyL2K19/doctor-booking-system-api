import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a random UUID string
 * This is a replacement for the crypto.randomUUID() function
 * which is not available in all Node.js versions
 */
export const generateRandomUUID = (): string => {
  return uuidv4();
}; 