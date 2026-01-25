/**
 * Generate a unique organization code
 * Format: ORG-XXXXX (e.g., "ORG-A3B9K")
 */
export function generateOrgCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude similar-looking characters
    let code = "ORG-";

    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return code;
}
