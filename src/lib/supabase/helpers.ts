/**
 * Type-safe helper for Supabase query results.
 * Casts the result to the expected type since our manual types
 * may not perfectly match the generated client expectations.
 */
export function asRows<T>(data: unknown): T[] {
  return (data as T[] | null) ?? [];
}

export function asRow<T>(data: unknown): T | null {
  return (data as T | null) ?? null;
}
