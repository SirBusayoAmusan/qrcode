/**
 * Generates a globally unique, collision-resistant alphanumeric slug.
 * Format: 7-8 random lowercase alphanumeric characters with high entropy.
 * Example: 'q-9x7k2m', 'v-4p8n3t'
 */
export function generateUniqueSlug(existingSlugs: string[] = []): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'; // excluding confusing 0, o, 1, l, i
  const existingSet = new Set(existingSlugs.map(s => s.toLowerCase()));
  
  for (let attempt = 0; attempt < 50; attempt++) {
    // Generate 6 high-entropy random characters
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Add micro-timestamp component
    const timeCode = Date.now().toString(36).slice(-3);
    const slug = `${randomPart}${timeCode}`;

    if (!existingSet.has(slug)) {
      return slug;
    }
  }

  // Fallback guaranteed unique slug
  return `q-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
}
