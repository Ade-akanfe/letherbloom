import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a random password
 * Format: 3 words + 2 numbers (e.g., "Sunset-Ocean-River-42")
 */
export function generateRandomPassword(): string {
    const words = [
        "Sunset",
        "Ocean",
        "River",
        "Mountain",
        "Forest",
        "Valley",
        "Meadow",
        "Canyon",
        "Desert",
        "Island",
        "Storm",
        "Thunder",
        "Lightning",
        "Rainbow",
        "Horizon",
        "Aurora",
        "Glacier",
        "Volcano",
        "Cascade",
        "Summit",
    ];

    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    const word3 = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(Math.random() * 100);

    return `${word1}-${word2}-${word3}-${num}`;
}
