interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * In-memory IP rate limiting to prevent spam and denial of service.
 * @param ip Client IP address
 * @param limit Maximum allowed requests within windowMs
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 10 * 60 * 1000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Periodic cleanup if map grows
  if (rateLimitMap.size > 5000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetAt < now) rateLimitMap.delete(key);
    }
  }

  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown-ip";
}
