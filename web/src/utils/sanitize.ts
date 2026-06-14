/**
 * Utility to sanitize user input and prevent Cross-Site Scripting (XSS).
 * In a production scenario with actual Supabase insertions, this ensures 
 * that malicious <script> tags or harmful attributes are stripped before 
 * reaching the database or being rendered on the screen.
 */

// Simple regex-based stripper for demonstration.
// In production, use a robust library like DOMPurify or xss.
export function sanitizeHTML(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script[^>]*?>.*?<\/script>/gi, '')
    .replace(/<[\/\!]*?[^<>]*?>/gi, '')
    .replace(/<style[^>]*?>.*?<\/style>/gi, '')
    .replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
}

export function escapeString(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
